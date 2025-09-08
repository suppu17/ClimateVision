import { Leaf, Upload, Sparkles, Info } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-4 left-4 right-4 z-50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">ClimateVision</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <Upload className="h-4 w-4" />
            Upload
          </button>
          <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <Sparkles className="h-4 w-4" />
            Effects
          </button>
          <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <Info className="h-4 w-4" />
            About
          </button>
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-white">
          <Leaf className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;