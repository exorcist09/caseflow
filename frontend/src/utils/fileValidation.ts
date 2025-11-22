export function validateCSVFile(file: File): string | null {
  if (!file) return "No file selected.";

  if (!file.name.endsWith(".csv")) {
    return "Only CSV files are allowed.";
  }

  if (file.size > 50 * 1024 * 1024) {
    return "File cannot exceed 50 MB.";
  }

  return null;
}
