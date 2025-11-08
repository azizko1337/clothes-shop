"use client"

import { FaMusic } from "react-icons/fa6";

import { useRef, useState, useCallback, useEffect } from "react";
import clsx from "clsx";
import { MusicalNoteIcon } from "../ui/icons/oi-musical-note";
import { CiPlay1 } from "react-icons/ci";
import { CiPause1 } from "react-icons/ci";
import { FaExternalLinkAlt } from "react-icons/fa";



function AudioPlayer(){
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const rafRef = useRef<number | null>(null);

    const timeDataRef = useRef<Uint8Array | null>(null);

    const [playing, setPlaying] = useState(false);

    const setupAnalyzer = () => {
        if (audioCtxRef.current || !audioRef.current) return;
        const ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.75;

        const src = ctx.createMediaElementSource(audioRef.current);
        src.connect(analyser);
        analyser.connect(ctx.destination);

        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        timeDataRef.current = new Uint8Array(analyser.fftSize);
    };

    const draw = () => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;
        const timeArr = timeDataRef.current;
        if (!canvas || !analyser || !timeArr) return;
        const ctx2d = canvas.getContext("2d");
        if (!ctx2d) return;

        const w = canvas.width;
        const h = canvas.height;

        // czyste, przezroczyste tło
        ctx2d.clearRect(0, 0, w, h);

        analyser.getByteTimeDomainData(timeArr as unknown as Uint8Array<ArrayBuffer>);

        // Wave
        // kolor lekko pulsuje od RMS sygnału
        let sum = 0;
        for (let i=0;i<timeArr.length;i++){
            const v = (timeArr[i]-128)/128;
            sum += v*v;
        }
        const rms = Math.sqrt(sum / timeArr.length);
        const hue = (rms * 360) % 360;

        ctx2d.lineWidth = 2;
        ctx2d.strokeStyle = `hsl(${hue},85%,65%)`;
        ctx2d.beginPath();
        for (let i=0;i<timeArr.length;i++){
            const v = (timeArr[i]-128)/128;
            const x = (i/(timeArr.length-1))*w;
            const y = h/2 + v * h * 0.35;
            if (i===0) ctx2d.moveTo(x,y); else ctx2d.lineTo(x,y);
        }
        ctx2d.stroke();

        // delikatna poświata
        ctx2d.globalCompositeOperation = "lighter";
        ctx2d.lineWidth = 8;
        ctx2d.globalAlpha = 0.12;
        ctx2d.stroke();
        ctx2d.globalAlpha = 1;
        ctx2d.globalCompositeOperation = "source-over";

        rafRef.current = requestAnimationFrame(draw);
    };

    const startViz = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        draw();
    };

    const stopViz = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        const canvas = canvasRef.current;
        if (canvas) {
            const c = canvas.getContext("2d");
            if (c) c.clearRect(0,0,canvas.width,canvas.height);
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
                  if (audioCtxRef.current?.state === "suspended") {
                      audioCtxRef.current.resume();
                  }
              })
              .catch(()=>{});
        }
    }, [playing]);

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
        <div className="absolute top-10 right-10 w-64 flex flex-col items-center">
            <span className="text-foreground italic font-semibold tracking-wide flex gap-2 items-center pb-1">
                Radio <span>CHANDRA</span> <FaMusic size={14}/>
            </span>
            <div className={clsx("w-full rounded-md overflow-hidden bg-transparent border border-neutral-700 shadow-inner relative")}>
                <canvas
                    ref={canvasRef}
                    className={`block w-full h-40 transition-opacity duration-500 ${playing ? 'opacity-100' : 'opacity-30'}`}
                />
                <div className="absolute top-1 right-2 text-xs px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm tracking-wider">
                    <span>tyle pokus</span> <span className="italic">WAVE</span>
                </div>
                <div className="flex gap-2 w-full justify-center p-2">
                    <button
                        type="button"
                        onClick={togglePlay}
                        aria-pressed={playing}
                        className="px-4 py-1 rounded-md border text-sm font-medium hover:bg-accent hover:text-accent-foreground transition"
                    >
                        {playing ? <CiPause1 /> : <CiPlay1 />}
                    </button>
                </div>
            </div>
            <audio ref={audioRef} preload="none">
                <source src="/audio/tyle-pokus.mp3" type="audio/mpeg" />
            </audio>
            
            <div className="flex justify-end w-full pt-4 text-">
                <span className="flex gap-2 pl-7 hover:underline cursor-pointer text-sm text-accent-foreground">
                    SoundCloud <FaExternalLinkAlt size={12}/>
                </span>
            </div>
            
        </div>
    )
}

export default AudioPlayer;