const calculateTotalSizeMB = async (images: Image[]): Promise<number> => {
  const filePromises = images.map(async (image) => {
    const url = image.url;

    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return new File([blob], filename, { type: blob.type });
  });

  const files = await Promise.all(filePromises);
  const totalSizeBytes = files.reduce((total, file) => total + file.size, 0);
  const totalSizeMB = totalSizeBytes / (1024 * 1024);
  return totalSizeMB;
};