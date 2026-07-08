export default function EventDetailLoading() {
  return (
    <div className="bg-nx-bg min-h-screen text-nx-text animate-pulse">
      {/* Aurora Banner Header Skeleton */}
      <div className="pt-28 pb-16 px-4 bg-nx-surface/30 border-b border-nx-purple/10">
        <div className="max-w-6xl mx-auto">
          <div className="h-4 w-28 bg-nx-purple/20 rounded-md mb-8" />
          <div className="flex flex-col gap-4">
            <div className="h-6 w-36 bg-nx-purple/20 rounded-full" />
            <div className="h-10 w-3/4 max-w-2xl bg-nx-purple/20 rounded-md" />
            <div className="h-4 w-48 bg-nx-purple/20 rounded-md" />
          </div>
        </div>
      </div>

      {/* Main Grid Content Skeleton */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            <div className="w-full rounded-2xl aspect-video bg-nx-surface/50 border border-nx-purple/10" />

            <div className="flex flex-col gap-3">
              <div className="h-4 w-28 bg-nx-purple/20 rounded-md" />
              <div className="h-4 w-full bg-nx-surface/50 rounded-md" />
              <div className="h-4 w-full bg-nx-surface/50 rounded-md" />
              <div className="h-4 w-2/3 bg-nx-surface/50 rounded-md" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="h-4 w-28 bg-nx-purple/20 rounded-md" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-20 bg-nx-surface/50 rounded-xl border border-nx-purple/10" />
                <div className="h-20 bg-nx-surface/50 rounded-xl border border-nx-purple/10" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1">
            <div className="h-96 bg-nx-surface/50 rounded-2xl border border-nx-purple/10 p-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
