/** Small floating badge shown only in admin preview mode (see src/lib/admin-preview.ts). */
export function AdminPreviewBadge({
  note,
  action,
}: {
  note?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="fixed bottom-3 left-3 z-[60] flex max-w-[92vw] items-center gap-2 rounded-xl bg-slate-900/90 px-3 py-2 text-xs text-white shadow-lg">
      <span className="rounded bg-amber-400 px-1.5 py-0.5 font-black text-slate-900">ADMIN PREVIEW</span>
      <span className="hidden sm:inline text-slate-200">{note ?? "Visitors without a checkout lead can't see this page."}</span>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="rounded-md bg-white px-2 py-1 font-bold text-slate-900 hover:bg-slate-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
