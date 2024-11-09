import { getPosts } from "@/actions/postActions"
import Wrapper from "@/components/Wrapper"
import { EmptyState } from "@/components/EmptyState"
import PostCrad from "@/components/PostCrad"

export default async function Home() {
    let posts = await getPosts()

    if (!posts || posts.length === 0) return <EmptyState />

    posts = posts.filter((post) => post.status === "published")

    if (posts.length === 0) return <EmptyState />

    return (
        <Wrapper>
            <h1 className="text-2xl font-bold font-dmsans py-8">
                Latest Posts
            </h1>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-4 w-full">
                {posts.map((post) => (
                    <PostCrad key={post.id} post={post} />
                ))}
            </section>
        </Wrapper>
    )
}
