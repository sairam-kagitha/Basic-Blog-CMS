import Link from "next/link"
import Wrapper from "./Wrapper"
import ThemeSwitcher from "./ThemeSwitcher"
import NavLinks from "./NavLinks"
import { getUser } from "@/actions/authActions"
import { Button, buttonVariants } from "./ui/button"
import LogoutButton from "./LogoutButton"

const Navbar = async () => {
    const user = await getUser()

    return (
        <header className="h-16 w-full sticky top-0 inset-x-0 bg-background">
            <Wrapper className="flex items-center justify-between h-full border-b">
                <Link href="/" className="text-2xl font-bold font-dmsans">
                    Blog
                </Link>

                <NavLinks />

                <div className="h-full flex items-center gap-4">
                    {user ? (
                        <>
                            {user.role === "admin" && (
                                <Link
                                    href="/dashboard"
                                    className={buttonVariants({
                                        variant: "ghost",
                                        className: "hidden md:inline-flex",
                                    })}
                                >
                                    Dashboard
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
