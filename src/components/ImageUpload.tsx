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
    <div className="glass-card p-8 animate-fade-in">
      <div
        className={cn(
          "border-2 border-dashed rounded-3xl p-12 text-center transition-colors cursor-pointer",
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
        
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 glass-button rounded-full">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upload Nature Image
            </h3>
            <p className="text-muted-foreground mb-4">
              Drop your image here or click to browse
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              JPG, PNG, WEBP up to 10MB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;