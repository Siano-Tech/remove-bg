import React, { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import JSZip from 'jszip';
import ImageUploader from './components/ImageUploader';
import ImageGallery from './components/ImageGallery';
import ImagePreview from './components/ImagePreview';
import ExportPanel from './components/ExportPanel';
import { ImageFile, ExportSettings } from './types';
import { Eraser } from 'lucide-react';
import { removeImageBackground } from './utils/backgroundRemoval';
import toast from 'react-hot-toast';

export default function App() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'png',
    quality: 90
  });

  const handleUpload = useCallback(async (files: File[]) => {
    const newImages: ImageFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0
    }));

    setImages(prev => [...prev, ...newImages]);

    // Process each image
    newImages.forEach(async (image) => {
      setImages(prev => prev.map(img =>
        img.id === image.id ? { ...img, status: 'processing' } : img
      ));

      try {
        const processed = await removeImageBackground(image.file, (progress) => {
          setImages(prev => prev.map(img =>
            img.id === image.id ? { ...img, progress } : img
          ));
        });

        setImages(prev => prev.map(img =>
          img.id === image.id ? {
            ...img,
            processed,
            status: 'completed',
            progress: 100
          } : img
        ));

        toast.success('Background removed successfully!');
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error('Failed to remove background. Please try again.');
        setImages(prev => prev.map(img =>
          img.id === image.id ? { ...img, status: 'error' } : img
        ));
      }
    });
  }, []);

  const handleRemove = (id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      if (imageToRemove?.processed) {
        URL.revokeObjectURL(imageToRemove.processed);
      }
      return prev.filter(img => img.id !== id);
    });
    if (previewId === id) setPreviewId(null);
  };

  const handleDownload = async (id: string) => {
    const image = images.find(img => img.id === id);
    if (!image?.processed) return;

    const link = document.createElement('a');
    link.href = image.processed;
    link.download = `removed-bg-${image.file.name.replace(/\.[^/.]+$/, '')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAll = async () => {
    const zip = new JSZip();
    const processedImages = images.filter(img => img.processed);

    try {
      await Promise.all(processedImages.map(async (image) => {
        const response = await fetch(image.processed!);
        const blob = await response.blob();
        const filename = `removed-bg-${image.file.name.replace(/\.[^/.]+$/, '')}.png`;
        zip.file(filename, blob);
      }));

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'processed-images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      toast.success('All images downloaded successfully!');
    } catch (error) {
      console.error('Error creating zip:', error);
      toast.error('Failed to create zip file');
    }
  };

  const previewImage = images.find(img => img.id === previewId);
  const previewIndex = images.findIndex(img => img.id === previewId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eraser className="w-12 h-12 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-900">Background Remover</h1>
          </div>
          <p className="text-lg text-gray-600">
            Upload your images and let AI remove the backgrounds instantly
          </p>
        </header>

        <div className="mb-8">
          <ImageUploader onUpload={handleUpload} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <ImageGallery
              images={images}
              onRemove={handleRemove}
              onPreview={setPreviewId}
              onDownload={handleDownload}
            />
          </div>
          
          <div>
            <ExportPanel
              settings={exportSettings}
              onSettingsChange={setExportSettings}
              onExportAll={handleExportAll}
              hasProcessedImages={images.some(img => img.processed)}
            />
          </div>
        </div>
      </div>

      {previewImage && (
        <ImagePreview
          image={previewImage}
          onClose={() => setPreviewId(null)}
          onPrevious={() => setPreviewId(images[previewIndex - 1].id)}
          onNext={() => setPreviewId(images[previewIndex + 1].id)}
          hasPrevious={previewIndex > 0}
          hasNext={previewIndex < images.length - 1}
          onDownload={() => handleDownload(previewImage.id)}
        />
      )}
    </div>
  );
}