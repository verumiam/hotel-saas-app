export function convertBufferImageToBlobURL(photos: any) {
  return photos.map(({ data }: { data: Buffer }) => {
    const blob = new Blob([new Uint8Array(data)], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  });
}

export async function convertFileImageToBuffer(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const arrayBuffer = reader.result as ArrayBuffer | null;
      if (arrayBuffer) {
        const buffer = Buffer.from(arrayBuffer);
        resolve(buffer);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
