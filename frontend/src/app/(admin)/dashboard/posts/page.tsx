import { getPosts } from "@/actions/postActions"
import { buttonVariants } from "@/components/ui/button"
import Wrapper from "@/components/Wrapper"
import { Plus } from "lucide-react"
import Link from "next/link"
import PostEditCard from "../../_components/PostCard"

const BlogPosts = async () => {
    const posts = await getPosts()

    if (!posts || posts.length === 0) {
        return (
            <Wrapper className="min-h-app w-full flex flex-col items-center justify-center gap-4">
                <h1 className="text-3xl font-bold font-dmsans">
                    No Posts Found
                </h1>
                <Link
                    href="/dashboard/posts/create"
                    className={buttonVariants({ size: "sm" })}
                >
                    <Plus />
                    Add Post
                </Link>
            </Wrapper>
        )
    }

    return (
        <Wrapper className="min-h-app py-6 md:py-10 space-y-6 md:space-y-10">
            <section className="flex items-center justify-between h-fit px-4">
                <h1 className="text-2xl font-bold font-dmsans">BlogPosts</h1>
                <Link
                    href="/dashboard/posts/create"
                    className={buttonVariants({ size: "sm" })}
                >
                    <Plus />
                    Add Post
                </Link>
            </section>

            <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostEditCard key={post.id} post={post} />
                ))}
            </section>
        </Wrapper>
    )
}

export default BlogPosts
