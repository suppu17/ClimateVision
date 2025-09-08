import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { CalendarDays, MapPin, User, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  violation_type: string;
  location: string;
  description: string;
  reporter_name: string;
  reporter_email: string;
  reporter_phone?: string;
  image_url?: string;
  created_at: string;
}

interface ReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReportsDialog = ({ open, onOpenChange }: ReportsDialogProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('status', 'submitted')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: "Error",
          description: "Failed to load reports",
          variant: "destructive",
        });
        return;
      }

      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchReports();
    }
  }, [open]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Environmental Reports</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading reports...</div>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">No reports found</div>
            </div>
          ) : (
            <div className="space-y-6">
              {reports.map((report) => (
                <Card key={report.id} className="w-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{report.violation_type}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(report.created_at)}
                        </div>
                      </div>
                      <Badge variant="secondary">{report.violation_type}</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                      <span className="text-sm">{report.location}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>

                    {report.image_url && (
                      <div>
                        <h4 className="font-medium mb-2">Evidence</h4>
                        <img 
                          src={report.image_url} 
                          alt="Report evidence" 
                          className="max-w-full h-auto rounded-lg max-h-48 object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Reporter Information</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {report.reporter_name}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {report.reporter_email}
                        </div>
                        {report.reporter_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {report.reporter_phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ReportsDialog;