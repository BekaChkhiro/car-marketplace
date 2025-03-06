import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadCarImages } from '../api/services/carService';

interface ImageUploadProps {
  carId: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxFiles?: number;
  onError?: (error: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  carId,
  images, 
  onImagesChange, 
  maxFiles = 10,
  onError 
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true);
      const response = await uploadCarImages(carId, acceptedFiles);
      
      // Extract image URLs from the response and update state
      const newImages = response.images.map(img => img.large);
      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  }, [carId, images, onImagesChange, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: maxFiles - images.length, // Adjust max files based on current count
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isUploading
  });

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {images.length < maxFiles && (
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
            PNG, JPG or WebP up to 5MB (max {maxFiles} files, {maxFiles - images.length} remaining)
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isUploading}
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