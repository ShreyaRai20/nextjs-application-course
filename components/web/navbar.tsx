'use client'
import Link from "next/link"
import { Button } from "../ui/button"
import { ThemeToggle } from "./theme-toggle"
import { useConvexAuth } from "convex/react"
import { authClient } from "@/lib/auth-client"
import { toast } from "../ui/toast"
import { success } from "zod"
import { error } from "console"
import { useRouter } from "next/navigation"

const navbarList = [
    {
        id: 1,
        title: "Home",
        link: "/",
    },
    {
        id: 2,
        title: "Create",
        link: "/create",
    },
    {
        id: 3,
        title: "Blog",
        link: "/blog",
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
    const { isAuthenticated, isLoading } = useConvexAuth()
    const router = useRouter()
    return (
        <nav className="width-full flex justify-between mx-2 my-4">
            <div>Logo</div>
            <div>
                {isAuthenticated ? (
                    navbarList.map(el => (
                        <Link key={el.id} href={el.link} className="mx-1.5">{el.title}</Link>
                    ))) : null
                }
            </div>
            <div className="flex justify-center items-center gap-1">
                {isLoading ? null : isAuthenticated ? (<Button variant="secondary" onClick={async () => {
                    const res = await authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                toast.add({
                                    type: 'success',
                                    description: 'Logged out successfully',
                                    timeout: 2000,
                                })
                            },
                            onError: (error) => {
                                toast.add({
                                    type: 'error',
                                    description: `error occured while logging out ${error.error.message}`,
                                    timeout: 2000,
                                })
                            }
                        }
                    })
                    if (res) router.push('/auth/sign-in')
                }}>Logout</Button>) : (buttons.map(el => (
                    <Link key={el.id} href={el.link} className="mx-1.5"><Button variant={el.buttonVariant}>{el.title}</Button></Link>
                )))}
                <ThemeToggle />
            </div>
        </nav>
    )
}
