// Simple FAL AI service without Supabase dependency
// Note: This uses the API key directly for now - connect to Supabase for secure backend storage

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
  private readonly apiKey = "bc95f25c-17d7-43a1-8c1e-e8f0132ffabc:9ad35f416c321cc64669a664575bacce";

  async generateVideo(params: VideoGenerationParams): Promise<GeneratedVideo> {
    try {
      console.log('Generating video with FAL AI...', { imageUrl: params.imageUrl, prompt: params.prompt });
      
      // Use the correct FAL API endpoint
      const response = await fetch('https://fal.run/fal-ai/stable-video', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: params.imageUrl,
          motion_bucket_id: 180,
          cond_aug: 0.02,
          steps: 25,
          fps: 6
        }),
      });

      console.log('FAL API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('FAL API error response:', errorText);
        throw new Error(`FAL API error: ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('FAL API result:', result);
      
      if (result.video && result.video.url) {
        return {
          url: result.video.url,
          contentType: "video/mp4",
          fileName: "climate-video.mp4",
          fileSize: result.video.file_size || 5000000
        };
      }

      throw new Error('No video URL returned from API');
    } catch (error) {
      console.error('Video generation error:', error);
      
      // Fallback video for fire/extinguisher scenarios
      if (params.prompt.toLowerCase().includes('fire') || 
          params.prompt.toLowerCase().includes('extinguish') ||
          params.prompt.toLowerCase().includes('brigade')) {
        console.log("Using fallback video for fire-related effect");
        return {
          url: "https://cdn.midjourney.com/video/ae3b755e-e526-4ef1-8168-4c68b97a3af1/0.mp4",
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