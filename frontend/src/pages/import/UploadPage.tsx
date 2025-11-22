import CSVUploader from "../../components/upload/CSVUploader";
import { useUploadStore } from "../../state/uploadStore";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
const { file, rawRows, error, loading } = useUploadStore();

  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto pt-10 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Import Cases</h2>
        <p className="text-gray-600">
          Upload a CSV file to begin validation and mapping.
        </p>
      </div>

      <CSVUploader />

      {loading && (
        <div className="text-blue-600 font-medium text-center animate-pulse">
          Parsing CSV... Please wait.
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      {file && rawRows.length > 0 && (
        <div className="text-center space-y-3">
          <div className="text-green-700 font-semibold">
            {rawRows.length} rows parsed successfully!
          </div>

          <button
            onClick={() => navigate("/import/preview")}
            className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Continue to Preview →
          </button>
        </div>
      )}
    </div>
  );
}
