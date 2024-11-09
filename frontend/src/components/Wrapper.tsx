import { cn } from "@/lib/utils"

const Wrapper = ({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) => {
    return (
        <main
            className={cn(
                "mx-auto w-full max-w-7xl px-4 sm:px-8 md:px-16 lg:px-20",
                className
            )}
        >
            {children}
        </main>
    )
}

export default Wrapper
