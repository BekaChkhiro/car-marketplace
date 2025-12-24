import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { UploadCloud, X, AlertCircle, Star, Image as ImageIcon, Camera, Images } from 'lucide-react';
import ImageProgress from './ImageProgress';

interface ImageUploadWithFeaturedProps {
  files: File[];
  existingImages?: any[];
  imagesToDelete?: number[]; // Images marked for deletion
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
  imagesToDelete = [],
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
  const { t } = useTranslation('profile');
  const [uploadStatus, setUploadStatus] = useState<'uploading' | 'success' | 'error'>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [draggedOver, setDraggedOver] = useState(false);
  const [showMobileOptions, setShowMobileOptions] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Check if device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleMobileUploadClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setShowMobileOptions(true);
    }
  };

  const handleCameraClick = () => {
    setShowMobileOptions(false);
    cameraInputRef.current?.click();
  };

  const handleGalleryClick = () => {
    setShowMobileOptions(false);
    galleryInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      onDrop(Array.from(selectedFiles));
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

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
      console.warn(`${filesRejected} files could not be uploaded (duplicate or exceeding limit)`);
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
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
      'image/webp': []
    },
    maxFiles: maxFiles - files.length,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading,
    multiple: true
  });

  return (
    <div className="space-y-6">
      {/* Hidden inputs for mobile camera/gallery */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        capture="environment"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Mobile options modal */}
      {showMobileOptions && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center"
          onClick={() => setShowMobileOptions(false)}
        >
          <div
            className="bg-white w-full sm:w-96 rounded-t-2xl sm:rounded-2xl p-6 space-y-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-center text-gray-900">
              {t('imageUpload.selectSource') || 'აირჩიეთ წყარო'}
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleCameraClick}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{t('imageUpload.camera') || 'კამერა'}</p>
                  <p className="text-sm text-gray-500">{t('imageUpload.takePhoto') || 'გადაიღეთ ფოტო'}</p>
                </div>
              </button>
              <button
                onClick={handleGalleryClick}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Images className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{t('imageUpload.gallery') || 'გალერია'}</p>
                  <p className="text-sm text-gray-500">{t('imageUpload.chooseFromGallery') || 'აირჩიეთ გალერიიდან'}</p>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowMobileOptions(false)}
              className="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
            >
              {t('imageUpload.cancel') || 'გაუქმება'}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-12">
          <ImageIcon size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('addCar.images.title')}</h2>
          <p className="text-sm text-gray-500">{t('addCar.images.subtitle')}</p>
        </div>
      </div>

      <div
        {...(isMobile ? {} : getRootProps())}
        onClick={isMobile ? handleMobileUploadClick : undefined}
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
        {!isMobile && <input {...getInputProps()} />}
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
                ? t('imageUpload.invalidFormat')
                : isDragActive || draggedOver
                ? t('imageUpload.dropHere')
                : isUploading
                ? t('imageUpload.uploading')
                : t('imageUpload.dropOrClick')}
            </p>
            <p className="text-base text-gray-600">
              {isDragActive ? t('imageUpload.dropHere') : t('imageUpload.selectOrDrop')}
            </p>
            <p className="text-sm text-gray-500">
              {t('imageUpload.formatInfo')}
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
            <h4 className="text-sm font-medium text-gray-600">{t('imageUpload.existingPhotos')}</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {existingImages.map((image, index) => {
              const isMarkedForDeletion = imagesToDelete.includes(image.id);
              return (
                <div
                  key={image.id}
                  className={`relative aspect-square rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 ${
                    isMarkedForDeletion ? 'opacity-50' : ''
                  }`}
                >
                  <img
                    src={image.medium_url || image.url}
                    alt={`Car image ${index + 1}`}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      isMarkedForDeletion ? 'grayscale' : ''
                    }`}
                  />
                  <div className={`absolute inset-0 ${
                    isMarkedForDeletion
                      ? 'bg-red-500/30'
                      : 'bg-black/40 opacity-0 group-hover:opacity-100'
                  } transition-opacity duration-300`} />

                  {/* Red overlay with X for deleted images */}
                  {isMarkedForDeletion && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-red-500 rounded-full p-3">
                        <X size={24} className="text-white" />
                      </div>
                    </div>
                  )}

                  {onExistingImageRemove && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExistingImageRemove(image.id);
                      }}
                      className={`absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                        isMarkedForDeletion
                          ? 'bg-green-500 text-white opacity-100 hover:bg-green-600'
                          : 'bg-white/90 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-white'
                      }`}
                      title={isMarkedForDeletion ? t('imageUpload.restorePhoto') : t('imageUpload.removePhoto')}
                    >
                      {isMarkedForDeletion ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                          <path d="M3 3v5h5"></path>
                        </svg>
                      ) : (
                        <X size={18} />
                      )}
                    </button>
                  )}
                  {onSetPrimaryImage && !image.is_primary && !isMarkedForDeletion && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetPrimaryImage(image.id);
                      }}
                      className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-white/90 text-gray-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:text-primary"
                      title={t('imageUpload.setAsPrimary')}
                    >
                      <Star size={18} fill="none"
                        className="transform transition-transform duration-300 hover:rotate-12"
                      />
                    </button>
                  )}
                  {image.is_primary && !isMarkedForDeletion && (
                    <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center scale-110 opacity-100">
                      <Star size={18} fill="white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ახალი ფოტოები */}
      {files.length > 0 && (
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">{t('imageUpload.newPhotos')}</h4>
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
                  title={featuredIndex === index ? t('imageUpload.primaryPhoto') : t('imageUpload.setAsPrimary')}
                >
                  <Star size={18} fill={featuredIndex === index ? 'white' : 'none'} 
                    className="transform transition-transform duration-300 hover:rotate-12"
                  />
                </button>
              </div>
            ))}
            
            {files.length < maxFiles && (
              <div
                {...(isMobile ? {} : getRootProps())}
                onClick={isMobile ? handleMobileUploadClick : undefined}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition-all duration-300 group"
              >
                {!isMobile && <input {...getInputProps()} />}
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                  <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                </div>
                <span className="text-sm text-gray-500 group-hover:text-primary transition-colors duration-300">
                  {t('imageUpload.addMore')}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <ImageIcon size={16} className="text-primary" />
                {files.length} / {maxFiles} {t('imageUpload.photos')}
              </span>
              {featuredIndex > -1 && (
                <span className="text-sm text-primary flex items-center gap-2">
                  <Star size={16} className="fill-primary" />
                  {t('imageUpload.primaryPhotoSelected')}
                </span>
              )}
            </div>
            <button
              onClick={handleRemoveAll}
              className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-red-50"
            >
              {t('imageUpload.removeAll')}
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