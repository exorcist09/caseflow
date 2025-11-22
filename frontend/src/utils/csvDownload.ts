// app/frontend/src/utils/csvDownload.ts
export function downloadTextAsFile(text: string, filename = 'download.csv') {
  const blob = new Blob([text], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}
