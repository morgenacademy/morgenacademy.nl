import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Sparkles, Bell, Users, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";
import WaitlistDialog from "@/components/WaitlistDialog";
import ContactDialog from "@/components/ContactDialog";
import NewsletterDialog from "@/components/NewsletterDialog";
import { cn } from "@/lib/utils";

const headerLinks = [
  {
    label: "Online trainingen",
    href: "/",
    active: true,
  },
  {
    label: "Incompany trainingen",
    href: "https://morgencompany.com/academy",
  },
  {
    label: "Consultancy",
    href: "https://morgencompany.com/consultancy",
  },
  {
    label: "Technology",
    href: "https://morgencompany.com/technology",
  },
  {
    label: "Company",
    href: "https://morgencompany.com/company",
  },
] as const;

const Landing = () => {
  const navigate = useNavigate();
  const [waitlistCourse, setWaitlistCourse] = useState<{ id: string; title: string } | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="border-b border-white/5 bg-[radial-gradient(circle_at_top,_rgba(200,80,216,0.16),_transparent_42%),linear-gradient(180deg,#120818_0%,#140a1c_42%,#100814_100%)]">
          <div className="mx-auto max-w-7xl px-6">
            <nav className="flex min-h-[84px] items-center justify-start gap-x-8 gap-y-3 overflow-x-auto py-5 text-nowrap lg:justify-center lg:gap-x-12">
              {headerLinks.map((item) => {
                const classes = cn(
                  "text-[1.05rem] font-medium tracking-[0.08em] transition-colors hover:text-foreground lg:text-[1.2rem]",
                  item.active ? "text-foreground" : "text-[#d3cfe3]",
                );

                return item.active ? (
                  <Link key={item.label} to={item.href} className={classes} aria-current="page">
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl font-semibold tracking-tight text-foreground">
                Morgen <span className="text-primary">Academy</span>
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Online trainingen
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="hidden text-xs uppercase tracking-wider sm:inline-flex"
                onClick={() => setContactOpen(true)}
              >
                Contact
              </Button>
              <Link to="/login">
                <Button variant="outline" size="sm" className="text-xs uppercase tracking-wider">
                  Inloggen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Online trainingen
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-foreground md:text-5xl lg:text-6xl">
            Leer werken met AI & automatisering
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Praktische videotrainingen waarmee je direct aan de slag kunt.
            Leer op je eigen tempo, waar en wanneer je wilt.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#trainingen">
              <Button size="lg" className="gap-2 text-sm uppercase tracking-wider">
                Bekijk trainingen
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Button
              variant="outline"
              size="lg"
              className="text-sm uppercase tracking-wider"
              onClick={() => setNewsletterOpen(true)}
            >
              Nieuwsbrief
            </Button>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-sm uppercase tracking-wider">
                Al een account? Log in
              </Button>
            </Link>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Onze nieuwsbrief zit boordevol praktische tips die je AI-gebruik echt een boost geven.
            Geen spam, geen reclame. Wel waarde.
          </p>
        </motion.div>
      </section>

      {/* Courses */}
      <section id="trainingen" className="mx-auto max-w-6xl px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
            Trainingen
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-10">
            Ons aanbod
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`group overflow-hidden rounded-xl bg-card border border-border ${
                course.comingSoon ? "opacity-70" : ""
              }`}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className={`h-full w-full object-cover ${
                    course.comingSoon ? "grayscale" : ""
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                {course.comingSoon && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-secondary/90 backdrop-blur-sm px-5 py-2.5 flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm font-medium text-foreground tracking-wide">
                        Binnenkort beschikbaar
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold text-foreground">
                  {course.title}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {course.subtitle}
                </p>

                {course.comingSoon ? (
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="gap-2 text-sm w-full"
                      onClick={() => setWaitlistCourse({ id: course.id, title: course.title })}
                    >
                      <Bell className="h-4 w-4" />
                      Op de wachtlijst zetten
                    </Button>
                  </div>
                ) : (
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {course.totalLessons} lessen · {course.totalDuration}
                    </span>
                    <div className="flex-1" />
                    {course.price && (
                      <span className="text-sm font-semibold text-foreground mr-2">
                        €{course.price}
                      </span>
                    )}
                    <Button
                      className="gap-2 text-sm"
                      onClick={() => navigate(`/checkout/${course.id}`)}
                    >
                      Koop nu
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Incompany / Live sectie */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-xl border border-border bg-card p-8 md:p-12"
        >
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-accent" />

          <div className="flex flex-col items-start gap-8 md:flex-row md:gap-12">
            <div className="flex-1">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">
                Live training
              </p>
              <h2 className="mb-4 font-display text-3xl font-semibold text-foreground md:text-4xl">
                Liever samen met je team?
              </h2>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                Boek een incompany training en leer samen met je team werken met AI.
                In twee uur krijgt je team een praktische, interactieve sessie op locatie of online.
              </p>
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                Meer weten over onze bredere aanpak voor teams en organisaties?{" "}
                <a
                  href="https://www.morgencompany.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Bekijk Morgen Company
                </a>
                .
              </p>

              <div className="mb-8 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span>10 personen incl.</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>2 uur</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="text-2xl font-display font-semibold text-foreground">€ 995,-</span>
                <span className="text-xs text-muted-foreground">meer personen in overleg</span>
              </div>
            </div>

            <div className="w-full shrink-0 flex-col gap-3 md:w-auto md:pt-10 flex">
              <Button asChild size="lg" className="w-full gap-2 text-sm uppercase tracking-wider">
                <a
                  href="https://morgencompany.com/academy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bekijk incompany trainingen
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Voor teams, organisaties en maatwerktrajecten
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <WaitlistDialog
        open={!!waitlistCourse}
        onOpenChange={(open) => !open && setWaitlistCourse(null)}
        courseId={waitlistCourse?.id || ""}
        courseTitle={waitlistCourse?.title || ""}
      />
      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
      <NewsletterDialog open={newsletterOpen} onOpenChange={setNewsletterOpen} />

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Morgen Academy is het trainingsplatform van{" "}
            <a
              href="https://www.morgencompany.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Morgen Company
            </a>
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="text-xs text-muted-foreground/60 transition-colors hover:text-primary"
            >
              totmorgen@morgenacademy.nl
            </button>
            <a
              href="https://www.morgencompany.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/60 hover:text-primary transition-colors"
            >
              © {new Date().getFullYear()} Morgen Company
            </a>
            <Link
              to="/privacy"
              className="text-xs text-muted-foreground/60 hover:text-primary transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
