import { useState } from "react";
import { motion } from "framer-motion";
import { FileDown, Loader2, Calendar, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PortalResourcesDialog from "./PortalResourcesDialog";

interface Training {
  id: string;
  title: string;
  description: string | null;
  training_date: string | null;
  training_dates: string[] | null;
  slide_storage_path: string | null;
  slide_filename: string | null;
  resources: Resource[] | null;
}

interface Resource {
  label: string;
  value: string;
  type?: "file";
  storagePath?: string;
  filename?: string;
  contentType?: string;
  size?: number;
}

interface PortalTrainingCardProps {
  training: Training;
  slug: string;
  password: string;
  index: number;
}

const PortalTrainingCard = ({ training, slug, password, index }: PortalTrainingCardProps) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadingResourcePath, setDownloadingResourcePath] = useState<string | null>(null);
  const [previewResourcePath, setPreviewResourcePath] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const { toast } = useToast();

  const dates = training.training_dates?.length
    ? training.training_dates
    : training.training_date ? [training.training_date] : [];
  const formattedDate = dates.length > 0
    ? dates.map((d) => new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })).join(", ")
    : null;

  const hasSlide = !!training.slide_storage_path;
  const hasResources = !!training.resources?.length;

  const getDownloadUrl = async (storagePath?: string) => {
    const { data, error } = await supabase.functions.invoke("portal-download", {
      body: { slug, password, training_id: training.id, storage_path: storagePath },
    });

    if (error || !data?.download_url) throw new Error("Download mislukt");
    return data.download_url as string;
  };

  const downloadTrainingFile = async (storagePath?: string) => {
    if (storagePath) setDownloadingResourcePath(storagePath);
    else setDownloading(true);

    try {
      window.location.href = await getDownloadUrl(storagePath);
    } catch {
      toast({
        title: "Download mislukt",
        description: "Probeer het later opnieuw.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
      setDownloadingResourcePath(null);
    }
  };

  const handleDownloadResource = (resource: Resource) => {
    if (!resource.storagePath) return;
    downloadTrainingFile(resource.storagePath);
  };

  const handlePreviewResource = async (resource: Resource) => {
    if (!resource.storagePath) return;

    setDownloadingResourcePath(resource.storagePath);
    try {
      const url = await getDownloadUrl(resource.storagePath);
      setPreviewResourcePath(resource.storagePath);
      setPreviewUrl(url);
    } catch {
      toast({
        title: "Video laden mislukt",
        description: "Probeer het later opnieuw.",
        variant: "destructive",
      });
    } finally {
      setDownloadingResourcePath(null);
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

          <CardContent className="space-y-3">
            {hasResources && (
              <button
                onClick={() => setResourcesOpen(true)}
                className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Materialen bekijken
              </button>
            )}

            <div className="flex flex-col gap-2.5 sm:flex-row">
              {hasSlide && (
                <Button
                  onClick={() => downloadTrainingFile()}
                  disabled={downloading}
                  className="flex-1 gap-2"
                >
                  {downloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileDown className="h-4 w-4" />
                  )}
                  {downloading ? "Bezig..." : "Hoofdbestand openen"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {hasResources && (
        <PortalResourcesDialog
          open={resourcesOpen}
          onOpenChange={setResourcesOpen}
          trainingTitle={training.title}
          resources={training.resources!}
          downloadingResourcePath={downloadingResourcePath}
          previewResourcePath={previewResourcePath}
          previewUrl={previewUrl}
          onDownloadFile={handleDownloadResource}
          onPreviewFile={handlePreviewResource}
        />
      )}
    </>
  );
};

export default PortalTrainingCard;
