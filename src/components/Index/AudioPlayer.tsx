"use client"

import { ExternalLinkIcon } from "@/components/ui/icons/oi-external-link";
import { useRef, useState, useCallback, useEffect } from "react";

function AudioPlayer(){
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const rafRef = useRef<number | null>(null);

    const [playing, setPlaying] = useState(false);

    const setupAnalyzer = () => {
        if (audioCtxRef.current || !audioRef.current) return;
        const ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.75;
        const src = ctx.createMediaElementSource(audioRef.current);
        src.connect(analyser);
        analyser.connect(ctx.destination);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        sourceRef.current = src;
    };

    const draw = () => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;
        if (!canvas || !analyser) return;
        const ctx2d = canvas.getContext("2d");
        if (!ctx2d) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        ctx2d.clearRect(0, 0, canvas.width, canvas.height);

        analyser.getByteFrequencyData(dataArray);

        // Retro gradient background glow
        const grad = ctx2d.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, "#120e2a");
        grad.addColorStop(1, "#1a1738");
        ctx2d.fillStyle = grad;
        ctx2d.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 0.9;
        for (let i = 0; i < bufferLength; i++) {
            const value = dataArray[i];
            const h = (value / 255) * canvas.height * 0.45; // half height (mirror)
            const x = i * (canvas.width / bufferLength);

            // Color shift
            const hue = (i / bufferLength) * 260 + (value / 255) * 40;
            ctx2d.fillStyle = `hsl(${hue},70%,60%)`;

            // Upper bar
            ctx2d.fillRect(x, canvas.height / 2 - h, barWidth, h);
            // Lower mirror
            ctx2d.fillRect(x, canvas.height / 2, barWidth, h);
        }

        // Center line
        ctx2d.fillStyle = "rgba(255,255,255,0.15)";
        ctx2d.fillRect(0, canvas.height / 2 - 1, canvas.width, 2);

        rafRef.current = requestAnimationFrame(draw);
    };

    const startViz = () => {
        if (!analyserRef.current) return;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        draw();
    };

    const stopViz = () => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const c = canvas.getContext("2d");
            if (c) c.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const togglePlay = useCallback(() => {
        const el = audioRef.current;
        if (!el) return;
        if (playing) {
            el.pause();
            setPlaying(false);
            stopViz();
        } else {
            setupAnalyzer();
            el.play()
              .then(() => {
                  setPlaying(true);
                  startViz();
                  // Resume audio context if suspended (Chrome policy)
                  if (audioCtxRef.current?.state === "suspended") {
                      audioCtxRef.current.resume();
                  }
              })
              .catch(() => {});
        }
    }, [playing]);

    // Resize canvas to container size
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const resize = () => {
            canvas.width = canvas.clientWidth * window.devicePixelRatio;
            canvas.height = canvas.clientHeight * window.devicePixelRatio;
        };
        resize();
        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
            stopViz();
            audioCtxRef.current?.close().catch(()=>{});
        };
    }, []);

    return (
        <div className="absolute top-10 right-10 w-56 flex flex-col items-center gap-3">
            <span className="text-foreground italic p-4 font-semibold tracking-wide">
                Radio <span>CHANDRA</span>
            </span>
            <div className="w-full rounded-md overflow-hidden bg-[#0d0c19] border border-neutral-700 shadow-inner">
                <canvas
                    ref={canvasRef}
                    className={`block w-full h-32 transition-opacity duration-500 ${playing ? 'opacity-100' : 'opacity-30'}`}
                />
            </div>
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