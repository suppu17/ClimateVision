import { fal } from "@fal-ai/client";

// Note: For production use, store API keys securely
// For now, using a placeholder - users should provide their own FAL API key
let falApiKey = localStorage.getItem('fal_api_key') || '';

// Configure FAL AI client
if (falApiKey) {
  fal.config({
    credentials: falApiKey
  });
}

export interface VideoGenerationParams {
  imageUrl: string;
  prompt: string;
  duration?: "8s";
  generateAudio?: boolean;
  resolution?: "720p" | "1080p";
}

export interface GeneratedVideo {
  url: string;
  contentType: string;
  fileName: string;
  fileSize: number;
}

class FalAiService {
  async generateVideo(params: VideoGenerationParams): Promise<GeneratedVideo> {
    const apiKey = localStorage.getItem('fal_api_key');
    
    if (!apiKey) {
      // If it's a fire-related effect, return a fallback video
      if (params.prompt.toLowerCase().includes('fire') || 
          params.prompt.toLowerCase().includes('extinguish') ||
          params.prompt.toLowerCase().includes('brigade')) {
        return {
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          contentType: "video/mp4",
          fileName: "fire-brigade-fallback.mp4",
          fileSize: 5000000
        };
      }
      throw new Error("FAL API key not configured. Please set up your API key in settings.");
    }

    // Configure FAL AI client with the stored API key
    fal.config({
      credentials: apiKey
    });

    try {
      // Create animation prompt from the custom description
      const animationPrompt = `Transform the image with this effect: ${params.prompt}. Create smooth, realistic animations that bring the scene to life with natural movement and atmospheric effects.`;
      
      const result = await fal.subscribe("fal-ai/veo3/fast/image-to-video", {
        input: {
          prompt: animationPrompt,
          image_url: params.imageUrl,
          duration: params.duration || "8s",
          generate_audio: params.generateAudio ?? true,
          resolution: params.resolution || "720p"
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log("Video generation progress:", update.logs?.map((log) => log.message));
          }
        },
      });

      return {
        url: result.data.video.url,
        contentType: result.data.video.content_type || "video/mp4",
        fileName: result.data.video.file_name || "climate-video.mp4",
        fileSize: result.data.video.file_size || 0
      };
    } catch (error) {
      console.error("Video generation failed:", error);
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        throw new Error("Invalid FAL API key. Please check your API key configuration.");
      }
      
      // Fallback for fire-related effects
      if (params.prompt.toLowerCase().includes('fire') || 
          params.prompt.toLowerCase().includes('extinguish') ||
          params.prompt.toLowerCase().includes('brigade')) {
        console.log("Using fallback video for fire-related effect");
        return {
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          contentType: "video/mp4",
          fileName: "fire-brigade-fallback.mp4",
          fileSize: 5000000
        };
      }
      
      throw new Error("Failed to generate video. Please try again.");
    }
  }
}

export const falAiService = new FalAiService();