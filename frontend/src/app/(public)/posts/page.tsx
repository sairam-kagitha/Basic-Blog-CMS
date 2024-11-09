import { getPosts } from "@/actions/postActions"
import { EmptyState } from "@/components/EmptyState"
import PostCrad from "@/components/PostCrad"
import Wrapper from "@/components/Wrapper"

const PostsPage = async () => {
    let posts = await getPosts()

    if (!posts || posts.length === 0) return <EmptyState />

    posts = posts.filter((post) => post.status === "published")

    if (posts.length === 0) return <EmptyState />

    return (
        <Wrapper className="min-h-app w-full py-6 md:py-10 space-y-6">
            <h1 className="text-2xl font-bold font-dmsans md:ml-4">Posts</h1>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-4 w-full">
                {posts.map((post) => (
                    <PostCrad key={post.id} post={post} />
                ))}
            </section>
        </Wrapper>
    )
}

export default PostsPage
