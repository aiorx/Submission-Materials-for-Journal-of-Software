const shareOnWhatsApp = async () => {
    if (overlayActive) return; // Prevent sharing when overlay is active

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = urls.regular;

    image.onload = async () => {
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw the image
      ctx.drawImage(image, 0, 0);

      // Add semi-transparent black overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Configure text styling
      const fontSize = canvas.width / 15;
      ctx.font = `${fontSize}px 'Caveat', cursive`;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Add text shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Text wrapping and canvas manipulation logic
      // Generated with assistance from GitHub Copilot
      const words = quote.split(" ");
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < canvas.width * 0.8) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);

      // Draw text in center
      const lineHeight = fontSize * 1.2;
      const textY = (canvas.height - lines.length * lineHeight) / 2;
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, textY + index * lineHeight);
      });

      canvas.toBlob(async (blob) => {
        const file = new File([blob], "image.png", { type: "image/png" });
        try {
          await navigator.share({
            files: [file],
            title: "Shared from the app",
            text: quote,
          }); // Source: https://kushkumar636.medium.com/web-apps-share-file-text-urls-over-social-media-96ec654c0b90
        } catch (error) {
          console.error("Error sharing:", error);
        }
      }, "image/png");
    };
  };