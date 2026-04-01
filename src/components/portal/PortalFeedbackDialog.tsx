import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2 } from "lucide-react";
import StarRating from "./StarRating";

interface PortalFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainingId: string;
  trainingTitle: string;
  companyId: string;
  onSubmitted: () => void;
}

const PortalFeedbackDialog = ({
  open,
  onOpenChange,
  trainingId,
  trainingTitle,
  companyId,
  onSubmitted,
}: PortalFeedbackDialogProps) => {
  const [name, setName] = useState("");
  const [ratingOverall, setRatingOverall] = useState(0);
  const [ratingContent, setRatingContent] = useState(0);
  const [ratingTrainer, setRatingTrainer] = useState(0);
  const [ratingPractical, setRatingPractical] = useState(0);
  const [liked, setLiked] = useState("");
  const [improve, setImprove] = useState("");
  const [apply, setApply] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const resetState = () => {
    setName("");
    setRatingOverall(0);
    setRatingContent(0);
    setRatingTrainer(0);
    setRatingPractical(0);
    setLiked("");
    setImprove("");
    setApply("");
    setSuccess(false);
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) setTimeout(resetState, 300);
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (ratingOverall === 0) {
      toast({
        title: "Geef een beoordeling",
        description: "Vul minimaal de algemene beoordeling in.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("portal_submit_feedback", {
        _training_id: trainingId,
        _company_id: companyId,
        _rating_overall: ratingOverall,
        _rating_content: ratingContent || null,
        _rating_trainer: ratingTrainer || null,
        _rating_practical: ratingPractical || null,
        _feedback_liked: liked.trim() || null,
        _feedback_improve: improve.trim() || null,
        _feedback_apply: apply.trim() || null,
        _respondent_name: name.trim() || null,
      });

      if (error) throw error;
      if (!data?.success) throw new Error("Submission failed");

      setSuccess(true);
      onSubmitted();
    } catch {
      toast({
        title: "Versturen lukt nu niet",
        description: "Probeer het later opnieuw.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        {success ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <DialogTitle className="font-display text-2xl text-foreground">
              Bedankt voor je feedback!
            </DialogTitle>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Je reactie helpt ons de training steeds beter te maken. We waarderen het enorm.
            </p>
            <Button onClick={() => handleClose(false)} className="mt-2">
              Sluiten
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-foreground">
                Hoe was de training?
              </DialogTitle>
              <DialogDescription className="leading-relaxed text-muted-foreground">
                {trainingTitle} — je feedback duurt minder dan 2 minuten en helpt ons enorm.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Naam <span className="text-muted-foreground font-normal">(optioneel)</span>
                </label>
                <Input
                  placeholder="Hoe mogen we je noemen?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                />
              </div>

              {/* Overall rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Algemene indruk <span className="text-destructive">*</span>
                </label>
                <StarRating value={ratingOverall} onChange={setRatingOverall} />
              </div>

              {/* Sub ratings */}
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-border/60 bg-muted/30 p-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Inhoud</p>
                  <StarRating value={ratingContent} onChange={setRatingContent} max={5} />
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Trainer</p>
                  <StarRating value={ratingTrainer} onChange={setRatingTrainer} max={5} />
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Toepasbaarheid</p>
                  <StarRating value={ratingPractical} onChange={setRatingPractical} max={5} />
                </div>
              </div>

              {/* Open questions */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Wat vond je het meest waardevol?
                </label>
                <Textarea
                  placeholder="Bijv. de concrete voorbeelden, de interactieve oefeningen..."
                  value={liked}
                  onChange={(e) => setLiked(e.target.value)}
                  rows={3}
                  maxLength={1000}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Wat kunnen we verbeteren?
                </label>
                <Textarea
                  placeholder="Alle feedback is welkom, hoe klein ook."
                  value={improve}
                  onChange={(e) => setImprove(e.target.value)}
                  rows={3}
                  maxLength={1000}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Wat ga je morgen anders doen?
                </label>
                <Textarea
                  placeholder="Welk inzicht neem je direct mee in de praktijk?"
                  value={apply}
                  onChange={(e) => setApply(e.target.value)}
                  rows={3}
                  maxLength={1000}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Feedback versturen"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PortalFeedbackDialog;
