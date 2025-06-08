import React from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ImageProgressProps {
  status: 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
}

const ImageProgress: React.FC<ImageProgressProps> = ({ status, progress = 0, error }) => {
  return (
    <div className={`fixed bottom-4 right-4 max-w-sm w-full bg-white rounded-xl shadow-lg p-4 transform transition-all duration-300 ${
      status === 'success' ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-95'
    }`}>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {status === 'uploading' && (
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          )}
          {status === 'success' && (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          )}
          {status === 'error' && (
            <AlertCircle className="w-6 h-6 text-red-500" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {status === 'uploading' && 'სურათების ატვირთვა...'}
            {status === 'success' && 'სურათები წარმატებით აიტვირთა'}
            {status === 'error' && 'შეცდომა სურათების ატვირთვისას'}
          </p>
          
          {status === 'uploading' && (
            <div className="mt-1">
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {progress}%
              </p>
            </div>
          )}
          
          {status === 'error' && error && (
            <p className="mt-1 text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageProgress;