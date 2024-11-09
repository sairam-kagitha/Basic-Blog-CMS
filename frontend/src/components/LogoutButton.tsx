"use client"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { logoutUser } from "@/actions/authActions"
import { toast } from "sonner"

const LogoutButton = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        setIsLoading(true)
        const result = await logoutUser()

        if (result.ok) {
            toast.success("Logout successful")
            router.refresh()
        } else {
            toast.error("Something went wrong")
        }
    }

    return (
        <Button
            variant="destructive"
            onClick={handleClick}
            disabled={isLoading}
        >
            {isLoading && (
                <Loader2 className="animate-spin" size={16} strokeWidth={3} />
            )}
            Logout
        </Button>
    )
}

export default LogoutButton
