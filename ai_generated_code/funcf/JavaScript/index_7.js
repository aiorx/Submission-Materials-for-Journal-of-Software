async function HandleExportClicked() {
  // Code Assisted with basic coding tools

  // Convert the png data from cytoscape into a blob
  const pngData = webgraph.png();
  const byteCharacters = atob(pngData.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/png" });

  // Generate an invisible button that will download the blob on click, and
  // automatically click it, then remove it
  const downloadButton = document.createElement("a");
  downloadButton.href = URL.createObjectURL(blob);
  downloadButton.download = GetExportFilename();
  document.body.appendChild(downloadButton);
  downloadButton.click();
  document.body.removeChild(downloadButton);
}