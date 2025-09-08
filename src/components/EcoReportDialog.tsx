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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-teal-800 backdrop-blur-xl border-teal-600">
        <DialogHeader className="border-b border-teal-600 pb-4">
          <div className="flex items-center gap-2 text-teal-200">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle className="text-xl font-bold text-white">
              EcoVoice Environmental Report
            </DialogTitle>
          </div>
          <DialogDescription className="text-white/80">
            Report environmental violations to help protect our planet and communities
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Violation Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-teal-200">
              <FileText className="h-4 w-4" />
              <h3 className="font-semibold text-white">Violation Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="violationType" className="text-white">
                  Type of Violation <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.violationType} onValueChange={(value) => setFormData({...formData, violationType: value})}>
                  <SelectTrigger className="bg-teal-700 border-teal-500 text-white">
                    <SelectValue placeholder="Select violation type" />
                  </SelectTrigger>
                  <SelectContent className="bg-teal-700 border-teal-500 text-white">
                    <SelectItem value="air-pollution" className="text-white hover:bg-teal-600">Air Pollution</SelectItem>
                    <SelectItem value="water-pollution" className="text-white hover:bg-teal-600">Water Pollution</SelectItem>
                    <SelectItem value="noise-pollution" className="text-white hover:bg-teal-600">Noise Pollution</SelectItem>
                    <SelectItem value="soil-contamination" className="text-white hover:bg-teal-600">Soil Contamination</SelectItem>
                    <SelectItem value="illegal-dumping" className="text-white hover:bg-teal-600">Illegal Dumping</SelectItem>
                    <SelectItem value="deforestation" className="text-white hover:bg-teal-600">Deforestation</SelectItem>
                    <SelectItem value="other" className="text-white hover:bg-teal-600">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severityLevel" className="text-white">
                  Severity Level <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.severityLevel} onValueChange={(value) => setFormData({...formData, severityLevel: value})}>
                  <SelectTrigger className="bg-teal-700 border-teal-500 text-white">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-teal-700 border-teal-500 text-white">
                    <SelectItem value="low" className="text-white hover:bg-teal-600">Low</SelectItem>
                    <SelectItem value="medium" className="text-white hover:bg-teal-600">Medium</SelectItem>
                    <SelectItem value="high" className="text-white hover:bg-teal-600">High</SelectItem>
                    <SelectItem value="critical" className="text-white hover:bg-teal-600">Critical</SelectItem>
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
                className="bg-teal-700 border-teal-500 text-white placeholder:text-white/60"
              />
            </div>
          </div>

          {/* Location & Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-teal-200">
              <MapPin className="h-4 w-4" />
              <h3 className="font-semibold text-white">Location & Time</h3>
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
                className="bg-teal-700 border-teal-500 text-white placeholder:text-white/60"
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
                  className="bg-teal-700 border-teal-500 text-white"
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
                  className="bg-teal-700 border-teal-500 text-white"
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
                className="bg-teal-700 border-teal-500 text-white placeholder:text-white/60 min-h-[100px]"
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
                className="bg-teal-700 border-teal-500 text-white placeholder:text-white/60 min-h-[80px]"
              />
            </div>
          </div>

          {/* Reporter Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-teal-200">
              <User className="h-4 w-4" />
              <h3 className="font-semibold text-white">Reporter Information</h3>
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
                  className="bg-teal-700 border-teal-500 text-white placeholder:text-white/60"
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
                  className="bg-teal-700 border-teal-500 text-white placeholder:text-white/60"
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
                className="bg-teal-700 border-teal-500 text-white placeholder:text-white/60"
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
          <div className="flex justify-end gap-4 pt-4 border-t border-teal-600">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="bg-transparent border-teal-500 text-white hover:bg-teal-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white"
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