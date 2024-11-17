import React from 'react';
import { ImageFile } from '../types';
import { X, ZoomIn, Download, Loader2 } from 'lucide-react';

interface Props {
  images: ImageFile[];
  onRemove: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
}

export default function ImageGallery({ images, onRemove, onPreview, onDownload }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative group">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={image.processed || image.preview}
              alt="Preview"
              className="w-full h-full object-cover transition-opacity"
            />
            {image.status === 'processing' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                  <p className="mt-2">Processing...</p>
                  <p className="text-sm">{image.progress}%</p>
                </div>
              </div>
            )}
          </div>

          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onPreview(image.id)}
              className="p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {image.processed && (
              <button
                onClick={() => onDownload(image.id)}
                className="p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onRemove(image.id)}
              className="p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}