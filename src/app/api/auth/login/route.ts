import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyTOTP } from '@/lib/totp';
import { signSession } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, code } = body;

    if (!username || !code) {
      return NextResponse.json({ error: 'Missing username or code' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      // Don't reveal user existence? Or maybe for admin login it's fine to be vague.
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = verifyTOTP(code, user.totpSecret);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    // Create session
    const token = await signSession({ userId: user.id, username: user.username });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
