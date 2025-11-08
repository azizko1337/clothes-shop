
import { ExternalLinkIcon } from "@/components/ui/icons/oi-external-link";

function AudioPlayer(){
    return (
        <div className="absolute top-10 right-10 w-40 flex flex-col items-center">
            <span className="text-foreground italic p-4 font-semibold tracking-wide">Radio CHANDRA</span>
            <audio>
                <source src="/public/audio/" type="audio/mpeg" />
            </audio>
            <span className="flex gap-2 pl-7 hover:underline cursor-pointer">SoundCloud <ExternalLinkIcon size={38} strokeWidth={0.5}/></span>
        </div>
    )
}

export default AudioPlayer;