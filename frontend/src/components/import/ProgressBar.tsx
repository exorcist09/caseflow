export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
      <div
        className="h-full bg-indigo-600 transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
