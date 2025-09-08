import ImageUpload from "./ImageUpload";
import EffectSelector from "./EffectSelector";
import { Download, Share, RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/contexts/NotificationContext";
import { useState } from "react";

interface VideoHeroProps {
  selectedImage: string | null;
  generatedImage: string | null;
  generatedVideo: string | null;
  selectedEffect: string | null;
  effectCategory: "effects" | "improvements" | null;
  isGenerating: boolean;
  isGeneratingVideo: boolean;
  onImageSelect: (file: File) => void;
  onClearImage: () => void;
  onEffectSelect: (effectId: string, category: "effects" | "improvements") => void;
  onGenerate: () => void;
  onGenerateVideo: () => void;
  onReset: () => void;
}

const VideoHero = ({ 
  selectedImage, 
  generatedImage,
  generatedVideo,
  selectedEffect, 
  effectCategory, 
  isGenerating,
  isGeneratingVideo,
  onImageSelect,
  onClearImage,
  onEffectSelect,
  onGenerate,
  onGenerateVideo,
  onReset 
}: VideoHeroProps) => {
  const { addNotification } = useNotifications();
  
  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `climate-image-${selectedEffect}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      addNotification("success", "Image downloaded successfully!");
    } catch (error) {
      addNotification("error", "Failed to download image");
    }
  };

  const handleShare = async () => {
    if (!generatedImage) return;
    if (navigator.share) {
      try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], `climate-effect-${selectedEffect}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'Climate Impact Visualization',
          text: `Check out this climate impact visualization created with ClimateVision AI`,
          files: [file]
        });
        addNotification("success", "Shared successfully!");
      } catch (error) {
        navigator.clipboard.writeText(window.location.href);
        addNotification("success", "Link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      addNotification("success", "Link copied to clipboard!");
    }
  };

  // Determine which content to show as backdrop
  const backdropContent = generatedVideo || generatedImage || selectedImage;
  const showVideo = !backdropContent;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full">
        {showVideo ? (
          // Show video when no image is uploaded
          <>
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster=""
              style={{ 
                filter: 'none',
                imageRendering: 'crisp-edges',
                objectFit: 'cover'
              }}
            >
              <source src="https://cdn.midjourney.com/video/ae3b755e-e526-4ef1-8168-4c68b97a3af1/0.mp4" type="video/mp4" />
            </video>
          </>
        ) : generatedVideo ? (
          // Show generated video
          <video 
            src={generatedVideo} 
            className="w-full h-full object-cover transition-all duration-1000"
            autoPlay
            loop
            muted
            playsInline
            controls
          />
        ) : (
          // Show uploaded or generated image as backdrop
          <img 
            src={backdropContent} 
            alt="Climate visualization backdrop" 
            className="w-full h-full object-cover transition-all duration-1000"
          />
        )}
      </div>

      {/* Fixed Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Bottom Section - Upload, Effects, or Results */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="max-w-6xl mx-auto">
            {!selectedImage ? (
              <div className="glass-card p-6 animate-slide-up max-w-2xl mx-auto">
                {/* Title and Subtitle */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Start Your Climate Journey
                  </h2>
                  <p className="text-white/80 text-lg">
                    Upload an image and visualize climate impacts
                  </p>
                </div>
                
                {/* Upload Section */}
                <ImageUpload 
                  onImageSelect={onImageSelect}
                  selectedImage={selectedImage}
                  onClearImage={onClearImage}
                />
              </div>
            ) : !generatedImage ? (
              <div className="glass-card p-6 animate-slide-up">
                <EffectSelector
                  selectedEffect={selectedEffect}
                  onEffectSelect={onEffectSelect}
                  onGenerate={onGenerate}
                  isGenerating={isGenerating}
                  minimal={true}
                />
              </div>
            ) : generatedVideo ? (
              <div className="glass-card p-6 animate-slide-up">
                <div className="space-y-4 text-center">
                  <p className="text-white/90 text-lg font-medium">
                    Climate solution video generated! See how {selectedEffect} resolves the climate issue.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      onClick={handleDownload}
                      variant="outline"
                      className="glass-button"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Image
                    </Button>
                    <Button 
                      onClick={handleShare}
                      variant="outline"
                      className="glass-button"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button 
                      onClick={onReset}
                      className="bg-gradient-nature text-primary-foreground hover:opacity-90"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Try Another Effect
                    </Button>
                  </div>
                </div>
              </div>
            ) : generatedImage ? (
              <div className="glass-card p-6 animate-slide-up">
                <div className="space-y-4 text-center">
                  <p className="text-white/90 text-lg font-medium">
                    Climate effect visualization complete!
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      onClick={handleDownload}
                      variant="outline"
                      className="glass-button"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Image
                    </Button>
                    <Button 
                      onClick={handleShare}
                      variant="outline"
                      className="glass-button"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button 
                      onClick={onGenerateVideo}
                      disabled={isGeneratingVideo}
                      variant="outline"
                      className="glass-button"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isGeneratingVideo ? "Generating Video (30-60s)..." : "Generate Video"}
                    </Button>
                    <Button 
                      onClick={onReset}
                      variant="outline"
                      className="glass-button"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Try Another Effect
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoHero;