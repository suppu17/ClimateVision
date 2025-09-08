import { fal } from "@fal-ai/client";

// Configure FAL AI client
fal.config({
  credentials: "AIzaSyCJsiyPgaI6V3EQpn35ipRAcjno1eSpGxY"
});

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
    try {
      const result = await fal.subscribe("fal-ai/veo3/fast/image-to-video", {
        input: {
          prompt: params.prompt,
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
      throw new Error("Failed to generate video. Please try again.");
    }
  }

  // Helper method to create climate-specific animation prompts
  createClimatePrompt(effectType: string): string {
    const prompts = {
      wildfire: "The landscape transforms as flames begin to spread across the terrain, smoke rises, and the sky turns orange with fire effects",
      flooding: "Water slowly rises across the landscape, waves crash, and the area becomes submerged with realistic water physics",
      drought: "The landscape dries out, vegetation withers, cracks appear in the ground, and the atmosphere becomes dusty and arid",
      earthquake: "The ground shakes and trembles, structures sway, dust particles rise, showing the devastating effects of seismic activity",
      "air-pollution": "Smog and pollution particles fill the air, visibility decreases, and the atmosphere becomes hazy and contaminated",
      "extreme-weather": "Intense weather patterns emerge with strong winds, dramatic clouds, and severe atmospheric conditions",
      "sea-level-rise": "Ocean waters gradually rise, coastal areas flood, and waves crash over previously dry land",
      deforestation: "Trees fall, forest cover disappears, and the landscape transforms from lush green to barren ground",
      desertification: "Fertile land transforms into desert, sand dunes form, and vegetation disappears in the expanding arid landscape"
    };

    return prompts[effectType as keyof typeof prompts] || 
           "The landscape undergoes dramatic climate change effects with natural environmental transformations";
  }
}

export const falAiService = new FalAiService();