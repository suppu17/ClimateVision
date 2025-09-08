import ImageUpload from "./ImageUpload";
import EffectSelector from "./EffectSelector";
import { Download, Share, RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  
  const handleDownload = async () => {
    const contentToDownload = generatedVideo || generatedImage;
    if (!contentToDownload) return;
    
    try {
      const response = await fetch(contentToDownload);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileExtension = generatedVideo ? 'mp4' : 'png';
      const fileType = generatedVideo ? 'video' : 'image';
      link.download = `climate-${fileType}-${selectedEffect}-${Date.now()}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`${fileType} downloaded successfully!`);
    } catch (error) {
      toast.error(`Failed to download ${generatedVideo ? 'video' : 'image'}`);
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
        toast.success("Shared successfully!");
      } catch (error) {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
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
            >
              <source src="https://cdn.midjourney.com/video/7819b5ec-35f8-413c-beb9-4fa5b926074a/0.mp4" type="video/mp4" />
            </video>
          </>
        ) : (
          // Show uploaded or generated content as backdrop
          <>
            {generatedVideo ? (
              <video 
                src={generatedVideo} 
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-all duration-1000"
              />
            ) : (
              <img 
                src={backdropContent} 
                alt="Climate visualization backdrop" 
                className="w-full h-full object-cover transition-all duration-1000"
              />
            )}
          </>
        )}
      </div>

      {/* Fixed Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Top Section - Title (only when no image uploaded) */}
        {!selectedImage && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto px-6">
              <div className="glass-card p-8 md:p-12 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-6">
                  Start Your Climate Journey
                </h2>
              </div>
            </div>
          </div>
        )}


        {/* Bottom Section - Upload, Effects, or Results */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="max-w-4xl mx-auto">
            {!selectedImage ? (
              <div className="glass-card p-6 animate-slide-up">
                <div className="max-w-lg mx-auto">
                  <ImageUpload 
                    onImageSelect={onImageSelect}
                    selectedImage={selectedImage}
                    onClearImage={onClearImage}
                  />
                </div>
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
            ) : (generatedImage || generatedVideo) ? (
              <div className="glass-card p-6 animate-slide-up">
                <div className="space-y-4 text-center">
                  <p className="text-white/90 text-lg font-medium">
                    {generatedVideo ? "Climate video complete!" : "Climate effect visualization complete!"} 
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      onClick={handleDownload}
                      variant="outline"
                      className="glass-button"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download {generatedVideo ? "Video" : "Image"}
                    </Button>
                    <Button 
                      onClick={handleShare}
                      variant="outline"
                      className="glass-button"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    {generatedImage && !generatedVideo && (
                      <Button 
                        onClick={onGenerateVideo}
                        disabled={isGeneratingVideo}
                        className="bg-gradient-nature text-primary-foreground hover:opacity-90"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {isGeneratingVideo ? "Generating Video..." : "Generate Video"}
                      </Button>
                    )}
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
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoHero;