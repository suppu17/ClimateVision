import { GoogleGenAI } from "@google/genai";

interface ClimateEffect {
  id: string;
  prompt: string;
}

const CLIMATE_EFFECTS: Record<string, ClimateEffect> = {
  wildfire: {
    id: "wildfire",
    prompt: "Transform this natural landscape to show the devastating effects of wildfires. Add realistic smoke, orange glowing flames in the distance, charred trees, and ash-covered ground. The sky should be filled with thick smoke creating an apocalyptic orange-red atmosphere."
  },
  pollution: {
    id: "pollution",
    prompt: "Show this natural environment affected by severe air pollution. Add thick smog and hazy atmosphere that obscures the landscape. The sky should be gray and murky, with reduced visibility and a sickly yellow-brown tint to the air."
  },
  flooding: {
    id: "flooding",
    prompt: "Transform this landscape to show severe flooding effects. Raise water levels significantly, show partially submerged vegetation, muddy brown water, debris floating, and the aftermath of flood damage to the natural environment."
  },
  earthquake: {
    id: "earthquake",
    prompt: "Show this natural landscape after a major earthquake. Add visible ground cracks, tilted or fallen trees, disrupted terrain, landslides, and geological damage while maintaining the natural setting."
  },
  "extreme-weather": {
    id: "extreme-weather",
    prompt: "Transform this scene to show extreme weather conditions. Add dramatic storm clouds, heavy rain or snow, strong wind effects on vegetation, and the harsh impact of severe weather on the natural landscape."
  },
  reforestation: {
    id: "reforestation",
    prompt: "Transform this landscape to show successful reforestation and ecological restoration. Add lush, healthy forests with diverse vegetation, thriving wildlife habitats, clear streams, and vibrant green growth throughout the scene."
  },
  "electric-transport": {
    id: "electric-transport",
    prompt: "Enhance this natural landscape by adding sustainable transportation infrastructure. Include electric vehicle charging stations powered by renewable energy, bike paths that blend with nature, and clean transport solutions that don't harm the environment."
  },
  "solar-energy": {
    id: "solar-energy",
    prompt: "Integrate renewable solar energy infrastructure into this natural landscape. Add aesthetically pleasing solar panels that complement the environment, solar farms in the distance, and show how clean energy can coexist with nature."
  },
  "wind-power": {
    id: "wind-power",
    prompt: "Add wind energy infrastructure to this natural landscape. Include elegant wind turbines positioned thoughtfully in the scene, showing how renewable wind power can be integrated harmoniously with the natural environment."
  },
  "water-conservation": {
    id: "water-conservation",
    prompt: "Transform this landscape to showcase water conservation and sustainable water management. Add rainwater collection systems, restored wetlands, efficient irrigation, and natural water preservation methods that enhance the ecosystem."
  }
};

export class GeminiClimateService {
  private ai: GoogleGenAI | null = null;
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.setApiKey(apiKey);
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateClimateEffect(
    imageFile: File,
    effectId: string,
    customPrompt?: string
  ): Promise<{ imageData: string; description: string }> {
    if (!this.ai || !this.apiKey) {
      throw new Error("Gemini API key not configured. Please provide your API key.");
    }

    const effect = CLIMATE_EFFECTS[effectId];
    if (!effect && !customPrompt) {
      throw new Error(`Unknown effect: ${effectId}`);
    }

    try {
      // Convert file to base64
      const imageData = await this.fileToBase64(imageFile);
      
      const prompt = customPrompt || effect.prompt;
      const fullPrompt = [
        { 
          text: `${prompt} Maintain photorealistic quality and ensure the transformation looks natural and believable. The result should be educational and impactful for climate literacy.`
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
            description: effect?.id || "climate-effect"
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

  getEffectDescription(effectId: string): string {
    const effect = CLIMATE_EFFECTS[effectId];
    return effect ? effect.prompt : "Custom climate effect";
  }

  isConfigured(): boolean {
    return this.ai !== null && this.apiKey !== null;
  }
}

// Singleton instance
export const geminiService = new GeminiClimateService();