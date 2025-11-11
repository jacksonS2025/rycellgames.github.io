export default function articlesPage() {
    return (
        <div className="grow w-full h-full flex flex-col items-center justify-center">
            <div className="w-full max-w-100 p-5 rounded-2xl bg-main-800 flex flex-col gap-5">
                <img src="/static/images/memes/bird.jpg" className="w-full rounded-2xl aspect-square" alt="Work In Progress Bird"></img>
                <div>
                    <p className="text-2xl w-full">Page is a work in progress</p>
                    <p className="">Come back later to see if it's recieved an update!</p>
                </div>
            </div>
        </div>
    )
}