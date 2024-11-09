"use client"
import { deletePost } from "@/actions/postActions"
import { Button } from "@/components/ui/button"
import { Loader2, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

const DeletePost = ({ postId }: { postId: string }) => {
    const router = useRouter()
    const [deleting, setDeleting] = useState(false)

    const onDelete = async () => {
        setDeleting(true)
        const result = await deletePost(postId)

        if (result.ok) {
            toast.success("Post deleted")
            router.refresh()
        } else {
            toast.error(result.error)
        }

        setDeleting(false)
    }
    return (
        <Button
            variant="destructive"
            size="sm"
            className="w-1/2"
            onClick={onDelete}
            disabled={deleting}
        >
            {deleting ? <Loader2 className="animate-spin" /> : <Trash />}
            Delete
        </Button>
    )
}

export default DeletePost
