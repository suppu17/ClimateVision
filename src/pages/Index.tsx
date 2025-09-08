import { useState } from "react";
import Header from "@/components/Header";
import VideoHero from "@/components/VideoHero";
import ImageUpload from "@/components/ImageUpload";
import EffectSelector from "@/components/EffectSelector";
import ApiKeyInput from "@/components/ApiKeyInput";
import ResultComparison from "@/components/ResultComparison";
import { geminiService } from "@/services/geminiService";
import { toast } from "sonner";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [effectCategory, setEffectCategory] = useState<"effects" | "improvements" | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [isApiConfigured, setIsApiConfigured] = useState(geminiService.isConfigured());

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
    toast.success("Image uploaded successfully! Now choose a climate effect.");
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setSelectedEffect(null);
    setEffectCategory(null);
    setGeneratedImage(null);
    toast.info("Image cleared. Upload a new one to continue.");
  };

  const handleEffectSelect = (effectId: string, category: "effects" | "improvements") => {
    setSelectedEffect(effectId);
    setEffectCategory(category);
    toast.success(`Selected ${effectId} effect. Ready to generate!`);
  };

  const handleApiKeySet = (apiKey: string) => {
    geminiService.setApiKey(apiKey);
    setIsApiConfigured(true);
  };

  const handleGenerate = async () => {
    if (!selectedFile || !selectedEffect) {
      toast.error("Please upload an image and select an effect first.");
      return;
    }

    if (!isApiConfigured) {
      toast.error("Please configure your Gemini API key first.");
      return;
    }

    setIsGenerating(true);
    
    try {
      const result = await geminiService.generateClimateEffect(
        selectedFile,
        selectedEffect
      );
      
      // Convert base64 to blob URL for display
      const binaryString = atob(result.imageData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'image/png' });
      const generatedUrl = URL.createObjectURL(blob);
      
      setGeneratedImage(generatedUrl);
      toast.success("Climate impact visualization generated!");
    } catch (error) {
      console.error("Generation error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to generate climate visualization. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setSelectedEffect(null);
    setEffectCategory(null);
    toast.info("Ready for another climate effect!");
  };

  const scrollToUpload = () => {
    setShowUploadSection(true);
    setTimeout(() => {
      document.getElementById('upload-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div onClick={scrollToUpload} className="cursor-pointer">
        <VideoHero />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 space-y-12">
        {/* API Key Configuration */}
        {!isApiConfigured && (
          <section className="animate-fade-in">
            <ApiKeyInput 
              onApiKeySet={handleApiKeySet}
              isConfigured={isApiConfigured}
            />
          </section>
        )}

        {/* Upload Section */}
        {isApiConfigured && (
          <section id="upload-section" className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Start Your Climate Journey
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upload an image of nature and explore how climate change impacts our environment, 
                or discover solutions that can make a difference.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <ImageUpload 
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onClearImage={handleClearImage}
              />
            </div>
          </section>
        )}

        {/* Effect Selection */}
        {selectedImage && isApiConfigured && (
          <section className="animate-slide-up">
            <div className="max-w-4xl mx-auto">
              <EffectSelector
                selectedEffect={selectedEffect}
                onEffectSelect={handleEffectSelect}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>
          </section>
        )}

        {/* Results Section */}
        {generatedImage && (
          <ResultComparison
            originalImage={selectedImage!}
            generatedImage={generatedImage}
            effectName={selectedEffect!}
            onReset={handleReset}
          />
        )}

        {/* Info Section */}
        <section className="text-center glass-card p-8 max-w-4xl mx-auto animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Learn Through Visualization
          </h2>
          <p className="text-muted-foreground mb-6">
            ClimateVision uses advanced AI to help you understand the impact of climate change 
            and explore sustainable solutions. Every image tells a story about our planet's future.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="glass-card p-4">
              <h3 className="font-semibold text-primary mb-2">Climate Effects</h3>
              <p className="text-muted-foreground">See how wildfires, pollution, and extreme weather affect nature</p>
            </div>
            <div className="glass-card p-4">
              <h3 className="font-semibold text-primary mb-2">Solutions</h3>
              <p className="text-muted-foreground">Explore renewable energy, reforestation, and conservation</p>
            </div>
            <div className="glass-card p-4">
              <h3 className="font-semibold text-primary mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">Advanced image generation for realistic climate scenarios</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;