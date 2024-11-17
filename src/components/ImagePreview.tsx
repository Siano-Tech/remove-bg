import React, { useState } from 'react';
import { ImageFile } from '../types';
import { X, Download, ArrowLeft, ArrowRight, Image as ImageIcon } from 'lucide-react';

interface Props {
  image: ImageFile;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onDownload: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export default function ImagePreview({
  image,
  onClose,
  onPrevious,
  onNext,
  onDownload,
  hasPrevious,
  hasNext,
}: Props) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [scale, setScale] = useState(1);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={showOriginal ? image.preview : (image.processed || image.preview)}
          alt="Preview"
          className="max-h-[90vh] max-w-[90vw] object-contain transition-transform"
          style={{ transform: `scale(${scale})` }}
        />
      </div>

      <div className="absolute top-4 right-4 flex gap-4">
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        {image.processed && (
          <button
            onClick={onDownload}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={onClose}
          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
        <button
          onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white"
        >
          -
        </button>
        <button
          onClick={() => setScale(1)}
          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white"
        >
          Reset
        </button>
        <button
          onClick={() => setScale(s => Math.min(3, s + 0.1))}
          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white"
        >
          +
        </button>
      </div>

      {hasPrevious && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}