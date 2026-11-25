/** Shimmer skeleton placeholders shown while a route streams in. */

export function Sk({ className = "" }: { className?: string }) {
  return <div className={`tb-shimmer rounded-xl ${className}`} />;
}

function Shell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <Shell label="Loading TalentBridge">
      <div className="space-y-20">
        <div className="grid items-center gap-12 pt-4 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Sk className="h-7 w-56 rounded-full" />
            <div className="mt-6 space-y-3">
              <Sk className="h-14 w-full max-w-xl" />
              <Sk className="h-14 w-11/12 max-w-lg" />
              <Sk className="h-14 w-2/3 max-w-md" />
            </div>
            <div className="mt-7 space-y-2.5">
              <Sk className="h-4 w-full max-w-xl" />
              <Sk className="h-4 w-11/12 max-w-lg" />
              <Sk className="h-4 w-3/4 max-w-md" />
            </div>
            <div className="mt-8 flex gap-3">
              <Sk className="h-12 w-44" />
              <Sk className="h-12 w-40" />
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-slate-200 pt-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Sk className="h-3 w-20" />
                  <Sk className="h-7 w-14" />
                </div>
              ))}
            </div>
          </div>
          <CardSkeleton rows={4} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6">
              <Sk className="h-9 w-9 rounded-full" />
              <Sk className="h-5 w-2/3" />
              <Sk className="h-3.5 w-full" />
              <Sk className="h-3.5 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function CardSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <Sk className="h-14 w-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Sk className="h-5 w-40" />
          <Sk className="h-3.5 w-64 max-w-full" />
        </div>
      </div>
      <div className="mt-6 space-y-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Sk className="h-4 w-40" />
              <Sk className="h-3 w-28" />
            </div>
            <Sk className="h-2 w-28 rounded-full" />
          </div>
        ))}
      </div>
      <Sk className="mt-6 h-24 w-full rounded-2xl" />
    </div>
  );
}

export function ListSkeleton({ label = "Loading vacancies", items = 6 }: { label?: string; items?: number }) {
  return (
    <Shell label={label}>
      <div className="space-y-8">
        <div className="max-w-2xl space-y-3">
          <Sk className="h-4 w-28" />
          <Sk className="h-12 w-full" />
          <Sk className="h-4 w-4/5" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Sk key={i} className="h-10 w-28" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: items }).map((_, i) => (
            <div key={i} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Sk className="h-6 w-2/3" />
                  <Sk className="h-3.5 w-1/3" />
                </div>
                <Sk className="h-8 w-20 rounded-full" />
              </div>
              <Sk className="h-3.5 w-full" />
              <Sk className="h-3.5 w-5/6" />
              <div className="flex gap-2 pt-1">
                <Sk className="h-6 w-20 rounded-md" />
                <Sk className="h-6 w-24 rounded-md" />
                <Sk className="h-6 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function DetailSkeleton({ label = "Loading vacancy" }: { label?: string }) {
  return (
    <Shell label={label}>
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8">
          <Sk className="h-4 w-32" />
          <Sk className="h-11 w-3/4" />
          <div className="flex gap-2">
            <Sk className="h-7 w-24 rounded-full" />
            <Sk className="h-7 w-28 rounded-full" />
            <Sk className="h-7 w-20 rounded-full" />
          </div>
          {Array.from({ length: 7 }).map((_, i) => (
            <Sk key={i} className={`h-4 ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />
          ))}
        </div>
        <div className="h-fit space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
          <Sk className="h-6 w-1/2" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Sk key={i} className="h-9 w-full" />
          ))}
          <Sk className="h-12 w-full" />
        </div>
      </div>
    </Shell>
  );
}

export function PortalSkeleton() {
  return (
    <Shell label="Loading your portal">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-8">
          <div className="flex items-center gap-5">
            <Sk className="h-16 w-16 rounded-2xl" />
            <div className="space-y-2.5">
              <Sk className="h-8 w-64 max-w-full" />
              <Sk className="h-4 w-44" />
            </div>
          </div>
          <Sk className="h-12 w-48" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
              <Sk className="h-3.5 w-28" />
              <Sk className="h-9 w-16" />
              <Sk className="h-3 w-40" />
            </div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 lg:col-span-2">
            <Sk className="h-6 w-48" />
            {[0, 1].map((i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-slate-200 p-5">
                <div className="flex justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Sk className="h-5 w-1/2" />
                    <Sk className="h-3.5 w-1/4" />
                  </div>
                  <Sk className="h-14 w-14 rounded-full" />
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 1, 2, 3, 4].map((j) => (
                    <Sk key={j} className="h-1.5 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6">
            <Sk className="h-6 w-40" />
            {[0, 1, 2, 3].map((i) => (
              <Sk key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
