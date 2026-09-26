import Link from "next/link"
import { Button } from "../ui/button"
import { ThemeToggle } from "./theme-toggle"

const navbarList = [
    {
        id: 1,
        title: "Home",
        link: "/",
    },
    {
        id: 2,
        title: "About",
        link: "/about",
    }
]

const buttons = [
    {
        id: 1,
        title: "Sign in",
        link: "/auth/sign-in",
        buttonVariant: "default" as const
    },
    {
        id: 2,
        title: "Sign up",
        link: "/auth/sign-up",
        buttonVariant: "ghost" as const
    }
]

export function Navbar() {
    return (
        <nav className="width-full flex justify-between mx-2 my-4">
            <div>Logo</div>
            <div>
                {navbarList.map(el => (
                    <Link key={el.id} href={el.link} className="mx-1.5">{el.title}</Link>
                ))}
            </div>
            <div>
                {buttons.map(el => (
                    <Link key={el.id} href={el.link} className="mx-1.5"><Button variant={el.buttonVariant}>{el.title}</Button></Link>
                ))}
                <ThemeToggle />
            </div>
        </nav>
    )
}

