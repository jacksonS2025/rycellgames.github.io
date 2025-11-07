
import fs from "fs";
import path from "path";
import GameFrame from "@/lib/games/frames/gameFrame";
import { notFound } from "next/navigation";
import { GridCard } from "@/lib/games/cards/gridCard";
import { marked } from "marked";

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

type Category = {
    title: string
}


export async function generateStaticParams() {

    const allCategories: Category[] = []
    const gamesDir = path.join(process.cwd(), "public/raw/games");
    const folders = fs.readdirSync(gamesDir).filter((folder) => {
        const fullPath = path.join(gamesDir, folder);
        return fs.statSync(fullPath).isDirectory();
    }); // so we don't get files

    folders.map((val, index) => {
        if (!fs.existsSync(path.join(gamesDir, folders[index], "game.json"))) return

        const gameInfoFile = fs.readFileSync(path.join(gamesDir, folders[index], "game.json"), "utf-8")
        const gameInfo = JSON.parse(gameInfoFile) as game

        gameInfo.categories.forEach((category, index) => {
            const normalized = category.trim();
            const exists = allCategories.some(c => c.title.toLowerCase() === normalized.toLowerCase());
            if (!exists) {
                allCategories.push({ title: normalized });
            }
        })

    })

    const games = folders.map((folder) => {
        return { slug: folder }
    })

    const categories = allCategories.map((category) => {
        return { slug: category.title.toLowerCase() }
    })

    // Only generate static params for actual game slugs on this route.
    return [...categories, ...games];
}

async function findCategory(category: string) {
    const gamesDir = path.join(process.cwd(), "public/raw/games");
    const folders = fs.readdirSync(gamesDir).filter((folder) => {
        const fullPath = path.join(gamesDir, folder);
        return fs.statSync(fullPath).isDirectory();
    });

    const games = folders
        .filter(folder => fs.existsSync(path.join(gamesDir, folder, "game.json")))
        .map(folder => {
            const filePath = path.join(gamesDir, folder, "game.json");
            const fileContents = fs.readFileSync(filePath, "utf-8");
            return { id: folder, ...JSON.parse(fileContents) };
        })
        .filter(game =>
            game.categories.some((cat: string) => cat.trim().toLowerCase() === category.toLowerCase())
        );

    return games;
}

async function getGameData(slug: string) {

    const gameDir = path.join(process.cwd(), "public/raw/games", slug);
    const filePath = path.join(gameDir, "game.json");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    return { id: slug, ...JSON.parse(fileContents) };
}
export async function generateMetadata({ params }: { params: any }) {
    // Determine whether this slug corresponds to a real game by checking for the
    // presence of game.json. Don't rely on a custom `isGame` flag in params.
    const gameJsonPath = path.join(process.cwd(), "public/raw/games", params.slug, "game.json");
    const isGame = fs.existsSync(gameJsonPath);

    if (!isGame) {
        return {
            title: `${params.slug.charAt(0).toUpperCase() + params.slug.slice(1)}`
        };
    }

    const game = await getGameData(params.slug);

    return {
        title: `${game.name} | Rycell Games`,
        description: game.description,
        openGraph: {
            title: game.name,
            description: `${game.description}, play ${game.name} today!`,
            images: [
            {
                url: `https://rycellgames.github.io/static/images/games/${game.id}.webp`,
                alt: game.name,
            },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: game.name,
            description: game.description,
            images: [`https://rycellgames.github.io/static/images/games/${game.id}.webp`],
        },
        };
}

async function findCategoryDescription(category: string) {

    const mdPath = path.join(process.cwd(), 'src/app/games/md/categories')
    const mdExists = fs.existsSync(path.join(mdPath, `${category}.md`))

    if (!mdExists) return undefined
    const fileContents = fs.readFileSync(path.join(mdPath, `${category}.md`), 'utf-8')
    const html = marked.parse(fileContents);
    return html;

}

export default async function GamePage({ params }: { params: any }) {
    // params is a plain object supplied by Next.js — don't await it.
    const { slug } = params;

    // Detect whether this slug corresponds to a real game by checking disk.
    const gameJsonPath = path.join(process.cwd(), "public/raw/games", slug, "game.json");
    const isGame = fs.existsSync(gameJsonPath);

    if (!isGame) {
        // Treat as a category: find games in this category and render them.

        const games = await findCategory(slug);
        const categoryDescription = await findCategoryDescription(slug)

        if (!games[0]) {
            notFound();
        }

        const displayedGames = []

        return (
            <div className="p-5 flex flex-col gap-5">
                <h1 className="text-4xl mb-5 capitalize">{slug} Games</h1>
                {(() => {
                    const featured = games.slice(0, 4);
                    const featuredIds = new Set(featured.map(g => g.id));
                    const others = games.filter((g) => !featuredIds.has(g.id));

                    return (
                        <>
                            <div className="grid grid-cols-4 gap-5 not-md:grid-cols-1">
                                {featured.map((game) => (
                                    <GridCard key={`${game.id}Popular`} name={game.name} id={game.id} />
                                ))}
                            </div>

                            <div className="grid grid-cols-6 gap-5 not-md:grid-cols-2">
                                {others.map((game) => (
                                    <GridCard key={game.id} name={game.name} id={game.id} />
                                ))}
                            </div>
                        </>
                    );
                })()}

                {categoryDescription ? (
                    <div
                        className="flex flex-col gap-5 mt-5 bg-main-700 p-5 rounded-2xl"
                        dangerouslySetInnerHTML={{ __html: categoryDescription as string }}
                    />
                ) : undefined}
            </div>
        );
    }

    const game = await getGameData(slug);
    return (
        <div className="p-5 flex flex-col gap-5">
            <title>{`${game.name} | Rycell Games`}</title>
            <GameFrame game={game} />
            <div className="bg-main-800 min-h-50 rounded-2xl p-5 flex flex-row not-md:flex-col gap-5">
                <img src={`/static/images/games/${game.id}.webp`} alt={game.name} className="max-w-50 rounded-2xl aspect-square object-cover not-md:max-w-full not-md:w-full"></img>
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
                        {
                            (() => {
                                if (game.exclusiveTags?.includes('popular')) {
                                    return <p className="bg-amber-600 px-1 rounded-sm">Popular</p>
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
