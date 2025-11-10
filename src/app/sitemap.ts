import { MetadataRoute } from 'next'
import path from 'path'
import fs from 'fs'

type Game = {
    name: string
    categories: string[]
    id: string
}

// Force this metadata route to be generated statically at build time.
export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://rycellgames.github.io'
    const sitemapEntries: MetadataRoute.Sitemap = []

    // Add static routes with a conservative lastModified value (build time)
    const buildTime = new Date()
    sitemapEntries.push(
        {
            url: baseUrl,
            lastModified: buildTime,
            changeFrequency: 'daily',
            priority: 1
        },
        {
            url: `${baseUrl}/games`,
            lastModified: buildTime,
            changeFrequency: 'daily',
            priority: 0.9
        },
        {
            url: `${baseUrl}/about`,
            lastModified: buildTime,
            changeFrequency: 'monthly',
            priority: 0.5
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: buildTime,
            changeFrequency: 'monthly',
            priority: 0.3
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: buildTime,
            changeFrequency: 'monthly',
            priority: 0.5
        }
    )

    // Get all games and categories
    const gamesDir = path.join(process.cwd(), 'public/raw/games')
    const categoriesMap: Map<string, Date> = new Map()

    // Read game directories (synchronous fs is fine at build time)
    if (!fs.existsSync(gamesDir)) return sitemapEntries

    const folders = fs.readdirSync(gamesDir).filter((folder) => {
        const fullPath = path.join(gamesDir, folder)
        return fs.statSync(fullPath).isDirectory()
    })

    // Process each game and collect mtimes for accurate lastModified
    folders.forEach((folder) => {
        const gamePath = path.join(gamesDir, folder, 'game.json')
        if (!fs.existsSync(gamePath)) return

        let mtime = buildTime
        try {
            mtime = fs.statSync(gamePath).mtime
        } catch (e) {
            // fallback to build time if stat fails
            mtime = buildTime
        }

        // Read game data
        try {
            const gameData = JSON.parse(fs.readFileSync(gamePath, 'utf-8')) as Game

            // Add game page with its file mtime
            sitemapEntries.push({
                url: `${baseUrl}/games/${folder}`,
                lastModified: mtime,
                changeFrequency: 'weekly',
                priority: 0.8
            })

            // Collect categories and track latest mtime per category
            if (Array.isArray(gameData.categories)) {
                gameData.categories.forEach(rawCat => {
                    const category = rawCat.trim().toLowerCase()
                    const existing = categoriesMap.get(category)
                    if (!existing || mtime > existing) categoriesMap.set(category, mtime)
                })
            }
        } catch (err) {
            // ignore invalid game.json files
        }
    })

    // Add category pages with the latest mtime among games in that category
    Array.from(categoriesMap.entries()).forEach(([category, lastModified]) => {
        sitemapEntries.push({
            url: `${baseUrl}/games/${category}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.7
        })
    })

    return sitemapEntries
}