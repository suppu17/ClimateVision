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
import { AlertTriangle, FileText, MapPin, User, X, Upload, Image, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EcoReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EcoReportDialog = ({ open, onOpenChange }: EcoReportDialogProps) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('report-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('report-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For drafts, only require at least one field to be filled
    if (!formData.violationType && !formData.location && !formData.description && 
        !formData.reporterName && !formData.email) {
      toast({
        title: "Cannot Save Empty Draft",
        description: "Please fill out at least one field before saving as draft.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingDraft(true);

    try {
      // Upload image if selected
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
        if (!imageUrl) {
          toast({
            title: "Image Upload Failed",
            description: "Failed to upload image. Draft will be saved without image.",
          });
        }
      }

      // Save draft to database
      const { error } = await supabase
        .from('reports')
        .insert({
          violation_type: formData.violationType || null,
          location: formData.location || 'Draft - Location not specified',
          description: formData.description || 'Draft - Description not provided',
          reporter_name: formData.reporterName || 'Draft Reporter',
          reporter_email: formData.email || 'draft@example.com',
          reporter_phone: formData.phoneNumber || null,
          image_url: imageUrl,
          status: 'draft',
        });

      if (error) {
        console.error('Error saving draft:', error);
        toast({
          title: "Draft Save Failed",
          description: "Failed to save your draft. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Draft Saved",
        description: "Your report draft has been saved. You can continue editing it later.",
      });
      
      // Don't reset form or close dialog for drafts - let user continue editing
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Draft Save Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);

    try {
      // Upload image if selected
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
        if (!imageUrl) {
          toast({
            title: "Image Upload Failed",
            description: "Failed to upload image. Report will be saved without image.",
          });
        }
      }

      // Save report to database with submitted status
      const { error } = await supabase
        .from('reports')
        .insert({
          violation_type: formData.violationType,
          location: formData.location,
          description: formData.description,
          reporter_name: formData.reporterName,
          reporter_email: formData.email,
          reporter_phone: formData.phoneNumber || null,
          image_url: imageUrl,
          status: 'submitted',
        });

      if (error) {
        console.error('Error saving report:', error);
        toast({
          title: "Submission Failed",
          description: "Failed to save your report. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Report Submitted",
        description: "Your environmental report has been saved and will be reviewed by authorities.",
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
      setSelectedImage(null);
      setImagePreview(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label className="text-white">Evidence Photo (Optional)</Label>
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Evidence preview" 
                    className="w-full max-h-48 object-cover rounded-lg border-2 border-teal-500"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleImageRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-teal-500 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Image className="h-8 w-8 text-teal-300" />
                    <div className="text-white/80">
                      <p className="text-sm">Upload evidence photo</p>
                      <p className="text-xs text-white/60">JPG, PNG up to 10MB</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="bg-teal-600 border-teal-500 text-white hover:bg-teal-700"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
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
              type="button"
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isSubmitting}
              variant="outline"
              className="bg-transparent border-yellow-500 text-yellow-400 hover:bg-yellow-900/20"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSavingDraft ? "Saving Draft..." : "Save Draft"}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isSavingDraft}
              className="bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EcoReportDialog;