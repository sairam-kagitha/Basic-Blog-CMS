"use client"
import {
    createPost,
    deleteImage,
    updatePost,
    uploadImage,
} from "@/actions/postActions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Post } from "@/lib/types"
import { PostSchema, PostSchemaType } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Trash, Upload } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const PostDetailsForm = ({ data }: { data?: Post }) => {
    const router = useRouter()

    const dataUrl = data
        ? data.imageUrl
            ? data.imageUrl
            : data.videoUrl
            ? data.videoUrl
            : null
        : null
    const dataType = data
        ? data.imageUrl
            ? "image"
            : data.videoUrl
            ? "video"
            : null
        : null

    const [imageDetails, setImageDetails] = useState<{
        url: string | null
        type: "video" | "image" | null
        loading: boolean
    }>({ url: dataUrl, type: dataType, loading: false })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PostSchemaType>({
        resolver: zodResolver(PostSchema),
    })

    const onSubmit = async (postData: PostSchemaType) => {
        const imageUrl = imageDetails.type === "image" ? imageDetails.url : null
        const videoUrl = imageDetails.type === "video" ? imageDetails.url : null

        if (data) {
            const response = await updatePost(
                data.id,
                postData,
                imageUrl,
                videoUrl
            )

            if (response.ok) {
                toast.success("Post updated")
                router.push("/dashboard/posts")
                router.refresh()
            } else {
                toast.error(response.error)
            }
        } else {
            const response = await createPost(postData, imageUrl, videoUrl)

            if (response.ok) {
                toast.success("Post created")
                router.push("/dashboard/posts")
                router.refresh()
            } else {
                toast.error(response.error)
            }
        }
    }

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageDetails((prev) => ({ ...prev, loading: true }))

        const file = event.target.files?.[0]
        if (!file) {
            setImageDetails((prev) => ({ ...prev, loading: false }))
            return
        }

        const formData = new FormData()
        formData.append("postImage", file)

        try {
            const response = await uploadImage(formData)

            if (response.ok) {
                toast.success("File uploaded")
                setImageDetails({
                    type: response.type,
                    url: response.url,
                    loading: false,
                })
            } else {
                toast.error(response.error)
                setImageDetails((prev) => ({ ...prev, loading: false }))
            }
        } catch (error) {
            toast.error("Something went wrong")
            setImageDetails((prev) => ({ ...prev, loading: false }))
        }
    }

    const handleDelete = async () => {
        setImageDetails((prev) => ({ ...prev, loading: true }))

        try {
            const fileName = imageDetails.url?.split("/").pop()
            const response = await deleteImage(fileName as string)

            if (response.ok) {
                toast.success("File deleted")
                setImageDetails({
                    type: null,
                    url: null,
                    loading: false,
                })
            } else {
                toast.error(response.error)
                setImageDetails((prev) => ({ ...prev, loading: false }))
            }
        } catch (error) {
            toast.error("Something went wrong")
            setImageDetails((prev) => ({ ...prev, loading: false }))
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            <section className="w-full md:px-8 space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="title" className="pl-1">
                        Title
                    </Label>
                    <Input
                        id="title"
                        {...register("title", { value: data?.title })}
                    />
                    {errors.title && (
                        <p className="text-xs text-red-600">
                            {errors.title.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="content" className="pl-1">
                        Content
                    </Label>
                    <Textarea
                        id="content"
                        {...register("content", { value: data?.content })}
                    />
                    {errors.content && (
                        <p className="text-xs text-red-600">
                            {errors.content.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="metaTitle" className="pl-1">
                        Meta Title
                    </Label>
                    <Input
                        id="metaTitle"
                        {...register("metaTitle", { value: data?.metaTitle })}
                    />
                    {errors.metaTitle && (
                        <p className="text-xs text-red-600">
                            {errors.metaTitle.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="metaDescription" className="pl-1">
                        Meta Description
                    </Label>
                    <Textarea
                        id="metaDescription"
                        {...register("metaDescription", {
                            value: data?.metaDescription,
                        })}
                    />
                    {errors.metaDescription && (
                        <p className="text-xs text-red-600">
                            {errors.metaDescription.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="tags" className="pl-1">
                        Tags
                    </Label>
                    <Input
                        id="tags"
                        placeholder="tag1, tag2, tag3"
                        {...register("tags", { value: data?.tags.join(",") })}
                    />
                    {errors.tags && (
                        <p className="text-xs text-red-600">
                            {errors.tags.message}
                        </p>
                    )}
                </div>
            </section>

            <section className="md:px-8 w-full flex flex-col">
                <input
                    id="image"
                    onChange={handleUpload}
                    type="file"
                    accept="image/*, video/*"
                    className="hidden"
                    disabled={imageDetails.loading}
                />

                {imageDetails.url ? (
                    <>
                        {imageDetails.type === "image" && (
                            <div className="relative w-full aspect-video rounded-md">
                                <Image
                                    src={imageDetails.url}
                                    alt="Post image"
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-contain rounded-md"
                                />

                                <Button
                                    onClick={handleDelete}
                                    variant="destructive"
                                    size="icon"
                                    disabled={imageDetails.loading}
                                    className="absolute top-0 right-0 z-[10000]"
                                >
                                    {imageDetails.loading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <Trash />
                                    )}
                                </Button>
                            </div>
                        )}

                        {imageDetails.type === "video" && (
                            <div className="relative w-full aspect-video rounded-md">
                                <video
                                    src={imageDetails.url}
                                    controls
                                    loop
                                    autoPlay
                                    muted
                                    className="w-full h-full object-contain rounded-md"
                                />

                                <Button
                                    onClick={handleDelete}
                                    variant="destructive"
                                    size="icon"
                                    disabled={imageDetails.loading}
                                    className="absolute top-2 right-2 z-[10000]"
                                >
                                    {imageDetails.loading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <Trash />
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <label
                        htmlFor="image"
                        className="cursor-pointer aspect-video border rounded-md w-full flex flex-col items-center justify-center gap-1 p-4 text-center text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                    >
                        {imageDetails.loading ? (
                            <Loader2
                                className="animate-spin"
                                size={40}
                                strokeWidth={2.6}
                            />
                        ) : (
                            <>
                                <Upload />
                                <h1>Upload Image or Video</h1>
                            </>
                        )}
                    </label>
                )}

                <section className="w-full pt-6 flex items-center h-full justify-evenly">
                    <select
                        id="status"
                        {...register("status", {
                            value: data?.status || "draft",
                        })}
                        className="w-1/3 border rounded-md px-2 py-2 text-sm font-medium font-dmsans"
                    >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                    <Button
                        type="submit"
                        className="w-1/3"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <Loader2 className="animate-spin" strokeWidth={3} />
                        )}
                        {data ? "Update" : "Create"}
                    </Button>
                </section>
            </section>
        </form>
    )
}

export default PostDetailsForm
