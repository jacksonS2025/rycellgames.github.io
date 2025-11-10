import { MetadataRoute } from 'next'
import path from 'path'
import fs from 'fs'

type Game = {
    name: string
    categories: string[]
    id: string
}

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://rycellgames.com'
    const sitemapEntries: MetadataRoute.Sitemap = []

    // Add static routes
    sitemapEntries.push(
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1
        },
        {
            url: `${baseUrl}/games`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5
        }
    )

    // Get all games and categories
    const gamesDir = path.join(process.cwd(), "public/raw/games")
    const allCategories = new Set<string>()
    
    // Read game directories
    const folders = fs.readdirSync(gamesDir).filter((folder) => {
        const fullPath = path.join(gamesDir, folder)
        return fs.statSync(fullPath).isDirectory()
    })

    // Process each game
    folders.forEach((folder) => {
        const gamePath = path.join(gamesDir, folder, "game.json")
        if (!fs.existsSync(gamePath)) return

        const gameData = JSON.parse(fs.readFileSync(gamePath, "utf-8")) as Game
        
        // Add game page
        sitemapEntries.push({
            url: `${baseUrl}/games/${folder}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8
        })

        // Collect categories
        gameData.categories.forEach(category => {
            allCategories.add(category.trim().toLowerCase())
        })
    })

    // Add category pages
    Array.from(allCategories).forEach(category => {
        sitemapEntries.push({
            url: `${baseUrl}/games/${category}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7
        })
    })

    return sitemapEntries
}