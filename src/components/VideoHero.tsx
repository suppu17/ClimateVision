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
    if (!generatedVideo && !generatedImage) return;
    
    const urlToDownload = generatedVideo || generatedImage;
    const isVideo = !!generatedVideo;
    
    try {
      const response = await fetch(urlToDownload);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      if (isVideo) {
        link.download = `climate-solution-video-${selectedEffect}-${Date.now()}.mp4`;
        addNotification("success", "Video downloaded successfully!");
      } else {
        link.download = `climate-image-${selectedEffect}-${Date.now()}.png`;
        addNotification("success", "Image downloaded successfully!");
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      addNotification("error", `Failed to download ${isVideo ? 'video' : 'image'}`);
    }
  };

  const handleShare = async () => {
    const urlToShare = generatedVideo || generatedImage;
    const isVideo = !!generatedVideo;
    
    if (!urlToShare) return;
    
    if (navigator.share) {
      try {
        const response = await fetch(urlToShare);
        const blob = await response.blob();
        const fileName = isVideo 
          ? `climate-solution-video-${selectedEffect}.mp4`
          : `climate-effect-${selectedEffect}.png`;
        const mimeType = isVideo ? 'video/mp4' : 'image/png';
        
        const file = new File([blob], fileName, { type: mimeType });
        
        await navigator.share({
          title: 'Climate Impact Visualization',
          text: `Check out this climate ${isVideo ? 'solution video' : 'impact visualization'} created with ClimateVision AI`,
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

  // Determine which content to show as backdrop - prioritize video over image
  const backdropContent = generatedVideo || generatedImage || selectedImage;
  const showVideo = !backdropContent;
  const showGeneratedVideo = !!generatedVideo;

  console.log('VideoHero render state:', {
    generatedVideo: !!generatedVideo,
    generatedImage: !!generatedImage,
    selectedImage: !!selectedImage,
    showGeneratedVideo,
    backdropContent: !!backdropContent
  });

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full">
        {showVideo ? (
          // Show image when no content is uploaded
          <img 
            src="https://cdn.midjourney.com/806004e4-90e4-45a3-8d71-c7308c9ab2a8/0_1.png"
            alt="Climate visualization background"
            className="w-full h-full object-cover"
            style={{ 
              filter: 'none',
              imageRendering: 'crisp-edges',
              objectFit: 'cover',
              transform: 'scale(0.8)',
              transformOrigin: 'center center'
            }}
          />
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
            onLoadStart={() => console.log('Video loading started:', generatedVideo)}
            onLoadedData={() => console.log('Video loaded successfully:', generatedVideo)}
            onError={(e) => console.error('Video error:', e, 'URL:', generatedVideo)}
            onCanPlay={() => console.log('Video can play')}
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
            ) : showGeneratedVideo ? (
              <div className="glass-card p-6 animate-slide-up">
                <div className="space-y-4 text-center">
                  <p className="text-white/90 text-lg font-medium">
                    Climate solution video complete! Watch how {selectedEffect} resolves the climate issue.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      onClick={handleDownload}
                      variant="outline"
                      className="glass-button"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Video
                    </Button>
                    <Button 
                      onClick={handleShare}
                      variant="outline"
                      className="glass-button"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share Video
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