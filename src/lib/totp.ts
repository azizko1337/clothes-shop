import { authenticator } from 'otplib';

export function verifyTOTP(token: string, secret: string) {
  authenticator.options = { window: 1 };
  return authenticator.check(token, secret);
}
