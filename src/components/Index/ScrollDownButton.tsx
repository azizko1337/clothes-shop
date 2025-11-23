"use client";

import Image from "next/image";

export default function ScrollDownButton() {
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <button 
      onClick={handleScroll}
      className="w-20 aspect-square absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer z-20 animate-bounce bg-transparent border-none p-0"
      aria-label="Scroll down"
    >
      <Image
        src="/images/scroll-down-mouse.webp"
        alt="Przesuń w dół"
        fill={true}
        className="object-contain"
      />
    </button>
  );
}
