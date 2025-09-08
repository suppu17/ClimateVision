import { Leaf } from "lucide-react";
import { useState } from "react";
import NotificationBell from "./NotificationBell";
import EcoReportDialog from "./EcoReportDialog";

const Header = () => {
  const [isEcoReportOpen, setIsEcoReportOpen] = useState(false);

  return (
    <>
      <header className="fixed top-4 left-4 right-4 z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-nav-blue" />
            <span className="text-xl font-bold text-nav-blue">ClimateVision</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NotificationBell />
            <button 
              onClick={() => setIsEcoReportOpen(true)}
              className="text-nav-blue font-bold hover:text-nav-blue/90 transition-colors"
            >
              EcoVoice
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <NotificationBell />
            <button 
              onClick={() => setIsEcoReportOpen(true)}
              className="text-nav-blue font-bold hover:text-nav-blue/90 transition-colors text-sm"
            >
              EcoVoice
            </button>
          </div>
        </div>
      </header>

      <EcoReportDialog 
        open={isEcoReportOpen} 
        onOpenChange={setIsEcoReportOpen} 
      />
    </>
  );
};

export default Header;