import { useState } from "react";
import { Key, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  isConfigured: boolean;
}

const ApiKeyInput = ({ onApiKeySet, isConfigured }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast.error("Please enter your Gemini API key");
      return;
    }

    setIsLoading(true);
    
    try {
      onApiKeySet(apiKey.trim());
      toast.success("API key configured successfully!");
      setApiKey("");
    } catch (error) {
      toast.error("Failed to configure API key");
    } finally {
      setIsLoading(false);
    }
  };

  if (isConfigured) {
    return (
      <div className="glass-card p-6 max-w-2xl mx-auto animate-fade-in">
        <div className="flex items-center gap-3 text-primary">
          <Key className="h-5 w-5" />
          <span className="font-semibold">Gemini API Connected</span>
        </div>
        <p className="text-muted-foreground mt-2">
          Your API key is configured and ready for climate visualizations.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Key className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Configure Gemini API</h2>
        </div>
        <p className="text-muted-foreground">
          To generate climate visualizations, please provide your Gemini API key. 
          Get yours at{" "}
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google AI Studio
          </a>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type={showKey ? "text" : "password"}
            placeholder="Enter your Gemini API key (AIzaSy...)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="pr-10 bg-background/50 border-glass-border"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-nature text-primary-foreground hover:opacity-90"
          disabled={isLoading || !apiKey.trim()}
        >
          {isLoading ? "Configuring..." : "Configure API Key"}
        </Button>
      </form>

      <div className="mt-4 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
        <p className="font-semibold mb-2">Your API key is secure:</p>
        <ul className="space-y-1 text-xs">
          <li>• Stored locally in your browser only</li>
          <li>• Never sent to our servers</li>
          <li>• Used only for direct Gemini API calls</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiKeyInput;