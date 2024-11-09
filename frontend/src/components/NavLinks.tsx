"use client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const LINKS = [
    { title: "Home", href: "/" },
    { title: "Posts", href: "/posts" },
] as const

const NavLinks = () => {
    const pathName = usePathname()

    return (
        <nav className="hidden md:flex h-full items-center gap-4">
            {LINKS.map(({ title, href }) => (
                <Link
                    key={title}
                    href={href}
                    className={cn(
                        "px-4 py-2 text-sm font-semibold font-dmsans rounded-md hover:bg-accent hover:text-accent-foreground",
                        {
                            "bg-accent text-accent-foreground":
                                pathName === href,
                        }
                    )}
                >
                    {title}
                </Link>
            ))}
        </nav>
    )
}

export default NavLinks
