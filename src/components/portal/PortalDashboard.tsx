import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, GraduationCap, LogOut, MessageSquare, Sparkles, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import PortalTrainingCard from "./PortalTrainingCard";
import PortalFeedbackDialog from "./PortalFeedbackDialog";
import { ACADEMY_URL } from "@/lib/links";

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

const offerLinks = [
  {
    title: "Online Academy",
    body: "Leer op je eigen tempo met directe toegang tot de online trainingen.",
    href: ACADEMY_URL,
    icon: GraduationCap,
    cta: "Bekijk online",
  },
  {
    title: "Incompany training",
    body: "Een training op maat voor je team, met cases uit jullie eigen praktijk.",
    href: "https://morgencompany.com/academy",
    icon: Users,
    cta: "Bekijk voor teams",
  },
];

const PortalDashboard = ({ session, slug, onLogout }: PortalDashboardProps) => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

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

  const feedbackTraining = trainings[0] ?? null;

  // Per-portal overrides: deze klant kreeg een keynote (geen training) en geen Summer School-blok.
  const isKeynote = slug === "or-gemeente-tilburg";
  const eventNoun = isKeynote ? "keynote" : "training";
  // Portals zonder Summer School-reclame.
  const noSummerSchoolSlugs = ["onview", "pharmapartners"];
  const showSummerSchool = !isKeynote && !noSummerSchoolSlugs.includes(slug);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <a href={ACADEMY_URL} className="font-display text-xl font-semibold text-foreground tracking-tight hover:opacity-80 transition-opacity">
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
            {isKeynote ? "Keynotemateriaal" : "Trainingsmaterialen"}
          </h1>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
            Wat leuk dat je erbij was. Hieronder vind je de materialen van je {eventNoun}. We stellen het zeer op prijs als je even een minuutje neemt om feedback te geven, dat helpt ons de {eventNoun} steeds beter te maken.
          </p>
        </motion.div>

        {!loading && trainings.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-12 rounded-xl border border-border/60 bg-card/40 p-4"
          >
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFeedbackOpen(true)}
                disabled={!feedbackTraining || feedbackSubmitted}
                className="flex-1 gap-2"
              >
                {feedbackSubmitted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <MessageSquare className="h-4 w-4" />
                )}
                {feedbackSubmitted ? "Feedback verstuurd" : "Geef hier feedback"}
              </Button>
              <Button variant="outline" size="sm" asChild className="flex-1 gap-2">
                <a
                  href="https://g.page/r/Cdz-0WCIxls3EBM/review"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Star className="h-4 w-4" />
                  Laat een review achter
                </a>
              </Button>
            </div>
          </motion.section>
        )}

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
                slug={slug}
                password={session.password}
                index={index}
              />
            ))}
          </div>
        )}

        {!loading && trainings.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: trainings.length * 0.1 + 0.1 }}
            className="mt-16 space-y-4"
          >
            {showSummerSchool && (
              <div className="rounded-xl border border-primary/40 bg-primary/10 p-5 shadow-[0_0_40px_rgba(168,85,247,0.16)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.25em] text-primary">
                      Summer School
                    </p>
                    <h2 className="font-display text-2xl font-semibold text-foreground">
                      De zomer die alles verandert.
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                      Voor €250 krijg je in juli en augustus online toegang tot al onze live trainingen,
                      de KickOff en iedere twee weken een live webinar om zelf verder te leren en vragen te stellen.
                      Je behoudt oneindig toegang tot de webinars.
                    </p>
                  </div>
                  <Button asChild className="shrink-0 gap-2">
                    <a
                      href="mailto:totmorgen@morgenacademy.nl?subject=Interesse%20in%20Summer%20School"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ik wil meedoen
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {offerLinks.map((offer) => {
                const Icon = offer.icon;
                return (
                  <a
                    key={offer.title}
                    href={offer.href}
                    className="group rounded-xl border border-border/70 bg-card/60 p-4 transition-colors hover:border-primary/60"
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {offer.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {offer.body}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:text-primary/80">
                      {offer.cta}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </a>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 space-y-4 text-center"
        >
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
              className="text-primary/40 hover:text-primary/70 transition-colors"
            >
              Morgen Company
            </a>
          </p>
        </motion.div>

        {feedbackTraining && (
          <PortalFeedbackDialog
            open={feedbackOpen}
            onOpenChange={setFeedbackOpen}
            trainingId={feedbackTraining.id}
            trainingTitle={session.company_name}
            companyId={session.company_id}
            onSubmitted={() => setFeedbackSubmitted(true)}
          />
        )}
      </main>
    </div>
  );
};

export default PortalDashboard;
