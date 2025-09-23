import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, AlertCircle, Star, Image as ImageIcon, Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ImageProgress from './ImageProgress';

interface DealerImageUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  featuredIndex: number;
  onFeaturedIndexChange: (index: number) => void;
  error?: string;
  maxFiles?: number;
  isUploading?: boolean;
}

const DealerImageUpload: React.FC<DealerImageUploadProps> = ({
  files,
  onFilesChange,
  onFileRemove,
  maxFiles = 1,
  featuredIndex,
  onFeaturedIndexChange,
  error,
  isUploading
}) => {
  const { t } = useTranslation('common');
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
    // Filter out duplicates and invalid files
    let filesAdded = 0;
    let filesRejected = 0;
    
    const filesToAdd = acceptedFiles.filter(newFile => {
      // Check if the file already exists in the files array
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
      
      if (newFile.size > 10 * 1024 * 1024) {  // 10MB limit
        filesRejected++;
        return false;
      }
      
      filesAdded++;
      return true;
    });
    
    if (filesToAdd.length > 0) {
      onFilesChange([...files, ...filesToAdd]);
      simulateUpload();
    }
    
    if (filesRejected > 0) {
      console.warn(`${filesRejected} files could not be uploaded (duplicate or excess amount)`);
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
    <div className="space-y-3">

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 mb-4">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {files.length === 0 ? (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 ${
            isDragReject
              ? 'border-red-400 bg-red-50'
              : isDragActive || draggedOver
              ? 'border-primary bg-primary/10'
              : isUploading
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-300 hover:border-primary hover:bg-primary/5'
          }`}
        >
          <input {...getInputProps()} capture="environment" />
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              isDragReject
                ? 'bg-red-100'
                : isDragActive || draggedOver
                ? 'bg-primary/20 scale-110'
                : isUploading
                ? 'bg-gray-100'
                : 'bg-primary/10'
            }`}
          >
            {isDragReject ? (
              <AlertCircle className="w-6 h-6 text-red-500" />
            ) : isUploading ? (
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <UploadCloud className="w-6 h-6 text-primary" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-700 font-medium">
              {isDragActive
                ? t('dragDropHere')
                : t('clickOrDragLogo')}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP • {t('maxSize')} 10MB
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="aspect-[3/2] rounded-lg overflow-hidden relative group"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
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
                  title={t('deletePhoto')}
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
                  title={featuredIndex === index ? t('mainPhoto') : t('setAsMainPhoto')}
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
                className="aspect-[3/2] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition-all duration-300 group"
              >
                <input {...getInputProps()} capture="environment" />
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                  <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                </div>
                <span className="text-xs text-gray-500 group-hover:text-primary transition-colors duration-300">
                  {t('add')}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-600 flex items-center gap-2">
              <ImageIcon size={14} className="text-primary" />
              {files.length} / {maxFiles} {t('logo')}
            </span>
            <button
              onClick={handleRemoveAll}
              className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors duration-300 px-3 py-1.5 rounded-md hover:bg-red-50"
            >
              {t('delete')}
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

export default DealerImageUpload;
