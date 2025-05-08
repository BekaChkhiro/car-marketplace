import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, AlertCircle, Star, Image as ImageIcon } from 'lucide-react';
import ImageProgress from './ImageProgress';

interface ImageUploadWithFeaturedProps {
  files: File[];
  existingImages?: any[];
  onFilesChange: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  onExistingImageRemove?: (imageId: number) => void;
  onSetPrimaryImage?: (imageId: number) => void;
  featuredIndex: number;
  onFeaturedIndexChange: (index: number) => void;
  error?: string;
  maxFiles?: number;
  isUploading?: boolean;
}

const ImageUploadWithFeatured: React.FC<ImageUploadWithFeaturedProps> = ({
  files,
  existingImages = [],
  onFilesChange,
  onFileRemove,
  onExistingImageRemove,
  onSetPrimaryImage,
  maxFiles = 10,
  featuredIndex,
  onFeaturedIndexChange,
  error,
  isUploading
}) => {
  const [uploadStatus, setUploadStatus] = useState<'uploading' | 'success' | 'error'>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [draggedOver, setDraggedOver] = useState(false);

  const simulateUpload = () => {
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('success');
          setTimeout(() => setUploadStatus(undefined), 3000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Don't modify the existing files array directly
    let filesAdded = 0;
    let filesRejected = 0;
    
    // Filter out duplicates and invalid files
    const filesToAdd = acceptedFiles.filter(newFile => {
      // Check if the file already exists in the files array (by name and size)
      const isDuplicate = files.some(existingFile => 
        existingFile.name === newFile.name && existingFile.size === newFile.size
      );
      
      if (isDuplicate) {
        filesRejected++;
        return false;
      }
      
      if (files.length + filesAdded >= maxFiles) {
        filesRejected++;
        return false;
      }
      
      if (newFile.size > 10 * 1024 * 1024) {
        filesRejected++;
        return false;
      }
      
      filesAdded++;
      return true;
    });
    
    if (filesToAdd.length > 0) {
      // Only pass the new files to add to the parent component
      onFilesChange([...files, ...filesToAdd]);
      simulateUpload();
    }
    
    if (filesRejected > 0) {
      // You could add a toast notification here if you have a toast system
      console.warn(`${filesRejected} ფაილი ვერ აიტვირთა (დუბლიკატი ან ზედმეტი რაოდენობა)`);
    }
  }, [files, maxFiles, onFilesChange]);

  const handleRemove = (index: number) => {
    onFileRemove(index);
  };

  const handleRemoveAll = () => {
    onFilesChange([]);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    onDragEnter: () => setDraggedOver(true),
    onDragLeave: () => setDraggedOver(false),
    onDropAccepted: () => setDraggedOver(false),
    onDropRejected: () => setDraggedOver(false),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxFiles - files.length,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-12">
          <ImageIcon size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">სურათები</h2>
          <p className="text-sm text-gray-500">ატვირთეთ მანქანის სურათები</p>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragReject
            ? 'border-red-500 bg-red-50'
            : isDragActive || draggedOver
            ? 'border-primary bg-primary/5'
            : isUploading
            ? 'border-gray-300 bg-gray-50 opacity-70'
            : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
        } ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center transform transition-all duration-300 ${
            isDragReject
              ? 'bg-red-100'
              : isDragActive || draggedOver
              ? 'bg-primary/20 scale-110'
              : isUploading
              ? 'bg-gray-100'
              : 'bg-primary/10'
          }`}>
            {isDragReject ? (
              <AlertCircle className="w-8 h-8 text-red-500" />
            ) : isUploading ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <UploadCloud className={`w-8 h-8 ${
                isDragActive || draggedOver ? 'text-primary scale-110' : 'text-primary'
              } transform transition-all duration-300`} />
            )}
          </div>
          <div className="space-y-2">
            <p className={`text-base font-medium ${
              isDragReject
                ? 'text-red-600'
                : isUploading
                ? 'text-gray-500'
                : 'text-gray-700'
            }`}>
              {isDragReject
                ? 'ფაილის ფორმატი არასწორია'
                : isDragActive || draggedOver
                ? 'ჩააგდეთ სურათები აქ...'
                : isUploading
                ? 'მიმდინარეობს ატვირთვა...'
                : 'ჩააგდეთ სურათები ან დააჭირეთ ასატვირთად'}
            </p>
            <p className="text-base text-gray-600">
              {isDragActive ? 'ჩააგდეთ სურათები აქ...' : 'აირჩიეთ ან ჩააგდეთ სურათები'}
            </p>
            <p className="text-sm text-gray-500">
              დაშვებულია JPEG, PNG, WebP ფორმატები, მაქსიმუმ 10MB
            </p>
            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* არსებული ფოტოები */}
      {existingImages && existingImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">არსებული ფოტოები</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {existingImages.map((image, index) => (
              <div
                key={image.id}
                className="relative aspect-square rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
              >
                <img
                  src={image.medium_url || image.url}
                  alt={`Car image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {onExistingImageRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onExistingImageRemove(image.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-white/90 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                    title="ფოტოს წაშლა"
                  >
                    <X size={18} />
                  </button>
                )}
                {onSetPrimaryImage && !image.is_primary && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetPrimaryImage(image.id);
                    }}
                    className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-white/90 text-gray-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:text-primary"
                    title="დააყენეთ მთავარ სურათად"
                  >
                    <Star size={18} fill="none" 
                      className="transform transition-transform duration-300 hover:rotate-12"
                    />
                  </button>
                )}
                {image.is_primary && (
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center scale-110 opacity-100">
                    <Star size={18} fill="white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ახალი ფოტოები */}
      {files.length > 0 && (
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">ახალი ფოტოები</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-xs text-white truncate">
                    {file.name}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-white/90 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                  title="ფოტოს წაშლა"
                >
                  <X size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFeaturedIndexChange(index);
                  }}
                  className={`absolute top-2 left-2 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                    featuredIndex === index
                      ? 'bg-primary text-white opacity-100 scale-110'
                      : 'bg-white/90 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-primary'
                  }`}
                  title={featuredIndex === index ? 'მთავარი სურათი' : 'დააყენეთ მთავარ სურათად'}
                >
                  <Star size={18} fill={featuredIndex === index ? 'white' : 'none'} 
                    className="transform transition-transform duration-300 hover:rotate-12"
                  />
                </button>
              </div>
            ))}
            
            {files.length < maxFiles && (
              <div
                {...getRootProps()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition-all duration-300 group"
              >
                <input {...getInputProps()} />
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                  <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                </div>
                <span className="text-sm text-gray-500 group-hover:text-primary transition-colors duration-300">
                  დაამატეთ მეტი
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <ImageIcon size={16} className="text-primary" />
                {files.length} / {maxFiles} სურათი
              </span>
              {featuredIndex > -1 && (
                <span className="text-sm text-primary flex items-center gap-2">
                  <Star size={16} className="fill-primary" />
                  მთავარი სურათი არჩეულია
                </span>
              )}
            </div>
            <button
              onClick={handleRemoveAll}
              className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-red-50"
            >
              ყველას წაშლა
            </button>
          </div>
        </div>
      )}

      {(uploadStatus || isUploading) && (
        <ImageProgress 
          status={isUploading ? 'uploading' : uploadStatus || 'uploading'}
          progress={isUploading ? 50 : uploadProgress}
          error={error}
        />
      )}
    </div>
  );
};

export default ImageUploadWithFeatured;