import { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2 } from "lucide-react";
import type { LiveSession } from "@/data/liveSessions";

interface LiveSessionSignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: LiveSession | null;
}

const signupSchema = z.object({
  name: z.string().trim().min(1, "Vul je naam in").max(100, "Naam is te lang"),
  email: z.string().trim().email("Vul een geldig e-mailadres in").max(255, "E-mailadres is te lang"),
  company: z.string().trim().max(120, "Bedrijfsnaam is te lang").optional(),
  seats: z.number().int().min(1).max(8),
  notes: z.string().trim().max(1000, "Opmerking is te lang").optional(),
  newsletter: z.boolean(),
});

const LiveSessionSignupDialog = ({
  open,
  onOpenChange,
  session,
}: LiveSessionSignupDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [seats, setSeats] = useState("1");
  const [notes, setNotes] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const resetState = () => {
    setName("");
    setEmail("");
    setCompany("");
    setSeats("1");
    setNotes("");
    setNewsletter(true);
    setSuccess(false);
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTimeout(resetState, 300);
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!session) return;

    const parsed = signupSchema.safeParse({
      name,
      email,
      company: company || undefined,
      seats: Number(seats),
      notes: notes || undefined,
      newsletter,
    });

    if (!parsed.success) {
      toast({
        title: "Controleer je invoer",
        description: parsed.error.issues[0]?.message ?? "Vul je gegevens opnieuw in.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("live_session_registrations").insert({
        session_id: session.id,
        session_title: session.title,
        scheduled_for: session.startsAt,
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        company: parsed.data.company || null,
        seats: parsed.data.seats,
        notes: parsed.data.notes || null,
        newsletter: parsed.data.newsletter,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Je staat al ingeschreven",
            description: "Gebruik gerust hetzelfde e-mailadres voor een andere livesessie.",
          });
          return;
        }

        throw error;
      }

      setSuccess(true);
    } catch {
      toast({
        title: "Aanmelden lukt nu niet",
        description: "Probeer het later opnieuw.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        {success ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-7 w-7 text-success" />
            </div>
            <DialogTitle className="font-display text-2xl text-foreground">
              Je plek is aangevraagd
            </DialogTitle>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Dank je {name}! We hebben je aanvraag voor{" "}
              <strong className="text-foreground">{session?.title}</strong> ontvangen.
            </p>
            <Button onClick={() => handleClose(false)} className="mt-2">
              Sluiten
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-foreground">
                {session?.title ?? "Livesessie"}
              </DialogTitle>
              <DialogDescription className="pt-1 leading-relaxed text-muted-foreground">
                Laat je gegevens achter en we reserveren je plek. Je ontvangt daarna een bevestiging
                met alle praktische informatie.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <Input
                placeholder="Naam"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={100}
                required
              />
              <Input
                type="email"
                placeholder="E-mailadres"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength={255}
                required
              />
              <Input
                placeholder="Bedrijf (optioneel)"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                maxLength={120}
              />
              <Input
                type="number"
                min={1}
                max={8}
                placeholder="Aantal plekken"
                value={seats}
                onChange={(event) => setSeats(event.target.value)}
                required
              />
              <Textarea
                placeholder="Opmerking of vraag (optioneel)"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                maxLength={1000}
                rows={3}
              />
              <label className="flex cursor-pointer items-start gap-2.5">
                <Checkbox
                  checked={newsletter}
                  onCheckedChange={(checked) => setNewsletter(checked === true)}
                  className="mt-0.5"
                />
                <span className="text-xs leading-relaxed text-muted-foreground">
                  Stuur me ook praktische AI-tips en updates over nieuwe live sessies.
                </span>
              </label>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Plek reserveren"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LiveSessionSignupDialog;
