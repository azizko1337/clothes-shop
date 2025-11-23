// ...existing code...
"use client"

import { FaMusic, FaXmark } from "react-icons/fa6";
import { useRef, useState, useCallback, useEffect } from "react";
import clsx from "clsx";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { FaExternalLinkAlt } from "react-icons/fa";

function AudioPlayer(){
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const rafRef = useRef<number | null>(null);
    const timeDataRef = useRef<Uint8Array | null>(null);

    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [hoverSeek, setHoverSeek] = useState<number | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [iconColor, setIconColor] = useState<string>("");

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
        ctx2d.clearRect(0, 0, w, h);

        analyser.getByteTimeDomainData(timeArr as unknown as Uint8Array<ArrayBuffer>);

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

        ctx2d.globalCompositeOperation = "lighter";
        ctx2d.lineWidth = 8;
        ctx2d.globalAlpha = 0.10;
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

    // progress + metadata
    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
        const onTime = () => {
            setProgress(el.currentTime);
            if (!isNaN(el.duration)) setDuration(el.duration);
        };
        const onMeta = () => {
            if (!isNaN(el.duration)) setDuration(el.duration);
        };
        const onEnded = () => {
            setPlaying(false);
            stopViz();
            setProgress(0);
        };
        el.addEventListener("timeupdate", onTime);
        el.addEventListener("loadedmetadata", onMeta);
        el.addEventListener("ended", onEnded);
        return () => {
            el.removeEventListener("timeupdate", onTime);
            el.removeEventListener("loadedmetadata", onMeta);
            el.removeEventListener("ended", onEnded);
        };
    }, []);

    useEffect(() => {
        if (!playing) {
            setIconColor("");
            return;
        }
        const changeColor = () => {
            const h = Math.floor(Math.random() * 360);
            setIconColor(`hsl(${h}, 100%, 60%)`);
        };
        changeColor();
        const interval = setInterval(changeColor, 1000);
        return () => clearInterval(interval);
    }, [playing]);

    // volume binding
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

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

    const fmt = (sec: number) => {
        if (!isFinite(sec)) return "--:--";
        const m = Math.floor(sec/60);
        const s = Math.floor(sec%60);
        return `${m}:${s.toString().padStart(2,"0")}`;
    };

    const seek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !duration) return;
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const ratio = Math.min(Math.max((e.clientX - rect.left)/rect.width,0),1);
        audioRef.current.currentTime = ratio * duration;
        setProgress(audioRef.current.currentTime);
    };

    const percent = duration ? (progress / duration) * 100 : 0;
    const hoverPercent = hoverSeek != null && duration ? (hoverSeek / duration) * 100 : null;

    return (
        <>
            <button
                onClick={() => setIsExpanded(true)}
                className={clsx(
                    "fixed right-0 top-24 z-[100] p-3 bg-black/80 backdrop-blur-md text-accent rounded-l-xl border-y border-l border-neutral-800 shadow-2xl transition-transform duration-300",
                    isExpanded ? "translate-x-full" : "translate-x-0"
                )}
                aria-label="Otwórz odtwarzacz"
            >
                <FaMusic 
                    className={clsx(playing && "animate-spin-slow")} 
                    size={20} 
                    style={{ 
                        color: playing ? iconColor : undefined,
                        transition: "color 1s ease-in-out"
                    }}
                />
            </button>

            <div className={clsx(
                "flex flex-col items-center select-none transition-all duration-500 ease-in-out",
                "fixed inset-0 z-[100] bg-black/95 justify-center",
                isExpanded ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none translate-x-full"
            )}>
                <button 
                    onClick={() => setIsExpanded(false)}
                    className="absolute top-6 right-6 text-neutral-400 hover:text-white p-2"
                >
                    <FaXmark size={24} />
                </button>

                <div className="w-72 relative flex flex-col items-center">
                    <span className="text-foreground font-semibold tracking-wider flex gap-2 items-center uppercase text-xs mb-2">
                        <span className={clsx("flex items-center gap-1", playing && "animate-pulse")}>
                            <FaMusic className={clsx(playing && "animate-spin-slow")} />
                            Radio CHANDRA
                        </span>
                        <span className="px-2 py-0.5 rounded bg-accent text-accent-foreground text-[10px] font-medium">LIVE</span>
                    </span>

                    <div
                        className={clsx(
                            "relative w-full rounded-xl overflow-hidden backdrop-blur-md",
                            "border border-neutral-700/70",
                            "bg-gradient-to-br from-black/40 via-neutral-900/60 to-neutral-800/40",
                            "shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_10px_30px_-10px_rgba(0,0,0,0.6)]",
                            playing && "ring-2 ring-accent/50"
                        )}
                    >
                        <canvas
                            ref={canvasRef}
                            className={clsx(
                                "block w-full h-40 transition-opacity duration-500",
                                playing ? "opacity-100" : "opacity-30"
                            )}
                        />
                        <div className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
                        <div className="absolute top-1 right-2 text-[10px] px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm tracking-wider uppercase">
                            Wave Monitor
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col gap-3 p-3">
                            <div
                                className="group relative w-full h-3 rounded-md bg-neutral-800/70 cursor-pointer overflow-hidden"
                                onClick={seek}
                                onMouseMove={(e)=>{
                                    if (!duration) return;
                                    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                                    const ratio = Math.min(Math.max((e.clientX - rect.left)/rect.width,0),1);
                                    setHoverSeek(ratio * duration);
                                }}
                                onMouseLeave={()=>setHoverSeek(null)}
                                aria-label="Pasek postępu"
                            >
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent via-accent/70 to-accent/30 transition-all"
                                    style={{ width: `${percent}%` }}
                                />
                                {hoverPercent != null && (
                                    <div
                                        className="absolute inset-y-0 left-0 bg-white/10"
                                        style={{ width: `${hoverPercent}%` }}
                                    />
                                )}
                                <div className="absolute -inset-px rounded-md ring-1 ring-white/5 pointer-events-none" />
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300">
                                <span>{fmt(progress)}</span>
                                <span>{fmt(duration)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={togglePlay}
                                    aria-pressed={playing}
                                    aria-label={playing ? "Pauza" : "Odtwarzaj"}
                                    className={clsx(
                                        "relative inline-flex items-center justify-center",
                                        "h-12 w-12 rounded-full border ",
                                        "bg-neutral-900/70 hover:bg-neutral-800/70 transition",
                                        "text-accent border-foreground cursor-pointer"
                                    )}
                                >
                                    <span className={clsx("text-xl text-foreground", playing && "scale-95 transition")}>
                                        {playing ? <CiPause1 /> : <CiPlay1 />}
                                    </span>
                                    <span
                                        className={clsx(
                                            "absolute inset-0 rounded-full",
                                            "ring-2 ring-accent/40",
                                            playing ? "animate-pulse" : "opacity-40"
                                        )}
                                    />
                                </button>

                                <div className="flex flex-col gap-1 w-32">
                                    <label className="text-[10px] tracking-wider uppercase text-neutral-400">
                                        Głośność
                                    </label>
                                    <input
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={volume}
                                        onChange={(e)=>setVolume(parseFloat(e.target.value))}
                                        className="w-full accent-accent"
                                        aria-label="Regulacja głośności"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <audio ref={audioRef} preload="none">
                        <source src="/audio/tyle-pokus.mp3" type="audio/mpeg" />
                    </audio>

                    <div className="flex justify-end w-full pt-3">
                        <a
                            href="#"
                            className="flex gap-2 items-center hover:underline cursor-pointer text-[11px] tracking-wide text-neutral-300"
                            aria-label="Otwórz w SoundCloud"
                        >
                            SoundCloud <FaExternalLinkAlt size={12}/>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AudioPlayer;
// ...existing code...