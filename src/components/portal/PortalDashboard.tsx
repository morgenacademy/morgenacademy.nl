import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import PortalTrainingCard from "./PortalTrainingCard";

interface Training {
  id: string;
  title: string;
  description: string | null;
  training_date: string | null;
  training_dates: string[] | null;
  slide_storage_path: string | null;
  slide_filename: string | null;
  slide_external_url: string | null;
}

interface PortalSession {
  company_id: string;
  company_name: string;
  logo_url: string | null;
  authenticated_at: number;
  password: string;
}

interface PortalDashboardProps {
  session: PortalSession;
  slug: string;
  onLogout: () => void;
}

const PortalDashboard = ({ session, slug, onLogout }: PortalDashboardProps) => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      const { data } = await supabase.rpc("portal_get_trainings", {
        _company_id: session.company_id,
      });
      setTrainings((data as Training[]) ?? []);
      setLoading(false);
    };
    fetchTrainings();
  }, [session.company_id]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <h2 className="font-display text-xl font-semibold text-foreground tracking-tight">
            Morgen <span className="text-primary">Academy</span>
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="gap-1.5 text-xs text-muted-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Uitloggen
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {session.company_name}
          </p>
          <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
            Trainingsmaterialen
          </h1>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
            Download hieronder de slides van je training. We stellen het zeer op prijs als je even een minuutje neemt om feedback te geven — dat helpt ons de training steeds beter te maken.
          </p>
        </motion.div>

        {/* Trainings */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : trainings.length === 0 ? (
          <div className="rounded-xl border border-border bg-card px-6 py-10 text-center text-muted-foreground">
            Er zijn nog geen trainingen toegevoegd.
          </div>
        ) : (
          <div className="space-y-4">
            {trainings.map((training, index) => (
              <PortalTrainingCard
                key={training.id}
                training={training}
                companyId={session.company_id}
                slug={slug}
                password={session.password}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 space-y-3 text-center"
        >
          <p className="text-xs text-muted-foreground/70">
            Blij met de training?{" "}
            <a
              href="https://g.page/r/Cdz-0WCIxls3EBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <img src="https://cdn.prod.website-files.com/603459ac924304747737f3ab/603459ac924304141037f63c_google-review.jpg" alt="" className="h-3.5 w-3.5 rounded-sm inline" />
              Laat een review achter
            </a>
          </p>
          <p className="text-xs text-muted-foreground/50">
            Vragen? Mail naar{" "}
            <a href="mailto:totmorgen@morgenacademy.nl" className="hover:text-muted-foreground transition-colors">
              totmorgen@morgenacademy.nl
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default PortalDashboard;
