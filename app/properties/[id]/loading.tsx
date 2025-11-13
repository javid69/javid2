export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-4 h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="h-8 w-72 animate-pulse rounded bg-muted" />
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-8 w-52 animate-pulse rounded bg-muted" />
        </div>

        <div className="mb-6 h-10 w-full max-w-md animate-pulse rounded-full bg-muted" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="aspect-[16/10] w-full animate-pulse rounded-3xl bg-muted" />
            <div className="h-64 animate-pulse rounded-3xl bg-muted" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
            <div className="h-96 animate-pulse rounded-3xl bg-muted" />
          </div>
          <div className="lg:col-span-1">
            <div className="h-[520px] animate-pulse rounded-3xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
