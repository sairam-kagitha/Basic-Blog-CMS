import Link from "next/link"
import Wrapper from "@/components/Wrapper"
import ThemeSwitcher from "@/components/ThemeSwitcher"
import { getUser } from "@/actions/authActions"
import { Button, buttonVariants } from "@/components/ui/button"
import NavLinks from "./NavLinks"
import LogoutButton from "@/components/LogoutButton"

const Navbar = async () => {
    const user = await getUser()

    return (
        <header className="h-16 w-full sticky top-0 inset-x-0 bg-background">
            <Wrapper className="flex items-center justify-between h-full border-b">
                <Link
                    href="/dashboard"
                    className="text-xl font-bold font-dmsans"
                >
                    Dashboard
                </Link>

                <NavLinks />

                <div className="h-full flex items-center gap-4">
                    {user ? (
                        <>
                            {user.role === "admin" && (
                                <Link
                                    href="/"
                                    className={buttonVariants({
                                        variant: "ghost",
                                        className: "hidden md:inline-flex",
                                    })}
                                >
                                    Home
                                </Link>
                            )}
                            <LogoutButton />
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className={buttonVariants({
                                className: "hidden md:inline-flex",
                            })}
                        >
                            Login
                        </Link>
                    )}
                    <ThemeSwitcher />
                </div>
            </Wrapper>
        </header>
    )
}

export default Navbar
