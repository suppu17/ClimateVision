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
  
  // Quick effect suggestions with elemental icons
  const effectSuggestions = [
    { icon: Flame, label: "Fire", effect: "Wildfire spreading across the landscape" },
    { icon: Droplets, label: "Water", effect: "Severe flooding and water damage" },
    { icon: Wind, label: "Air", effect: "Air pollution and smog" },
    { icon: Mountain, label: "Earth", effect: "Earthquake damage and ground cracks" },
    { icon: Zap, label: "Space", effect: "Extreme storm and weather" }
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
    if (activeTab === "effects") {
      setCustomEffect(effectText);
      onEffectSelect(effectText, "effects");
    } else {
      setCustomSolution(effectText);
      onEffectSelect(effectText, "improvements");
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

        {/* Custom Input */}
        <div className="space-y-3">
          <Textarea
            placeholder={activeTab === "effects" ? "e.g., Wildfire spreading through forest with smoke and flames..." : "e.g., Fire brigade with trucks and water hoses extinguishing forest fires..."}
            value={activeTab === "effects" ? customEffect : customSolution}
            onChange={(e) => handleCustomInput(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[80px]"
          />
        </div>

        {/* Quick Suggestions */}
        <div className="space-y-2">
          <Label className="text-white/80 text-xs">Quick suggestions:</Label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {activeTab === "effects" ? (
              effectSuggestions.map((suggestion, index) => {
                const IconComponent = suggestion.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickSelect(suggestion)}
                    className="flex-shrink-0 flex flex-col items-center gap-1 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs transition-all"
                  >
                    <IconComponent className="h-6 w-6" />
                    <span>{suggestion.label}</span>
                  </button>
                );
              })
            ) : (
              solutionSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSelect(suggestion)}
                  className="flex-shrink-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs transition-all whitespace-nowrap"
                >
                  {suggestion}
                </button>
              ))
            )}
          </div>
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
          <div className="space-y-4">
            <div>
              <Textarea
                id="effect-input"
                placeholder="e.g., Massive wildfire spreading through a dense forest with thick black smoke, orange flames, and ash falling from the sky..."
                value={customEffect}
                onChange={(e) => handleCustomInput(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label className="text-muted-foreground text-sm mb-2 block">Quick suggestions:</Label>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {effectSuggestions.map((suggestion, index) => {
                  const IconComponent = suggestion.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickSelect(suggestion)}
                      className="flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-lg glass-card hover:bg-muted/50 transition-all"
                    >
                      <IconComponent className="h-8 w-8 text-primary" />
                      <span className="text-sm font-medium">{suggestion.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Textarea
                id="solution-input"
                placeholder="e.g., Fire brigade with multiple red fire trucks, firefighters in yellow suits spraying powerful water hoses, helicopters dropping water from above to extinguish forest fires..."
                value={customSolution}
                onChange={(e) => handleCustomInput(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label className="text-muted-foreground text-sm mb-2 block">Quick suggestions:</Label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {solutionSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSelect(suggestion)}
                    className="flex-shrink-0 p-3 rounded-lg glass-card hover:bg-muted/50 text-sm transition-all whitespace-nowrap"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
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