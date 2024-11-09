import { Loader2 } from "lucide-react"

const Loading = () => {
    return (
        <main className="min-h-app w-full flex items-center justify-center">
            <Loader2 className="animate-spin" size={48} strokeWidth={2.6} />
        </main>
    )
}

export default Loading
