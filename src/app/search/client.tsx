'use client'

import { GridCard } from "@/lib/games/cards/gridCard";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

type gameData = {
  name?: string;
  description?: string;
  categories?: string;
  exclusiveTags?: string[];
  folder?: string;
}

type functionData = {
  games: gameData[]
}

export default function SearchClient({ games }: functionData) {
  const [searchTerm, setSearchTerm] = useState("");

    const filteredGames = games.filter(game =>
    game.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="w-full rounded-lg gap-5 flex flex-row items-center p-5 bg-main-700 min-h-10">
        <SearchIcon />
        <input
          className="grow outline-none"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-6 not-md:grid-cols-4 gap-5 mt-5">
        {filteredGames.map((game) => {
          if (!game.name || !game.folder) return null;
          return <GridCard name={game.name} id={game.folder} key={game.folder} />;
        })}
      </div>
    </>
  )
}
