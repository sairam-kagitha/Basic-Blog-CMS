import { Post } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

const PostCrad = ({ post }: { post: Post }) => {
    return (
        <Link
            href={`/posts/${post.id}`}
            className="w-full flex flex-col gap-2 border rounded-lg p-2"
        >
            {post.imageUrl ? (
                <div className="relative w-full aspect-video rounded-md">
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover rounded-md"
                    />
                </div>
            ) : (
                <>
                    {post.videoUrl && (
                        <video
                            src={post.videoUrl}
                            loop
                            muted
                            autoPlay
                            className="w-full aspect-video rounded-lg border-none"
                        />
                    )}
                </>
            )}
            <ul className="flex gap-2">
                {post.tags.map((tag) => (
                    <li
                        key={tag}
                        className="text-xs capitalize font-dmsans font-medium border rounded-full px-2 py-1"
                    >
                        {tag}
                    </li>
                ))}
            </ul>

            <h1 className="font-bold font-dmsans leading-5">{post.title}</h1>

            <p className="text-xs font-medium line-clamp-3 font-poppins">
                {post.content}
            </p>

            <span className="text-sm font-poppins text-foreground/70">
                {new Date(post.createdAt)
                    .toDateString()
                    .split(" ")
                    .slice(1)
                    .join(" ")}
            </span>
        </Link>
    )
}

export default PostCrad
