import { getGamesList } from "@/lib/games/logic/list";
import { GridCard, LargeCard } from "@/lib/games/cards/gridCard";
import popular from "./popular";

const gamesList = getGamesList()


export default function Home() {

  let gamesDisplayed: string[] = []

  if (gamesList[0].name) gamesDisplayed.push(gamesList[0].name)

  const primaryCategories = [
    'puzzle',
    'endless',
    'sports',
    'vehicles',
    'arcade',
    'adventure',
    'action',
    'new'
  ]
  // these are categories that display on front page

  const categoryMap: Record<string, Array<any>> = {};
  const specialTagsMap: Record<string, Array<any>> = {};

  gamesList.forEach(game => {
    if (!game.folder) return;
    if (Array.isArray(game.exclusiveTags)) {
      game.exclusiveTags.forEach((tag: string) => {
        if (!specialTagsMap[tag]) specialTagsMap[tag] = []
        specialTagsMap[tag].push(game)
      })
    }
  }) // function to list all EXCLUSIVE tags (new, popular etc.)

  gamesList.forEach(game => {
    if (Array.isArray(game.categories)) {
      game.categories.forEach((cat: string) => {
        if (!categoryMap[cat]) categoryMap[cat] = [];
        categoryMap[cat].push(game);
      });
    }
  });

  return (
    <div className="w-full p-5">
      <div className="flex flex-col w-full gap-5">
        <div className="grid grid-cols-4 not-md:grid-cols-1 gap-5 overflow-hidden not-md:grid-rows-1">
          {
            popular.map((info, index) => {
              if (gamesDisplayed.indexOf(info.folder || '') > -1) return
              if (!info.folder) return
              if (index > 3) return
              gamesDisplayed.push(info.folder)
              return <LargeCard name={info.name} id={info.folder} key={info.folder} />
            })
          }
        </div>
        {
          Object.keys(specialTagsMap).sort().map(tag => {
            return <div key={'specialCards'}>
              <h1 className="text-5xl mb-3">{tag.charAt(0).toUpperCase() + tag.slice(1)}</h1>
              <div className="grid grid-cols-6 not-md:grid-cols-2 gap-5 grow max-h-full">
                {specialTagsMap[tag].map((info: any) => {
                  if (!info.folder) return null;
                  if (!primaryCategories.includes(tag)) return null;
                  gamesDisplayed.push(info.folder);
                  return <GridCard name={info.name} id={info.folder} key={info.folder} />;
                })}
              </div>
            </div>
          })
        }
        <div>

        </div>
        <h1 className="text-5xl">Popular</h1>
        <div className="grid grid-cols-6 not-md:grid-cols-2 gap-5 grow max-h-full">
          {
            (() => {
              let displayedGames = 0
              return popular.map((info, index) => {
                if (gamesDisplayed.indexOf(info.folder || '') > -1) return null
                if (!info.folder) return
                if (displayedGames > 11) return
                displayedGames++
                gamesDisplayed.push(info.folder)
                return <GridCard name={info.name} id={info.folder} key={info.folder} />
              })
            })()
          }
        </div>

        {/* seperate category sections */}
        <div className="flex flex-col gap-8">
          {Object.keys(categoryMap).sort().map(category => (
            primaryCategories.includes(category) ? <div key={category}>
              <h2 className="text-4xl mb-3">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>

              <div className="grid grid-cols-6 not-md:grid-cols-2 gap-5 grow max-h-full">
                {categoryMap[category].map((info: any) => {
                  if (!info.folder) return null;
                  if (!primaryCategories.includes(category)) return null;
                  gamesDisplayed.push(info.folder);
                  return <GridCard name={info.name} id={info.folder} key={info.folder} />;
                })}
              </div>

            </div> : null
          ))}
        </div>

        <h1 className="text-5xl">All Games</h1>
        <div className="grid grid-cols-6 not-md:grid-cols-2 gap-5 grow max-h-full">
          {
            (() => {
              let displayedGames = 0
              return gamesList.map((info, index) => {

                if (!info.folder) return
                displayedGames++
                gamesDisplayed.push(info.folder)
                return <GridCard name={info.name} id={info.folder} key={info.folder} />
              })
            })()
          }
        </div>
      </div>
      <div className="flex flex-col gap-5 mt-5 bg-main-700 p-5 rounded-2xl">
        <h1 className="text-5xl">Rycell Games - Unblocked Games at School</h1>
        <p>Rycell Games has games that can be played and accessed anywhere - from school, home, or even the office if you’re feeling it. Rycell Games is your free gateway to a place where there is no limit to the fun that you can have!</p>
        <h2 className="text-4xl">No Download? No Problem!</h2>
        <p>Our site has Unblocked Games that don’t need any downloading whatsoever to run. Whether you’re on a Chromebook, don’t have any administrator perms to install anything, we’ve got your back on that one. Check out the variety of games to play on any OS.</p>
        <p>Enjoy trending titles and popular unblocked games to play at school like:</p>
        <a href="https://rycellgames.github.io/games/driftboss/">Drift Boss</a>
        <a href="https://rycellgames.github.io/games/snowrider3d/">Snow Rider 3D</a>
        <a href="https://rycellgames.github.io/games/motox3m2/">Moto X3M 2</a>
        <a href="https://rycellgames.github.io/games/boxingrandom/">Boxing Random</a>
        <a href="https://rycellgames.github.io/games/worldshardestgame/">The Worlds Hardest Game</a>
        <p>And that’s a small part of our collection of games!</p>

      </div>
    </div>
  );
}
