import { Leaf, Volume2, Phone } from "lucide-react";
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
            <Leaf className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">ClimateVision</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setIsEcoReportOpen(true)}
              className="text-white font-bold hover:text-white/90 transition-colors"
            >
              EcoVoice
            </button>
            <button className="flex items-center gap-2 text-white font-bold hover:text-white/90 transition-colors">
              <Phone className="h-4 w-4" />
              Emergency Contact
            </button>
            <NotificationBell />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <NotificationBell />
            <button className="p-2 text-white">
              <Leaf className="h-6 w-6" />
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