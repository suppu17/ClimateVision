import { useState } from "react";
import { Flame, Cloud, Droplets, Mountain, Zap, TreePine, Car, Sun, Wind, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
}

const EffectSelector = ({ selectedEffect, onEffectSelect, onGenerate, isGenerating }: EffectSelectorProps) => {
  const [activeTab, setActiveTab] = useState<"effects" | "improvements">("effects");

  const EffectCard = ({ effect }: { effect: Effect }) => (
    <div
      className={cn(
        "glass-card p-4 cursor-pointer transition-all duration-300 hover:scale-105",
        selectedEffect === effect.id ? "ring-2 ring-primary glow" : ""
      )}
      onClick={() => onEffectSelect(effect.id, effect.category)}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          "p-2 rounded-lg",
          effect.category === "effects" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
        )}>
          {effect.icon}
        </div>
        <h3 className="font-semibold text-foreground">{effect.name}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{effect.description}</p>
    </div>
  );

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Climate Effect</h2>
        <p className="text-muted-foreground">
          Select how you want to transform your image to learn about climate impact
        </p>
      </div>

      <Tabs defaultValue="effects" className="w-full">
        <TabsList className="grid w-full grid-cols-2 glass mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {climateEffects.map((effect) => (
              <EffectCard key={effect.id} effect={effect} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {improvements.map((effect) => (
              <EffectCard key={effect.id} effect={effect} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedEffect && (
        <div className="mt-6 pt-6 border-t border-glass-border">
          <Button 
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-nature text-primary-foreground hover:opacity-90 transition-opacity"
            size="lg"
          >
            {isGenerating ? "Generating Climate Vision..." : "Generate Climate Impact"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EffectSelector;