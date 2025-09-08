import { useState } from "react";
import { Flame, Cloud, Droplets, Mountain, Zap, TreePine, Car, Sun, Wind, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Bot } from "lucide-react";

interface Effect {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "effects" | "improvements";
}

const climateEffects: Effect[] = [
  {
    id: "wildfire",
    name: "Wildfire",
    description: "Show the impact of wildfires on natural landscapes",
    icon: <Flame className="h-5 w-5" />,
    category: "effects"
  },
  {
    id: "pollution",
    name: "Air Pollution",
    description: "Visualize smog and air quality degradation",
    icon: <Cloud className="h-5 w-5" />,
    category: "effects"
  },
  {
    id: "flooding",
    name: "Flooding",
    description: "Demonstrate water level rise and flooding effects",
    icon: <Droplets className="h-5 w-5" />,
    category: "effects"
  },
  {
    id: "earthquake",
    name: "Earthquake",
    description: "Show geological damage and landscape disruption",
    icon: <Mountain className="h-5 w-5" />,
    category: "effects"
  },
  {
    id: "extreme-weather",
    name: "Extreme Weather",
    description: "Display severe weather pattern changes",
    icon: <Zap className="h-5 w-5" />,
    category: "effects"
  }
];

const improvements: Effect[] = [
  {
    id: "reforestation",
    name: "Plant Trees",
    description: "Add lush forest growth and vegetation recovery",
    icon: <TreePine className="h-5 w-5" />,
    category: "improvements"
  },
  {
    id: "electric-transport",
    name: "Electric Vehicles",
    description: "Replace pollution with clean transportation",
    icon: <Car className="h-5 w-5" />,
    category: "improvements"
  },
  {
    id: "solar-energy",
    name: "Solar Panels",
    description: "Integrate renewable energy infrastructure",
    icon: <Sun className="h-5 w-5" />,
    category: "improvements"
  },
  {
    id: "wind-power",
    name: "Wind Energy",
    description: "Add wind turbines for clean power generation",
    icon: <Wind className="h-5 w-5" />,
    category: "improvements"
  },
  {
    id: "water-conservation",
    name: "Water Conservation",
    description: "Implement sustainable water management systems",
    icon: <Waves className="h-5 w-5" />,
    category: "improvements"
  }
];

interface EffectSelectorProps {
  selectedEffect: string | null;
  onEffectSelect: (effectId: string, category: "effects" | "improvements") => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  minimal?: boolean;
}

const EffectSelector = ({ selectedEffect, onEffectSelect, onGenerate, isGenerating, minimal = false }: EffectSelectorProps) => {
  const [activeTab, setActiveTab] = useState<"effects" | "improvements">("effects");
  
  const currentEffects = activeTab === "effects" ? climateEffects : improvements;

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
            Solutions
          </button>
        </div>

        {/* Effects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {currentEffects.map((effect) => (
            <button
              key={effect.id}
              onClick={() => onEffectSelect(effect.id, activeTab)}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl transition-all text-left",
                "border border-white/20 bg-white/10 hover:bg-white/20",
                selectedEffect === effect.id
                  ? "border-white/40 bg-white/20 shadow-md"
                  : ""
              )}
            >
              <div className="text-red-400 flex-shrink-0">
                {effect.icon}
              </div>
              <span className="text-white text-sm font-medium truncate">
                {effect.name}
              </span>
            </button>
          ))}
        </div>

        {/* Fixed Generate Button Container */}
        <div className="min-h-[56px] flex items-center justify-center">
          <Button
            onClick={onGenerate}
            disabled={isGenerating || !selectedEffect}
            className="bg-gradient-nature text-white hover:opacity-90 disabled:opacity-50 px-8 py-3 rounded-full font-medium transition-all"
          >
            <Bot className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating Climate Impact..." : "Generate Climate Impact"}
          </Button>
        </div>
      </div>
    );
  }

  const EffectCard = ({ effect }: { effect: Effect }) => (
    <div
      className={cn(
        minimal ? "glass-card p-3 cursor-pointer transition-all duration-300 hover:scale-105" : "glass-card p-4 cursor-pointer transition-all duration-300 hover:scale-105",
        selectedEffect === effect.id ? "ring-2 ring-primary glow" : ""
      )}
      onClick={() => onEffectSelect(effect.id, effect.category)}
    >
      <div className={cn("flex items-center gap-3", minimal ? "mb-2" : "mb-3")}>
        <div className={cn(
          minimal ? "p-1.5 rounded-lg" : "p-2 rounded-lg",
          effect.category === "effects" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
        )}>
          {effect.icon}
        </div>
        <h3 className={cn("font-semibold text-foreground", minimal ? "text-sm" : "")}>{effect.name}</h3>
      </div>
      {!minimal && <p className="text-sm text-muted-foreground">{effect.description}</p>}
    </div>
  );

  return (
    <div className={minimal ? "" : "glass-card p-6 animate-slide-up"}>
      {!minimal && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Choose Climate Effect</h2>
          <p className="text-muted-foreground">
            Select how you want to transform your image to learn about climate impact
          </p>
        </div>
      )}

      <Tabs defaultValue="effects" className="w-full">
        <TabsList className={cn("grid w-full grid-cols-2 glass", minimal ? "mb-4" : "mb-6")}>
          <TabsTrigger 
            value="effects" 
            className="data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive"
          >
            Climate Effects
          </TabsTrigger>
          <TabsTrigger 
            value="improvements"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Solutions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="effects" className="space-y-4">
          <div className={cn("grid gap-3", minimal ? "grid-cols-2 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2 gap-4")}>
            {climateEffects.map((effect) => (
              <EffectCard key={effect.id} effect={effect} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-4">
          <div className={cn("grid gap-3", minimal ? "grid-cols-2 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2 gap-4")}>
            {improvements.map((effect) => (
              <EffectCard key={effect.id} effect={effect} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className={cn(minimal ? "mt-4" : "mt-6 pt-6 border-t border-glass-border")}>
        <Button 
          onClick={onGenerate}
          disabled={isGenerating || !selectedEffect}
          className="w-full bg-gradient-nature text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
          size={minimal ? "default" : "lg"}
        >
          <Bot className="h-4 w-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Climate Impact"}
        </Button>
      </div>
    </div>
  );
};

export default EffectSelector;