"use client";

import { usePathname } from "next/navigation";
import CartTrigger from "@/components/Cart/CartTrigger";
import CartSheet from "@/components/Cart/CartSheet";
import AudioPlayer from "@/components/Index/AudioPlayer";

export default function GlobalOverlay() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <CartTrigger />
      <CartSheet />
      <AudioPlayer />
    </>
  );
}
