import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, FileText, MapPin, User, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EcoReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EcoReportDialog = ({ open, onOpenChange }: EcoReportDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    violationType: "",
    severityLevel: "",
    pollutant: "",
    location: "",
    dateOfIncident: "",
    timeOfIncident: "",
    description: "",
    additionalInfo: "",
    reporterName: "",
    email: "",
    phoneNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.violationType || !formData.severityLevel || !formData.location || 
        !formData.dateOfIncident || !formData.description || !formData.reporterName || 
        !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Submit logic would go here
    toast({
      title: "Report Submitted",
      description: "Your environmental report has been forwarded to relevant authorities.",
    });
    
    // Reset form and close dialog
    setFormData({
      violationType: "",
      severityLevel: "",
      pollutant: "",
      location: "",
      dateOfIncident: "",
      timeOfIncident: "",
      description: "",
      additionalInfo: "",
      reporterName: "",
      email: "",
      phoneNumber: "",
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader className="border-b border-slate-700 pb-4">
          <div className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle className="text-xl font-bold text-white">
              EcoVoice Environmental Report
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            Report environmental violations to help protect our planet and communities
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Violation Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <FileText className="h-4 w-4" />
              <h3 className="font-semibold">Violation Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="violationType" className="text-white">
                  Type of Violation <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.violationType} onValueChange={(value) => setFormData({...formData, violationType: value})}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select violation type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="air-pollution">Air Pollution</SelectItem>
                    <SelectItem value="water-pollution">Water Pollution</SelectItem>
                    <SelectItem value="noise-pollution">Noise Pollution</SelectItem>
                    <SelectItem value="soil-contamination">Soil Contamination</SelectItem>
                    <SelectItem value="illegal-dumping">Illegal Dumping</SelectItem>
                    <SelectItem value="deforestation">Deforestation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severityLevel" className="text-white">
                  Severity Level <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.severityLevel} onValueChange={(value) => setFormData({...formData, severityLevel: value})}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pollutant" className="text-white">
                Pollutant/Substance (if known)
              </Label>
              <Input
                id="pollutant"
                placeholder="e.g., Chemical name, waste type, etc."
                value={formData.pollutant}
                onChange={(e) => setFormData({...formData, pollutant: e.target.value})}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Location & Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <MapPin className="h-4 w-4" />
              <h3 className="font-semibold">Location & Time</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">
                Location of Violation <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                placeholder="Street address, city, state, or GPS coordinates"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfIncident" className="text-white">
                  Date of Incident <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateOfIncident"
                  type="date"
                  value={formData.dateOfIncident}
                  onChange={(e) => setFormData({...formData, dateOfIncident: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeOfIncident" className="text-white">
                  Time of Incident
                </Label>
                <Input
                  id="timeOfIncident"
                  type="time"
                  value={formData.timeOfIncident}
                  onChange={(e) => setFormData({...formData, timeOfIncident: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Detailed Description</h3>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description of Violation <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Provide detailed description of what you observed, including any visible effects on environment, wildlife, or public health..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 min-h-[100px]"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Additional Information</h3>
            
            <div className="space-y-2">
              <Textarea
                placeholder="Any additional context, previous incidents, or relevant information..."
                value={formData.additionalInfo}
                onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 min-h-[80px]"
              />
            </div>
          </div>

          {/* Reporter Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <User className="h-4 w-4" />
              <h3 className="font-semibold">Reporter Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reporterName" className="text-white">
                  Your Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="reporterName"
                  placeholder="Full name"
                  value={formData.reporterName}
                  onChange={(e) => setFormData({...formData, reporterName: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-white">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                placeholder="(555) 123-4567"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
            <p className="text-amber-200 text-sm">
              <strong>Important:</strong> This report will be forwarded to relevant environmental authorities. 
              Providing false information may result in legal consequences. All reports are taken seriously 
              and investigated according to local and federal regulations.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="bg-transparent border-slate-600 text-white hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Submit Report
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EcoReportDialog;