import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, LogOut, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  resources: { label: string; value: string }[] | null;
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
          <a href="https://morgencompany.com/academy" target="_blank" rel="noopener noreferrer" className="font-display text-xl font-semibold text-foreground tracking-tight hover:opacity-80 transition-opacity">
            Morgen <span className="text-primary">Academy</span>
          </a>
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
            Download hieronder de slides van je training. We stellen het zeer op prijs als je even een minuutje neemt om feedback te geven, dat helpt ons de training steeds beter te maken.
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

        {/* Other trainings CTA */}
        {!loading && trainings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: trainings.length * 0.1 + 0.1 }}
            className="mt-8"
          >
            <Card className="border-border bg-card">
              <CardContent className="flex items-center justify-center py-6">
                <Button
                  variant="outline"
                  asChild
                  className="gap-2"
                >
                  <a
                    href="https://morgencompany.com/academy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Bekijk ons volledige trainingsaanbod
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Google Review + Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 space-y-6 text-center"
        >
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Heb je echt iets aan de training gehad? Heel fijn als je ons wilt helpen met een review.
            </p>
            <a
              href="https://g.page/r/Cdz-0WCIxls3EBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Laat een Google review achter
            </a>
          </div>

          <p className="text-xs text-muted-foreground/50">
            Vragen? Mail naar{" "}
            <a href="mailto:totmorgen@morgenacademy.nl" className="hover:text-muted-foreground transition-colors">
              totmorgen@morgenacademy.nl
            </a>
          </p>

          <p className="text-xs text-muted-foreground/40">
            Morgen Academy is het trainingsplatform van{" "}
            <a
              href="https://www.morgencompany.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/40 hover:text-primary/70 transition-colors"
            >
              Morgen Company
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default PortalDashboard;
