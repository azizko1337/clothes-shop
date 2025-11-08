"use client"

import { ExternalLinkIcon } from "@/components/ui/icons/oi-external-link";
import { useRef, useState, useCallback } from "react";

function AudioPlayer(){
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);

    const togglePlay = useCallback(() => {
        const el = audioRef.current;
        if (!el) return;
        if (playing) {
            el.pause();
            setPlaying(false);
        } else {
            el.play().then(() => setPlaying(true)).catch(() => {});
        }
    }, [playing]);

    return (
        <div className="absolute top-10 right-10 w-44 flex flex-col items-center gap-2">
            <span className="text-foreground italic p-4 font-semibold tracking-wide">
                Radio <span className="">CHANDRA</span>
            </span>
            <audio ref={audioRef} preload="none">
                <source src="/audio/tyle-pokus.mp3" type="audio/mpeg" />
            </audio>
            <button
                type="button"
                onClick={togglePlay}
                aria-pressed={playing}
                className="px-4 py-1 rounded-md border text-sm font-medium hover:bg-accent hover:text-accent-foreground transition"
            >
                {playing ? "Pause" : "Play"}
            </button>
            <span className="flex gap-2 pl-7 hover:underline cursor-pointer">
                SoundCloud <ExternalLinkIcon size={38} strokeWidth={0.5}/>
            </span>
        </div>
    )
}

export default AudioPlayer;