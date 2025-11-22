import CSVUploader from "../../components/upload/CSVUploader";
import { useUploadStore } from "../../state/uploadStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function UploadPage() {
  const { file, rawRows, error, loading } = useUploadStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen  bg-gray-100 pt-12 px-4">
      <div className="max-w-3xl mx-auto space-y-10 animate-fadeIn">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
            {t("upload.import_cases")}
          </h2>
          <p className="text-gray-600 text-lg">
            {t("upload.upload_csv_description")}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-200 space-y-6">

          {/* Upload area */}
          <div className="transition-all duration-300 hover:scale-[1.01]">
            <CSVUploader />
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center">
              <div className="flex items-center gap-3 text-blue-700 font-medium">
                <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                {t("upload.parsing_csv")}
              </div>
            </div>
          )}

          {/* Error card */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg text-center animate-fadeIn">
              {error}
            </div>
          )}

          {/* Success state */}
          {file && rawRows.length > 0 && !loading && (
            <div className="space-y-4 text-center animate-fadeIn">
              <div className="text-green-700 font-semibold text-lg">
                {t("upload.rows_parsed_success", { count: rawRows.length })}
              </div>

              <button
                onClick={() => navigate("/import/preview")}
                className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 transition rounded-lg shadow-md hover:shadow-lg active:scale-95 w-full sm:w-auto"
              >
                {t("upload.continue_to_preview")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
