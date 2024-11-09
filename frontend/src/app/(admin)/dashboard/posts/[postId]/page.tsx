import { getSinglePost } from "@/actions/postActions"
import PostDetailsForm from "@/app/(admin)/_components/PostDetailsForm"
import Wrapper from "@/components/Wrapper"

const PostEditPage = async ({
    params,
}: {
    params: Promise<{ postId: string }>
}) => {
    const { postId } = await params

    const response = await getSinglePost(postId)

    if (!response.ok || !response.post) {
        return <h1>Oops!</h1>
    }

    return (
        <Wrapper className="min-h-app py-6 md:py-10">
            <h1 className="text-2xl font-bold font-dmsans">Edit Post</h1>

            <PostDetailsForm data={response.post} />
        </Wrapper>
    )
}

export default PostEditPage
