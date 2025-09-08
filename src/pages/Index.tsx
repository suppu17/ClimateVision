import { useState } from "react";
import Header from "@/components/Header";
import VideoHero from "@/components/VideoHero";
import { geminiService } from "@/services/geminiService";
import { falAiService } from "@/services/falAiService";
import { NotificationProvider, useNotifications } from "@/contexts/NotificationContext";

const IndexContent = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [effectCategory, setEffectCategory] = useState<"effects" | "improvements" | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  const { addNotification } = useNotifications();

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
    addNotification("success", "Image uploaded successfully! Now choose a climate effect.");
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setSelectedEffect(null);
    setEffectCategory(null);
    setGeneratedImage(null);
    addNotification("info", "Image cleared. Upload a new one to continue.");
  };

  const handleEffectSelect = (effectId: string, category: "effects" | "improvements") => {
    setSelectedEffect(effectId);
    setEffectCategory(category);
    addNotification("success", `Selected ${effectId} effect. Ready to generate!`);
  };

  const handleGenerate = async () => {
    if (!selectedFile || !selectedEffect) {
      addNotification("error", "Please upload an image and describe an effect first.");
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
      addNotification("success", "Climate impact visualization generated!");
    } catch (error) {
      console.error("Generation error:", error);
      if (error instanceof Error) {
        addNotification("error", error.message);
      } else {
        addNotification("error", "Failed to generate climate visualization. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!generatedImage || !selectedEffect) {
      addNotification("error", "Please generate an image first.");
      return;
    }

    setIsGeneratingVideo(true);
    
    try {
      // Convert blob to base64 for the API
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const result = await falAiService.generateVideo({
        imageUrl: base64,
        prompt: selectedEffect,
        duration: "8s",
        generateAudio: true,
        resolution: "720p"
      });
      
      setGeneratedVideo(result.url);
      addNotification("success", "Climate video generated successfully!");
    } catch (error) {
      console.error("Video generation error:", error);
      if (error instanceof Error) {
        addNotification("error", error.message);
      } else {
        addNotification("error", "Failed to generate climate video. Please try again.");
      }
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setGeneratedVideo(null);
    setSelectedEffect(null);
    setEffectCategory(null);
    addNotification("info", "Ready for another climate effect!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Fixed Hero Layout - All Interactions Happen Here */}
      <VideoHero 
        selectedImage={selectedImage}
        generatedImage={generatedImage}
        generatedVideo={generatedVideo}
        selectedEffect={selectedEffect}
        effectCategory={effectCategory}
        isGenerating={isGenerating}
        isGeneratingVideo={isGeneratingVideo}
        onImageSelect={handleImageSelect}
        onClearImage={handleClearImage}
        onEffectSelect={handleEffectSelect}
        onGenerate={handleGenerate}
        onGenerateVideo={handleGenerateVideo}
        onReset={handleReset}
      />
      
      {/* ElevenLabs Conversational AI Widget */}
      <div dangerouslySetInnerHTML={{ 
        __html: '<elevenlabs-convai agent-id="agent_8001k4kpmyb7ey0t538czxz4z1jc"></elevenlabs-convai>' 
      }} />
    </div>
  );
};

const Index = () => {
  return (
    <NotificationProvider>
      <IndexContent />
    </NotificationProvider>
  );
};

export default Index;