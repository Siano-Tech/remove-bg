import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  onUpload: (files: File[]) => void;
}

export default function ImageUploader({ onUpload }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== acceptedFiles.length) {
      toast.error('Some files were rejected. Only images are allowed.');
    }
    if (validFiles.length > 0) {
      onUpload(validFiles);
      toast.success(`${validFiles.length} image${validFiles.length > 1 ? 's' : ''} uploaded`);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-8 border-2 border-dashed rounded-xl transition-colors cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-4 bg-blue-50 rounded-full">
          {isDragActive ? (
            <ImageIcon className="w-8 h-8 text-blue-500" />
          ) : (
            <Upload className="w-8 h-8 text-blue-500" />
          )}
        </div>
        <div>
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop your images here' : 'Drag & drop images here'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or click to select files
          </p>
        </div>
        <p className="text-xs text-gray-400">
          Supports PNG, JPG, JPEG, WebP
        </p>
      </div>
    </div>
  );
}