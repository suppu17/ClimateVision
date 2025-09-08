import { Download, Share, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ResultComparisonProps {
  originalImage: string;
  generatedImage: string;
  effectName: string;
  onReset: () => void;
}

const ResultComparison = ({ originalImage, generatedImage, effectName, onReset }: ResultComparisonProps) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `climate-effect-${effectName}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], `climate-effect-${effectName}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'Climate Impact Visualization',
          text: `Check out this climate impact visualization created with ClimateVision AI`,
          files: [file]
        });
        toast.success("Shared successfully!");
      } catch (error) {
        // Fallback to copying link
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <section className="animate-fade-in">
      <div className="max-w-6xl mx-auto glass-card p-8">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            Climate Impact Visualization
          </h3>
          <p className="text-muted-foreground">
            See how <span className="text-primary font-semibold">{effectName}</span> transforms the natural landscape
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Original Image */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-foreground text-center">Original</h4>
            <div className="relative group">
              <img 
                src={originalImage} 
                alt="Original landscape" 
                className="w-full aspect-video object-cover rounded-2xl shadow-lg transition-transform hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-sm font-medium">Natural State</span>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Image */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-foreground text-center">Climate Effect</h4>
            <div className="relative group">
              <img 
                src={generatedImage} 
                alt="Climate effect visualization" 
                className="w-full aspect-video object-cover rounded-2xl shadow-lg transition-transform hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-sm font-medium capitalize">{effectName} Impact</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="glass-button"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Result
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

        {/* Educational Information */}
        <div className="mt-8 p-6 bg-muted/20 rounded-2xl">
          <h5 className="font-semibold text-foreground mb-3">Understanding Climate Impact</h5>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This AI-generated visualization helps illustrate potential climate scenarios. 
            While these are computer-generated representations, they're based on scientific understanding 
            of how various climate factors affect natural ecosystems. Use these visualizations to better 
            understand environmental challenges and the importance of sustainable practices.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResultComparison;