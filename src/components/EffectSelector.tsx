import { useState } from "react";
import { Bot, Wand2, Flame, TreePine, Droplets, Wind, Mountain, Zap, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EffectSelectorProps {
  selectedEffect: string | null;
  onEffectSelect: (effectId: string, category: "effects" | "improvements") => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  minimal?: boolean;
}

const EffectSelector = ({ selectedEffect, onEffectSelect, onGenerate, isGenerating, minimal = false }: EffectSelectorProps) => {
  const [activeTab, setActiveTab] = useState<"effects" | "improvements">("effects");
  const [customEffect, setCustomEffect] = useState("");
  const [customSolution, setCustomSolution] = useState("");
  const [elaborateInput, setElaborateInput] = useState("");
  
  // Quick effect suggestions with text labels
  const effectSuggestions = [
    { label: "Fire", effect: "Wildfire spreading across the landscape" },
    { label: "Dust/Smoke", effect: "Severe air pollution with dust and smoke" },
    { label: "Flood", effect: "Severe flooding and water damage" },
    { label: "Earthquake", effect: "Earthquake damage and ground cracks" },
    { label: "Extreme weather", effect: "Extreme storm and weather conditions" }
  ];

  const solutionSuggestions = [
    "Plant trees",
    "EV", 
    "Renewable energy",
    "Extinguisher",
    "Water conservation"
  ];

  const handleQuickSelect = (suggestion: string | { effect: string }) => {
    const effectText = typeof suggestion === 'string' ? suggestion : suggestion.effect;
    let finalPrompt = effectText;
    
    // Add elaborate input if provided
    if (elaborateInput.trim()) {
      finalPrompt += `. Additional details: ${elaborateInput.trim()}`;
    }
    
    if (activeTab === "effects") {
      setCustomEffect(finalPrompt);
      onEffectSelect(finalPrompt, "effects");
    } else {
      setCustomSolution(finalPrompt);
      onEffectSelect(finalPrompt, "improvements");
    }
  };

  const handleCustomInput = (value: string) => {
    if (activeTab === "effects") {
      setCustomEffect(value);
      if (value.trim()) {
        onEffectSelect(value.trim(), "effects");
      }
    } else {
      setCustomSolution(value);
      if (value.trim()) {
        onEffectSelect(value.trim(), "improvements");
      }
    }
  };

  if (minimal) {
    return (
      <div className="space-y-4">
        {/* Tab Selector */}
        <div className="flex p-1 bg-background/20 backdrop-blur-sm rounded-full border border-white/20">
          <button
            onClick={() => setActiveTab("effects")}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium rounded-full transition-all",
              activeTab === "effects"
                ? "bg-red-500/80 text-white shadow-sm"
                : "text-white/70 hover:text-white"
            )}
          >
            <Flame className="h-4 w-4 inline mr-2" />
            Climate Effects
          </button>
          <button
            onClick={() => setActiveTab("improvements")}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium rounded-full transition-all",
              activeTab === "improvements"
                ? "bg-green-500/80 text-white shadow-sm"
                : "text-white/70 hover:text-white"
            )}
          >
            <TreePine className="h-4 w-4 inline mr-2" />
            Solutions
          </button>
        </div>

        {/* Elaborate Input */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="elaborate-input" className="text-white/90 text-sm">
            Elaborate Input (Optional)
          </Label>
          <Textarea
            id="elaborate-input"
            placeholder={
              activeTab === "effects" 
                ? "Describe additional details about how you want to recreate this climate issue scenario..."
                : "Describe how you want to address this issue with your chosen solution..."
            }
            value={elaborateInput}
            onChange={(e) => setElaborateInput(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
            rows={3}
          />
        </div>

        {/* Effect/Solution Options */}
        <div className="grid grid-cols-5 gap-3">
          {activeTab === "effects" ? (
            effectSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSelect(suggestion)}
                className={cn(
                  "p-3 rounded-lg border text-sm transition-all text-center",
                  selectedEffect === suggestion.effect
                    ? "bg-red-500/80 border-red-400/50 text-white shadow-lg"
                    : "bg-white/5 hover:bg-white/10 border-white/10 text-white/80"
                )}
              >
                {suggestion.label}
              </button>
            ))
          ) : (
            solutionSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSelect(suggestion)}
                className={cn(
                  "p-3 rounded-lg border text-sm transition-all text-center",
                  selectedEffect === suggestion
                    ? "bg-green-500/80 border-green-400/50 text-white shadow-lg"
                    : "bg-white/5 hover:bg-white/10 border-white/10 text-white/80"
                )}
              >
                {suggestion}
              </button>
            ))
          )}
        </div>

        {/* Generate Button */}
        <div className="min-h-[56px] flex items-center justify-center">
          <Button
            onClick={onGenerate}
            disabled={isGenerating || !selectedEffect}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 disabled:opacity-50 px-8 py-3 rounded-full font-medium transition-all w-full"
          >
            <Bot className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating Climate Impact..." : "Generate Climate Impact"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Create Custom Climate Effect</h2>
        <p className="text-muted-foreground">
          Describe exactly what you want to visualize - be as specific as possible
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "effects" | "improvements")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 glass mb-6">
          <TabsTrigger 
            value="effects" 
            className="data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive"
          >
            <Flame className="h-4 w-4 mr-2" />
            Climate Effects
          </TabsTrigger>
          <TabsTrigger 
            value="improvements"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <TreePine className="h-4 w-4 mr-2" />
            Solutions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="effects" className="space-y-4">
          {/* Elaborate Input for Effects */}
          <div className="space-y-2">
            <Label htmlFor="elaborate-input-effects" className="text-sm font-medium">
              Elaborate Input (Optional)
            </Label>
            <Textarea
              id="elaborate-input-effects"
              placeholder="Describe additional details about how you want to recreate this climate issue scenario..."
              value={elaborateInput}
              onChange={(e) => setElaborateInput(e.target.value)}
              className="min-h-[80px] resize-none"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-5 gap-4">
            {effectSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSelect(suggestion)}
                className={cn(
                  "p-4 rounded-lg border transition-all text-center",
                  selectedEffect === suggestion.effect
                    ? "bg-destructive/20 border-destructive/50 text-destructive shadow-lg"
                    : "glass-card hover:bg-muted/50 border-transparent"
                )}
              >
                <span className="text-sm font-medium">{suggestion.label}</span>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-4">
          {/* Elaborate Input for Solutions */}
          <div className="space-y-2">
            <Label htmlFor="elaborate-input-solutions" className="text-sm font-medium">
              Elaborate Input (Optional)
            </Label>
            <Textarea
              id="elaborate-input-solutions"
              placeholder="Describe how you want to address this issue with your chosen solution..."
              value={elaborateInput}
              onChange={(e) => setElaborateInput(e.target.value)}
              className="min-h-[80px] resize-none"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-5 gap-4">
            {solutionSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSelect(suggestion)}
                className={cn(
                  "p-4 rounded-lg border transition-all text-center",
                  selectedEffect === suggestion
                    ? "bg-primary/20 border-primary/50 text-primary shadow-lg"
                    : "glass-card hover:bg-muted/50 border-transparent"
                )}
              >
                <span className="text-sm font-medium">{suggestion}</span>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 pt-6 border-t border-glass-border">
        <Button 
          onClick={onGenerate}
          disabled={isGenerating || !selectedEffect}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          size="lg"
        >
          <Bot className="h-4 w-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Climate Impact"}
        </Button>
      </div>
    </div>
  );
};

export default EffectSelector;