export const EmptyState = () => {
    return (
        <main className="min-h-app w-full flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold font-dmsans">Oops!</h1>
            <p className="text-xl font-medium font-dmsans text-foreground/60">
                No posts found
            </p>
        </main>
    )
}
