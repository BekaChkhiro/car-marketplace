import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  files: File[] | string[];
  onUpload: (files: File[]) => void;
  onRemove: (index: number) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
  isUploading?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  files,
  onUpload,
  onRemove,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  isUploading = false
}) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: maxFiles - files.length,
    maxSize,
    disabled: isUploading
  });

  const getPreviewUrl = (file: File | string): string => {
    if (typeof file === 'string') return file;
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-4">
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-primary bg-green-light' 
              : 'border-gray-200 hover:border-primary hover:bg-green-light'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
          ) : (
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? 'Drop the images here...'
              : isUploading
                ? 'Uploading images...'
                : 'Drag and drop images here, or click to select files'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG or WebP up to 5MB (max {maxFiles} files, {maxFiles - files.length} remaining)
          </p>
        </div>
      )}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={getPreviewUrl(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isUploading}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;