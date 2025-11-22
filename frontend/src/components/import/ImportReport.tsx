export default function ImportReport({
  successes,
  failures,
  failedRowsCSV,
}: {
  successes: number;
  failures: number;
  failedRowsCSV: string | null;
}) {
  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="font-semibold text-lg mb-3">Import Summary</h3>

      <div className="flex gap-6">
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 w-1/2">
          <p className="text-green-700 font-medium">
            Successful Rows: {successes}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-red-50 border border-red-200 w-1/2">
          <p className="text-red-700 font-medium">Failed Rows: {failures}</p>
        </div>
      </div>

      {failedRowsCSV && (
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(
            failedRowsCSV
          )}`}
          download="failed_rows.csv"
          className="inline-block mt-4 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          Download Error CSV
        </a>
      )}
    </div>
  );
}
