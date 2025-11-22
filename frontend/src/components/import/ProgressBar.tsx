export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div className="h-full bg-indigo-600 transition-all" style={{ width: `${percent}%` }} />
    </div>
  );
}
