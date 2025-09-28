import fs from 'fs';
import path from 'path';

const gamesDir = path.join(process.cwd(), 'public/raw/games');

type gameData = {
    name: string;
    description: string;
    categories: string;
    exclusiveTags: string[]
}

export function getGamesList() {
    const folders = fs.readdirSync(gamesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const games = folders.map(folder => {
        const jsonPath = path.join(gamesDir, folder, 'game.json');
        if (fs.existsSync(jsonPath)) {
            const data : gameData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

            return { folder, ...data };
        }
        return {
            name: undefined,
            description: undefined,
            categories: undefined,
            exclusiveTags: undefined,
            folder: undefined
        };
    }).filter(Boolean);

    return games;
}
