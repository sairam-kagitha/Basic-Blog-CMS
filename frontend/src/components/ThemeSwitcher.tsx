"use client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Loader2, Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const { setTheme, resolvedTheme } = useTheme()

    useEffect(() => setMounted(true), [])

    if (!mounted) {
        return (
            <Button variant="outline" size="icon" disabled>
                <Loader2 className="animate-spin" />
            </Button>
        )
    }

    return (
        <Button
            onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            variant="secondary"
            size="icon"
            className="border"
        >
            {resolvedTheme === "dark" ? <Sun /> : <Moon />}
        </Button>
    )
}
