import PostDetailsForm from "@/app/(admin)/_components/PostDetailsForm"
import Wrapper from "@/components/Wrapper"

const PostCreate = () => {
    return (
        <Wrapper className="min-h-app py-6 md:py-10">
            <h1 className="text-2xl font-bold font-dmsans">Create New Post</h1>

            <PostDetailsForm />
        </Wrapper>
    )
}

export default PostCreate
