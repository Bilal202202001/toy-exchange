"use client";

function categoryCounts(toys) {
  const map = new Map();
  for (const toy of toys) {
    const cat =
      toy.details?.find((d) => d.label === "Category")?.value ?? "Uncategorized";
    map.set(cat, (map.get(cat) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export default function MyToysChart({ toys }) {
  const rows = categoryCounts(toys);
  const max = Math.max(1, ...rows.map((r) => r.count));

  if (toys.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center text-sm text-slate-500">
        Add your first toy below to see category breakdown here.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
        Your listings by category
      </h3>
      <div className="mt-4 space-y-4">
        {rows.map(({ name, count }) => (
          <div key={name}>
            <div className="mb-1 flex items-center justify-between gap-2 text-sm">
              <span className="truncate font-medium text-slate-700">{name}</span>
              <span className="shrink-0 font-semibold text-[#00838F]">{count}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#e0f7fa]/80">
              <div
                className="h-full rounded-full bg-[#00C4D9] transition-all"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-400">
        Total: {toys.length} toy{toys.length === 1 ? "" : "s"} listed by you
      </p>
    </div>
  );
}
