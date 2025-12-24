import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, AlertCircle, Camera, Images } from 'lucide-react';

interface ImageUploadProps {
  files: File[];
  onUpload: (files: File[]) => void;
  onRemove: (index: number) => void;
  maxFiles?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  files,
  onUpload,
  onRemove,
  maxFiles = 10
}) => {
  const [showMobileOptions, setShowMobileOptions] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Check if device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files];
    acceptedFiles.forEach(file => {
      if (newFiles.length < maxFiles && file.size <= 10 * 1024 * 1024) {
        newFiles.push(file);
      }
    });
    onUpload(newFiles);
  }, [files, maxFiles, onUpload]);

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
    e.target.value = '';
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
      'image/webp': []
    },
    maxFiles: maxFiles - files.length,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  return (
    <div className="space-y-4">
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
              აირჩიეთ წყარო
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
                  <p className="font-medium text-gray-900">კამერა</p>
                  <p className="text-sm text-gray-500">გადაიღეთ ფოტო</p>
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
                  <p className="font-medium text-gray-900">გალერია</p>
                  <p className="text-sm text-gray-500">აირჩიეთ გალერიიდან</p>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowMobileOptions(false)}
              className="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
            >
              გაუქმება
            </button>
          </div>
        </div>
      )}

      <div
        {...(isMobile ? {} : getRootProps())}
        onClick={isMobile ? handleMobileUploadClick : undefined}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragReject
            ? 'border-red-500 bg-red-50'
            : isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
        }`}
      >
        {!isMobile && <input {...getInputProps()} />}
        <div className="flex flex-col items-center gap-2">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDragReject
              ? 'bg-red-100'
              : isDragActive
              ? 'bg-primary/20'
              : 'bg-primary/10'
          }`}>
            {isDragReject ? (
              <AlertCircle className="w-6 h-6 text-red-500" />
            ) : (
              <UploadCloud className={`w-6 h-6 ${
                isDragActive ? 'text-primary/70' : 'text-primary'
              }`} />
            )}
          </div>
          <div className="space-y-1">
            <p className={`text-sm font-medium ${
              isDragReject
                ? 'text-red-600'
                : 'text-gray-700'
            }`}>
              {isDragReject
                ? 'არასწორი ფაილის ტიპი ან ზომა'
                : isDragActive
                ? 'ჩააგდეთ სურათები აქ'
                : 'აირჩიეთ ან ჩააგდეთ სურათები'}
            </p>
            <p className="text-sm text-gray-500">
              მაქსიმალური ზომა: 10MB | ფორმატები: JPG, PNG, WEBP
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden group shadow-sm"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-xs text-white truncate">
                  {file.name}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-white/90 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-105"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          {files.length < maxFiles && (
            <div
              {...(isMobile ? {} : getRootProps())}
              onClick={isMobile ? handleMobileUploadClick : undefined}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition-all duration-200 group"
            >
              {!isMobile && <input {...getInputProps()} />}
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-200">
                <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
              </div>
              <span className="text-sm text-gray-500 group-hover:text-primary transition-colors duration-200">
                დაამატეთ მეტი
              </span>
            </div>
          )}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">
            {files.length} / {maxFiles} სურათი
          </span>
          <button
            onClick={() => onUpload([])}
            className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors duration-200 px-3 py-1 rounded-md hover:bg-red-50"
          >
            ყველას წაშლა
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
