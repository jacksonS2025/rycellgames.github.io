'use client'
import { useRef } from "react";
import { Maximize } from "lucide-react";

type game = {
    name: string,
    categories: string[],
    description: string,
    id: string,
    exclusiveTags?: string[];
}
type frameParams = {
    game: game
}

export default function GameFrame({ game }: frameParams) {

    const iframe = useRef<HTMLIFrameElement>(null);
    

    return (

            <div className="bg-main-800 flex flex-col rounded-4xl overflow-hidden">
                <iframe src={`/raw/games/${game.id}/index.html`} className="w-full aspect-video" title={game.name} ref={iframe}></iframe>
                <div className="grow p-5 flex flex-row justify-between">
                    <h1 className="text-xl">{game.name ?? game.id}</h1>
                    <button title="Fullscreen" className="hover:bg-white/50 p-2 rounded-[50%] transition-all hover:cursor-pointer"
                        onClick={() => iframe.current?.requestFullscreen()}
                    >
                        <Maximize />
                    </button>
                </div>
            </div>


    );
}