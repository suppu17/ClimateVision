import { GoogleGenAI } from "@google/genai";

export class GeminiClimateService {
  private ai: GoogleGenAI;
  private apiKey: string = "AIzaSyCJsiyPgaI6V3EQpn35ipRAcjno1eSpGxY";

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async generateClimateEffect(
    imageFile: File,
    customPrompt: string
  ): Promise<{ imageData: string; description: string }> {

    if (!customPrompt?.trim()) {
      throw new Error("Please provide a description of the effect you want to create");
    }

    try {
      // Convert file to base64
      const imageData = await this.fileToBase64(imageFile);
      
      const fullPrompt = [
        { 
          text: `Transform this image based on the following description: ${customPrompt}. 

Maintain photorealistic quality and ensure the transformation looks natural and believable. The result should be educational and impactful for climate literacy. Pay attention to details like lighting, atmosphere, and environmental elements to make the scene convincing and dramatic.`
        },
        {
          inlineData: {
            mimeType: imageFile.type,
            data: imageData,
          },
        },
      ];

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: fullPrompt,
      });

      // Extract generated image from response
      const candidates = response.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error("No candidates returned from Gemini API");
      }

      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          return {
            imageData: part.inlineData.data,
            description: customPrompt
          };
        }
      }

      throw new Error("No image data found in response");
    } catch (error) {
      console.error("Gemini API error:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate climate effect: ${error.message}`);
      }
      throw new Error("Failed to generate climate effect");
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Remove data:image/...;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  getEffectDescription(customPrompt: string): string {
    return customPrompt || "Custom climate effect";
  }

  isConfigured(): boolean {
    return true;
  }
}

// Singleton instance
export const geminiService = new GeminiClimateService();