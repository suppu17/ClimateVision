import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: string | null;
  onClearImage: () => void;
}

const ImageUpload = ({ onImageSelect, selectedImage, onClearImage }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      onImageSelect(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onImageSelect(files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  if (selectedImage) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="relative group">
          <img 
            src={selectedImage} 
            alt="Selected for analysis" 
            className="w-full h-64 object-cover rounded-2xl"
          />
          <button
            onClick={onClearImage}
            className="absolute top-2 right-2 p-2 bg-destructive/80 backdrop-blur-sm rounded-full text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-2 glass px-3 py-1 rounded-lg">
            <span className="text-sm text-foreground">Ready for climate analysis</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 animate-fade-in">
      <div
        className={cn(
          "border-2 border-dashed rounded-2xl p-6 transition-colors cursor-pointer flex items-center gap-4",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-glass-border hover:border-primary/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="p-3 glass-button rounded-full flex-shrink-0">
          <Upload className="h-5 w-5 text-primary" />
        </div>
        
        <div className="text-left flex-1">
          <h3 className="text-base font-semibold text-white mb-1">
            Upload Nature Image
          </h3>
          <p className="text-sm text-white/80 mb-1">
            Drop your image here or click to browse
          </p>
          <div className="flex items-center gap-2 text-xs text-white/60">
            <ImageIcon className="h-3 w-3" />
            JPG, PNG, WEBP up to 10MB
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;