import { GridCard } from "@/lib/games/cards/gridCard";
import { getGamesList } from "@/lib/games/logic/list"
import SearchClient from "./client";


export default function Search() {

    const games = getGamesList();


    return (
        <div className="w-full p-5 grow">
            <SearchClient games={games}/>
        </div>)
}