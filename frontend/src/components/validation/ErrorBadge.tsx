
export default function ErrorBadge({ count, label }: { count: number; label?: string }) {
  if (!count) return <span className="text-sm text-gray-500">No errors</span>;
  return (
    <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-2 py-1 rounded">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="font-medium text-sm">{count} {label ?? 'errors'}</span>
    </div>
  );
}
