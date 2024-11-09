import { buttonVariants } from "@/components/ui/button"
import { Post } from "@/lib/types"
import { FilePenLine } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import DeletePost from "./DeletePost"

const PostEditCard = ({ post }: { post: Post }) => {
    return (
        <div
            key={post.id}
            className="w-full h-fit border bg-background rounded-md p-4 flex flex-col gap-4 justify-evenly"
        >
            {post.imageUrl && (
                <div className="relative w-full aspect-video">
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            )}

            {post.videoUrl && (
                <video
                    src={post.videoUrl}
                    loop
                    muted
                    autoPlay
                    className="w-full aspect-video rounded-md"
                />
            )}

            <h1 className="text-lg font-bold font-dmsans line-clamp-2">
                {post.title}
            </h1>

            <div className="flex items-center gap-4 h-fit">
                <Link
                    href={`/dashboard/posts/${post.id}`}
                    className={buttonVariants({
                        size: "sm",
                        className: "w-1/2",
                    })}
                >
                    <FilePenLine />
                    Edit
                </Link>
                <DeletePost postId={post.id} />
            </div>
        </div>
    )
}

export default PostEditCard
