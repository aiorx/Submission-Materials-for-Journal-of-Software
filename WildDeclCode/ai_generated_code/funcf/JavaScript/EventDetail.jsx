```javascript
const copyQRCodeToClipboard = async () => {
  // Crafted with standard coding tools
  try {
    const svgElement = qrCodeRef.current.querySelector("svg");
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      const image = new Image();
      image.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        URL.revokeObjectURL(url);

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );
        const clipboardItem = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([clipboardItem]);
      };
      image.src = url;
    } else {
      alert("Failed to find QR code.");
    }
  } catch (error) {
    console.error("Error copying QR code to clipboard:", error);
    alert("Failed to copy QR code to clipboard.");
  }
};
```