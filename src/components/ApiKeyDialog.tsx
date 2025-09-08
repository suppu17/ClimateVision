import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiKeyDialog = ({ open, onOpenChange }: ApiKeyDialogProps) => {
  const { toast } = useToast();
  const [falApiKey, setFalApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load existing API key from localStorage
    const existingKey = localStorage.getItem('fal_api_key');
    if (existingKey) {
      setFalApiKey(existingKey);
    }
  }, [open]);

  const handleSave = async () => {
    if (!falApiKey.trim()) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid FAL API key.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Store API key in localStorage
      localStorage.setItem('fal_api_key', falApiKey.trim());
      
      // Reload the page to apply new credentials
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      toast({
        title: "API Key Saved",
        description: "Your FAL API key has been saved. Reloading to apply changes...",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <div className="flex items-center gap-2 text-blue-400">
            <Key className="h-5 w-5" />
            <DialogTitle className="text-xl font-bold text-white">
              FAL API Configuration
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            Enter your FAL API key to enable video generation features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="falApiKey" className="text-white">
              FAL API Key
            </Label>
            <Input
              id="falApiKey"
              type="password"
              placeholder="Enter your FAL API key"
              value={falApiKey}
              onChange={(e) => setFalApiKey(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
            <h4 className="text-blue-200 font-semibold mb-2 flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              How to get your FAL API Key:
            </h4>
            <ol className="text-blue-200 text-sm space-y-1 list-decimal list-inside">
              <li>Visit <a href="https://fal.ai/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">fal.ai/dashboard</a></li>
              <li>Create an account or sign in</li>
              <li>Navigate to API Keys section</li>
              <li>Generate a new API key</li>
              <li>Copy and paste it here</li>
            </ol>
          </div>

          <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-3">
            <p className="text-amber-200 text-sm">
              <strong>Note:</strong> Your API key is stored locally in your browser and is not shared with anyone. 
              For production use, consider using environment variables.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-slate-600 text-white hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Saving..." : "Save API Key"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;