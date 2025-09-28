import '@/app/globals.css'
import Image from 'next/image'
import Link from 'next/link'
import { Gamepad, InfoIcon, Mail, Search } from 'lucide-react'

export default function Header() { // really just a sidebar
    return (
        <nav className='bg-main-700 h-[100vh] w-16 flex flex-col fixed px-2 mb-5 box-border'>
            <div className="group flex flex-col items-center h-full transition-all duration-300 w-16 hover:w-56 bg-main-700 overflow-hidden">
                <Link href={"/"} className="mt-2 flex flex-col items-left w-full gap-3 px-2">
                    <Image
                        alt="Rycell Games"
                        src="/static/images/brand/logotransparent.png"
                        className="aspect-square w-10"
                        width={256}
                        height={256}
                    />
                </Link>
                <ul className="flex flex-col gap-4 w-full px-2">
                    <li>
                        <Link href="/games" className="flex items-center gap-3 py-2 px-2 rounded hover:bg-main-600 transition-colors">
                            <span>
                                <Gamepad />
                            </span>
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">Games</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/search" className="flex items-center gap-3 py-2 px-2 rounded hover:bg-main-600 transition-colors">
                            <span>
                                <Search />
                            </span>
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">Search</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" className="flex items-center gap-3 py-2 px-2 rounded hover:bg-main-600 transition-colors">
                            <span className="material-icons text-white">
                                <InfoIcon />
                            </span>
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">About</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" className="flex items-center gap-3 py-2 px-2 rounded hover:bg-main-600 transition-colors">
                            <span className="material-icons text-white">
                                <Mail />
                            </span>
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">Contact</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}