import { getPosts, getSinglePost } from "@/actions/postActions"
import PostCrad from "@/components/PostCrad"
import Wrapper from "@/components/Wrapper"
import Image from "next/image"

const PostDetailsPage = async ({
    params,
}: {
    params: Promise<{ postId: string }>
}) => {
    const { postId } = await params

    const response = await getSinglePost(postId)
    const relatedPostResponse = await getPosts()

    const relatedPosts = relatedPostResponse?.filter(
        (post) => post.id !== postId && post.status === "published"
    )

    if (!response.ok) {
        return (
            <Wrapper className="py-6 flex flex-col md:flex-row">
                <section className="w-full md:w-2/3 flex flex-col gap-4">
                    <h1>{response.error}</h1>
                </section>
            </Wrapper>
        )
    }

    const postData = response.post

    return (
        <Wrapper className="py-6 flex flex-col md:flex-row gap-10">
            <section className="w-full md:w-3/4 flex flex-col gap-4">
                <h1 className="text-3xl font-bold font-dmsans">
                    {postData.title}
                </h1>

                {postData.imageUrl ? (
                    <div className="relative w-full aspect-video rounded-md">
                        <Image
                            src={postData.imageUrl}
                            alt={postData.title}
                            fill
                            priority
                            quality={100}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover rounded-md"
                        />
                    </div>
                ) : (
                    <>
                        {postData.videoUrl && (
                            <video
                                src={postData.videoUrl}
                                loop
                                controls
                                className="w-full aspect-video rounded-lg border-none"
                            />
                        )}
                    </>
                )}

                <h4 className="text-sm font-poppins font-medium text-foreground/80">
                    Published on :{" "}
                    <span className="font-semibold">
                        {new Date(postData.createdAt).toDateString()}
                    </span>
                </h4>

                <ul className="flex gap-2">
                    {postData.tags.map((tag) => (
                        <li
                            key={tag}
                            className="text-sm capitalize font-dmsans font-medium border rounded-full px-2 py-1"
                        >
                            {tag}
                        </li>
                    ))}
                </ul>

                <p className="font-poppins text-pretty font-medium text-foreground/90">
                    {postData.content}
                </p>
            </section>

            <section className="w-full md:w-1/4 flex flex-col gap-4">
                <h1 className="text-xl font-bold font-dmsans">Related Posts</h1>

                <div className="flex flex-col gap-4">
                    {relatedPosts && relatedPosts.length !== 0 ? (
                        <>
                            {relatedPosts.map((post) => (
                                <PostCrad post={post} key={post.id} />
                            ))}
                        </>
                    ) : (
                        <h1 className="text-xl font-bold font-dmsans text-foreground/65 text-center py-10">
                            No Related Posts Found
                        </h1>
                    )}
                </div>
            </section>
        </Wrapper>
    )
}

export default PostDetailsPage
