export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-[#111111] border border-[#27272a] rounded-2xl p-6 animate-pulse"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#1f1f1f]" />
                <div className="h-4 w-40 bg-[#1f1f1f] rounded" />
              </div>
              <div className="flex gap-3">
                <div className="h-3 w-16 bg-[#1f1f1f] rounded" />
                <div className="h-3 w-10 bg-[#1f1f1f] rounded" />
                <div className="h-3 w-10 bg-[#1f1f1f] rounded" />
              </div>
            </div>
            <div className="h-3 w-12 bg-[#1f1f1f] rounded" />
          </div>

          {/* Description */}
          <div className="space-y-1.5 mb-4">
            <div className="h-3.5 w-full bg-[#1f1f1f] rounded" />
            <div className="h-3.5 w-3/4 bg-[#1f1f1f] rounded" />
          </div>

          {/* Divider */}
          <div className="border-t border-[#1a1a1a] my-4" />

          {/* Issues */}
          <div className="space-y-3 mb-4">
            {[1, 2].map((j) => (
              <div key={j} className="flex items-start gap-2.5">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1f1f1f]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-full bg-[#1f1f1f] rounded" />
                  <div className="h-5 w-28 bg-[#1f1f1f] rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Score */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-[#1f1f1f] rounded" />
              <div className="h-3 w-8 bg-[#1f1f1f] rounded" />
            </div>
            <div className="h-1 w-full bg-[#1f1f1f] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
