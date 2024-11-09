"use client"
import { loginUser } from "@/actions/authActions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "@/lib/types"
import { LoginSchema, LoginSchemaType } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const LoginPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
    })

    const redirectTo = searchParams.get("redirect") || "/"

    const onSubmit = async (data: LoginSchemaType) => {
        try {
            const user: User = await loginUser(data)

            toast.success("Login successful")

            if (user.role === "admin") {
                router.push("/dashboard")
            } else {
                router.push(redirectTo)
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Something went wrong")
            }
        }
    }

    return (
        <main className="h-full w-full flex flex-col items-center justify-center gap-8">
            <h1 className="text-2xl font-bold font-dmSans">Login</h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-80 flex flex-col gap-4"
            >
                <div className="space-y-px">
                    <Label htmlFor="email" className="font-medium ml-1">
                        Email
                    </Label>
                    <Input
                        type="email"
                        placeholder="you@example.com"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-xs ml-1 pt-1 font-poppins text-red-600">
                            {errors.email.message}
                        </p>
                    )}
                </div>
                <div className="space-y-px">
                    <Label htmlFor="password" className="font-medium ml-1">
                        Password
                    </Label>
                    <Input
                        type="password"
                        placeholder="must be 8 characters long"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="text-xs ml-1 pt-1 font-poppins text-red-600">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div className="w-full mt-4">
                    <Button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full font-poppins"
                    >
                        {isSubmitting && (
                            <Loader2
                                className="animate-spin"
                                size={16}
                                strokeWidth={3}
                            />
                        )}
                        Login
                    </Button>
                    {errors.root && (
                        <p className="text-xs ml-1 pt-1 font-poppins text-red-600">
                            {errors.root.message}
                        </p>
                    )}
                </div>
            </form>
        </main>
    )
}

export default LoginPage
