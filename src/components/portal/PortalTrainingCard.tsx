import { useState } from "react";
import { motion } from "framer-motion";
import { FileDown, MessageSquare, CheckCircle, Loader2, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PortalFeedbackDialog from "./PortalFeedbackDialog";

interface Training {
  id: string;
  title: string;
  description: string | null;
  training_date: string | null;
  training_dates: string[] | null;
  slide_storage_path: string | null;
  slide_filename: string | null;
}

interface PortalTrainingCardProps {
  training: Training;
  companyId: string;
  slug: string;
  password: string;
  index: number;
}

const PortalTrainingCard = ({ training, companyId, slug, password, index }: PortalTrainingCardProps) => {
  const [downloading, setDownloading] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const { toast } = useToast();

  const dates = training.training_dates?.length
    ? training.training_dates
    : training.training_date ? [training.training_date] : [];
  const formattedDate = dates.length > 0
    ? dates.map((d) => new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })).join(", ")
    : null;

  const hasSlide = !!training.slide_storage_path;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { data, error } = await supabase.functions.invoke("portal-download", {
        body: { slug, password, training_id: training.id },
      });

      if (error || !data?.download_url) throw new Error("Download mislukt");

      window.open(data.download_url, "_blank", "noopener,noreferrer");
    } catch {
      toast({
        title: "Download mislukt",
        description: "Probeer het later opnieuw.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <Card className="border-border bg-card transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="font-display text-lg font-semibold text-foreground leading-snug">
                {training.title}
              </CardTitle>
              {feedbackSubmitted && (
                <div className="flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs text-success">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Feedback gegeven
                </div>
              )}
            </div>
            {formattedDate && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </p>
            )}
            {training.description && (
              <p className="text-sm leading-relaxed text-muted-foreground">{training.description}</p>
            )}
          </CardHeader>

          <CardContent className="flex flex-col gap-2.5 sm:flex-row">
            {hasSlide && (
              <Button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 gap-2"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4" />
                )}
                {downloading ? "Bezig..." : "Slides downloaden"}
              </Button>
            )}

            <Button
              variant={feedbackSubmitted ? "outline" : "secondary"}
              onClick={() => setFeedbackOpen(true)}
              disabled={feedbackSubmitted}
              className="flex-1 gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              {feedbackSubmitted ? "Feedback verstuurd" : "Geef feedback"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <PortalFeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        trainingId={training.id}
        trainingTitle={training.title}
        companyId={companyId}
        onSubmitted={() => setFeedbackSubmitted(true)}
      />
    </>
  );
};

export default PortalTrainingCard;
