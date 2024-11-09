"use client"

import { Button } from "@/components/ui/button"

const Error = ({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) => {
    return (
        <div className="w-full min-h-app flex flex-col gap-4 items-center justify-center">
            <h1 className="text-2xl font-bold font-dmsans capitalize">
                {error.message}
            </h1>
            <Button onClick={() => reset()}>Try Again</Button>
        </div>
    )
}

export default Error
