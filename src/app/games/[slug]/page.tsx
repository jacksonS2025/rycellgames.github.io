
import fs from "fs";
import path from "path";
import GameFrame from "@/lib/games/frames/gameFrame";
import { GridCard } from "@/lib/games/cards/gridCard";

type PageProps = {
    params: Promise<any>;
};

type game = {
    name: string;
    categories: string[];
    description: string;
    exclusiveTags?: string[];
    id: string;
};

type params = {
    slug: string;
}

export async function generateStaticParams() {
    const gamesDir = path.join(process.cwd(), "public/raw/games");
    const folders = fs.readdirSync(gamesDir).filter((folder) => {
        const fullPath = path.join(gamesDir, folder);
        return fs.statSync(fullPath).isDirectory();
    }); // so we don't get files

    return folders.map((folder) => ({
        slug: folder,
    }));
}

async function getGameData(slug: string) {

    const gameDir = path.join(process.cwd(), "public/raw/games", slug);
    const filePath = path.join(gameDir, "game.json");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    return { id: slug, ...JSON.parse(fileContents) };
}

export default async function GamePage({ params }: PageProps) {
    const { slug } = await params as params;
    const game = await getGameData(slug);
    return (
        <div className="p-5 flex flex-col gap-5">
            <title>{`${game.name} | Rycell Games`}</title>
            <GameFrame game={game} />
            <div className="bg-main-800 rounded-4xl min-h-50 p-5 flex flex-row not-md:flex-col gap-5">
                <img src={`/static/images/games/${game.id}.webp`} alt={game.name} className="max-w-50 aspect-square object-cover rounded-4xl not-md:max-w-full not-md:w-full"></img>
                <div>
                    <p className="text-3xl">{game.name}</p>
                    <p>{game.description}</p>
                    <p>Tags: {game.categories.map((tag: string) => tag.trim().charAt(0).toUpperCase() + tag.trim().slice(1)).join(', ')}</p>
                    <div className="flex flex-row gap-5 mt-2">
                        {
                            (() => {
                                if (game.exclusiveTags?.includes('new')) {
                                    return <p className="bg-blue-600 px-1 rounded-sm">New</p>
                                }
                            })()
                        }
                    </div>
                </div>
            </div>
            <p className="text-5xl">More Like This:</p>
            <div className="grid grid-cols-6 gap-5 not-md:grid-cols-2">
                {
                    (() => {
                        const gamesDir = path.join(process.cwd(), "public/raw/games");
                        const folders = fs.readdirSync(gamesDir).filter((folder) => {
                            const fullPath = path.join(gamesDir, folder);
                            return fs.statSync(fullPath).isDirectory();
                        });

                        const otherGames = folders
                            .filter((folder) => folder !== game.id)
                            .map((folder) => {
                                const filePath = path.join(gamesDir, folder, "game.json");
                                const fileContents = fs.readFileSync(filePath, "utf-8");
                                return { id: folder, ...JSON.parse(fileContents) };
                            });

                        const currentTags = Array.isArray(game.categories)
                            ? game.categories.map((tag: string) => tag.trim().toLowerCase())
                            : game.categories.split(',').map((tag: string) => tag.trim().toLowerCase());

                        const similarGames = otherGames.filter((other) => {
                            const otherTags = Array.isArray(other.categories)
                                ? other.categories.map((tag: string) => tag.trim().toLowerCase())
                                : other.categories.split(',').map((tag: string) => tag.trim().toLowerCase());
                            return otherTags.some((tag: string) => currentTags.includes(tag));
                        });


                        return similarGames.map((similarGame) => (
                            <GridCard key={similarGame.id} name={similarGame.name} id={similarGame.id} />
                        ));
                    })()
                }
            </div>
        </div>
    );
}
