/**
 * Turns any phone photo into a square, centred, compressed picture card.
 * Phase 1 HTA Task 2: auto-crop removes the manual crop step (3.3), and a
 * small JPEG keeps the board light enough to store and share.
 */
export async function photoToCard(file: File, size = 480): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('not-image');
  if (file.size > 25_000_000) throw new Error('too-big');
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('unreadable'));
      img.src = url;
    });
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('unreadable');
    context.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 0, 0, size, size);
    return canvas.toDataURL('image/jpeg', 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}
