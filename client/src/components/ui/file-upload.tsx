
import { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  label?: string;
  className?: string;
  accept?: string;
}

export function FileUpload({ 
  onFileSelect, 
  label = "Upload document or image", 
  className,
  accept = "image/*,application/pdf"
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("w-full", className)}>
      <div 
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ease-in-out text-center cursor-pointer group",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-gray-200 hover:border-primary/50 hover:bg-gray-50",
          file ? "border-solid border-green-200 bg-green-50/30" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!file ? triggerFileSelect : undefined}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={inputRef} 
          onChange={handleFileChange} 
          accept={accept}
        />

        {!file ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900">{label}</h3>
              <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
            </div>
            <p className="text-xs text-gray-400">Supports JPG, PNG, PDF</p>
          </div>
        ) : (
          <div className="flex items-center gap-4 py-2 text-left">
            <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
              {file.type.includes('image') ? (
                <ImageIcon className="w-6 h-6 text-blue-500" />
              ) : (
                <FileText className="w-6 h-6 text-orange-500" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{file.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{uploadProgress}%</span>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-red-500 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
      
      {file && uploadProgress === 100 && (
        <div className="flex items-center gap-2 mt-2 text-sm text-green-600 animate-in fade-in slide-in-from-top-1">
          <CheckCircle className="w-4 h-4" />
          <span>Ready to submit</span>
        </div>
      )}
    </div>
  );
}
