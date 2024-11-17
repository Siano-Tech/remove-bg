import { removeBackground } from '@imgly/background-removal';

export async function removeImageBackground(
  file: File, 
  onProgress: (progress: number) => void
): Promise<string> {
  try {
    const blob = await removeBackground(file, {
      progress: (progress) => {
        // The library returns progress from 0 to 1
        onProgress(Math.round(progress * 100));
      },
      model: 'medium', // Use medium quality for faster processing
      output: {
        format: 'image/png', // PNG format to preserve transparency
        quality: 0.8,
      },
    });

    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Background removal failed:', error);
    throw error;
  }
}