import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  ArrowRight,
  Sparkles,
  Bell,
  Users,
  Clock,
  Menu,
  X,
  CalendarDays,
  MapPin,
  Monitor,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";
import { liveSessions, type LiveSession } from "@/data/liveSessions";
import WaitlistDialog from "@/components/WaitlistDialog";
import ContactDialog from "@/components/ContactDialog";
import LiveSessionSignupDialog from "@/components/LiveSessionSignupDialog";
import { cn } from "@/lib/utils";
import { getDaypartGreeting } from "@/lib/daypartGreeting";

const headerLinks = [
  {
    label: "Online trainingen",
    href: "/",
    kind: "route",
    active: true,
  },
  {
    label: "Live agenda",
    href: "#live-agenda",
    kind: "anchor",
  },
  {
    label: "Incompany trainingen",
    href: "https://morgencompany.com/academy",
    kind: "external",
  },
  {
    label: "Implement",
    href: "https://morgencompany.com/consultancy",
    kind: "external",
  },
  {
    label: "Build",
    href: "https://morgencompany.com/technology",
    kind: "external",
  },
  {
    label: "Get inspired",
    href: "https://morgencompany.com/company",
    kind: "external",
  },
] as const;

const footerColumns = [
  {
    title: "Academy",
    links: [
      { label: "Online trainingen", href: "/", kind: "route" },
      { label: "Live agenda", href: "#live-agenda", kind: "anchor" },
      { label: "Incompany trainingen", href: "https://morgencompany.com/academy", kind: "external" },
      { label: "Inloggen", href: "/login", kind: "route" },
    ],
  },
  {
    title: "Build & Implement",
    links: [
      { label: "Digitale oplossingen", href: "https://morgencompany.com/technology/", kind: "external" },
      { label: "Procesautomatisering", href: "https://morgencompany.com/technology/", kind: "external" },
      { label: "Digitale strategie", href: "https://morgencompany.com/consultancy/", kind: "external" },
      { label: "Projecten", href: "https://morgencompany.com/projecten/", kind: "external" },
    ],
  },
  {
    title: "Company & Info",
    links: [
      { label: "Over Morgen.", href: "https://morgencompany.com/about/", kind: "external" },
      { label: "Keynote boeken", href: "https://morgencompany.com/company/#cp-keynote", kind: "external" },
      { label: "Podcast, artikelen en boek", href: "https://morgencompany.com/company/#cp-verdieping", kind: "external" },
      { label: "totmorgen@morgenacademy.nl", href: "mailto:totmorgen@morgenacademy.nl", kind: "external" },
    ],
  },
] as const;

const formatSessionDate = (startsAt: string, endsAt: string) => {
  const start = parseISO(startsAt);
  const end = parseISO(endsAt);

  return {
    day: format(start, "d", { locale: nl }),
    month: format(start, "LLL", { locale: nl }),
    fullDate: format(start, "EEEE d MMMM", { locale: nl }),
    time: `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`,
  };
};

const Landing = () => {
  const navigate = useNavigate();
  const [daypartGreeting, setDaypartGreeting] = useState(() => getDaypartGreeting());
  const [waitlistCourse, setWaitlistCourse] = useState<{ id: string; title: string } | null>(null);
  const [selectedLiveSession, setSelectedLiveSession] = useState<LiveSession | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDaypartGreeting(getDaypartGreeting());
    }, 60 * 1000);

    return () => window.clearInterval(interval);
  }, []);

  const renderHeaderLink = (item: typeof headerLinks[number], mobile = false) => {
    const className = cn(
      mobile
        ? "rounded-lg px-3 py-2.5 text-[0.82rem] font-bold uppercase tracking-[0.12em] transition-colors duration-200"
        : "text-[0.82rem] font-bold uppercase tracking-[0.12em] transition-colors duration-200 whitespace-nowrap",
      item.active ? "text-white" : "text-[#D8CCEC] hover:text-white",
    );

    if (item.kind === "route") {
      return (
        <Link
          key={item.label}
          to={item.href}
          onClick={mobile ? () => setMobileNavOpen(false) : undefined}
          className={className}
          aria-current={item.active ? "page" : undefined}
        >
          {item.label}
        </Link>
      );
    }

    if (item.kind === "anchor") {
      return (
        <a
          key={item.label}
          href={item.href}
          onClick={mobile ? () => setMobileNavOpen(false) : undefined}
          className={className}
        >
          {item.label}
        </a>
      );
    }

    return (
      <a
        key={item.label}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={mobile ? () => setMobileNavOpen(false) : undefined}
        className={className}
      >
        {item.label}
      </a>
    );
  };

  const renderFooterLink = (link: typeof footerColumns[number]["links"][number]) => {
    if (link.kind === "route") {
      return (
        <Link
          key={link.label}
          to={link.href}
          className="text-sm text-[#9F97B9] transition-colors hover:text-white"
        >
          {link.label}
        </Link>
      );
    }

    const externalProps =
      link.kind === "external" && !link.href.startsWith("mailto:")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {};

    return (
      <a
        key={link.label}
        href={link.href}
        className="text-sm text-[#9F97B9] transition-colors hover:text-white"
        {...externalProps}
      >
        {link.label}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Nav — morgencompany.com style */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16 transition-all duration-300",
          scrolled
            ? "h-16 bg-white/[0.08] backdrop-blur-[40px] backdrop-saturate-200 border-b border-white/[0.18]"
            : "h-[72px]",
        )}
      >
        {/* Logo */}
        <a
          href="https://www.morgenacademy.nl/"
          className="font-display text-[1.5rem] font-black uppercase tracking-[0.1em] text-white shrink-0"
        >
          MORGEN<span className="text-[#d8fe56] font-black not-italic">.</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          {headerLinks.map((item) => renderHeaderLink(item))}

          <Link
            to="/login"
            className="ml-1 inline-flex items-center rounded-[20px] bg-gradient-to-br from-[#d8fe56] to-[#b8e040] px-5 py-2 text-[0.88rem] font-bold text-[#1A1A2E] shadow-[0_4px_16px_rgba(216,254,86,0.3)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(216,254,86,0.45)]"
          >
            Inloggen
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-[20px] border border-white/[0.18] bg-white/[0.08] text-white"
        >
          {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        {/* Mobile dropdown */}
        {mobileNavOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 flex flex-col gap-1 rounded-[20px] border border-white/[0.18] bg-[rgba(12,8,24,0.97)] backdrop-blur-[40px] backdrop-saturate-200 p-4 lg:hidden">
            {headerLinks.map((item) => renderHeaderLink(item, true))}
            <Link
              to="/login"
              onClick={() => setMobileNavOpen(false)}
              className="mt-1 flex items-center justify-center rounded-[20px] bg-gradient-to-br from-[#d8fe56] to-[#b8e040] px-5 py-2.5 text-[0.88rem] font-bold text-[#1A1A2E]"
            >
              Inloggen
            </Link>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-[72px]" />

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
            {daypartGreeting}
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-foreground md:text-5xl lg:text-6xl">
            Leer werken met AI & automatisering
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Praktische videotrainingen waarmee je direct aan de slag kunt.
            Leer op je eigen tempo, waar en wanneer je wilt.
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
              className={`group overflow-hidden rounded-xl border border-border bg-card transition-colors ${
                course.comingSoon ? "opacity-70" : "cursor-pointer hover:border-primary/40"
              }`}
              onClick={
                course.comingSoon ? undefined : () => navigate(`/checkout/${course.id}`)
              }
              onKeyDown={
                course.comingSoon
                  ? undefined
                  : (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(`/checkout/${course.id}`);
                      }
                    }
              }
              role={course.comingSoon ? undefined : "link"}
              tabIndex={course.comingSoon ? undefined : 0}
              aria-label={course.comingSoon ? undefined : `Ga naar ${course.title}`}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className={`h-full w-full object-cover transition-transform duration-500 ${
                    course.comingSoon ? "grayscale" : "group-hover:scale-105"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-2xl font-semibold text-white">
                    {course.title}
                  </h3>
                  <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-white/80">
                    {course.subtitle}
                  </p>
                </div>
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
                {course.comingSoon ? (
                  <div>
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
                  <div className="flex flex-wrap items-center gap-4">
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
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/checkout/${course.id}`);
                      }}
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

      {/* Live agenda */}
      <section id="live-agenda" className="mx-auto max-w-6xl scroll-mt-28 px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">
              Live agenda
            </p>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Summer School kalender
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              De Summer School start op 1 juli en loopt twee maanden. Voor € 250 krijg je online toegang
              tot al onze live trainingen, de KickOff en iedere twee weken een live webinar. De webinars
              staan in het teken van zelf leren en vragen stellen, en je houdt oneindig toegang tot de opnames.
            </p>
          </div>
          <a
            href="#trainingen"
            className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
          >
            Bekijk online trainingen
          </a>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_1.45fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,rgba(200,80,216,0.18),rgba(21,21,62,0.92)_34%,rgba(14,14,48,1)_100%)] p-7 md:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(216,254,86,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(124,53,201,0.26),transparent_42%)]" />
            <div className="relative">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#D8CCEC]">
                Summer School
              </div>
              <h3 className="mt-5 max-w-sm font-display text-3xl font-semibold leading-none text-white">
                Twee maanden online leren voor € 250
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#D8CCEC]">
                Start op woensdag 1 juli met de KickOff. Daarna schuif je iedere twee weken online aan
                voor een live webinar op basis van thema's, vragen en wat je zelf wilt leren.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#D8CCEC]">Start</p>
                  <p className="mt-2 font-display text-2xl text-white">1 juli</p>
                  <p className="mt-1 text-xs text-[#D8CCEC]">KickOff live online</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#D8CCEC]">Duur</p>
                  <p className="mt-2 font-display text-2xl text-white">2 maanden</p>
                  <p className="mt-1 text-xs text-[#D8CCEC]">KickOff + webinars</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#D8CCEC]">Toegang</p>
                  <p className="mt-2 font-display text-2xl text-white">Oneindig</p>
                  <p className="mt-1 text-xs text-[#D8CCEC]">Ook tot de webinars</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="gap-2 text-sm uppercase tracking-wider"
                  onClick={() => setSelectedLiveSession(liveSessions[0])}
                >
                  Boek Summer School
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-sm uppercase tracking-wider"
                  onClick={() => setSelectedLiveSession(liveSessions[0])}
                >
                  Stel je vraag
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            {liveSessions.map((session, index) => {
              const sessionDate = formatSessionDate(session.startsAt, session.endsAt);

              return (
                <motion.article
                  key={session.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="group rounded-[28px] border border-white/10 bg-card/90 p-5 shadow-[0_24px_80px_-50px_rgba(0,0,0,0.8)] transition-colors hover:border-primary/25"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start">
                    <div className="flex w-fit shrink-0 items-center gap-4 rounded-[22px] border border-white/10 bg-background/60 px-4 py-3">
                      <div>
                        <p className="text-[0.68rem] uppercase tracking-[0.25em] text-[#D8CCEC]">
                          {sessionDate.month}
                        </p>
                        <p className="font-display text-4xl leading-none text-white">
                          {sessionDate.day}
                        </p>
                      </div>
                      <div className="h-10 w-px bg-white/10" />
                      <div className="text-xs uppercase tracking-[0.2em] text-[#D8CCEC]">
                        <p>{sessionDate.time}</p>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary">
                          {session.formatLabel}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#D8CCEC]">
                          {session.supportLabel}
                        </span>
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold text-white">
                        {session.title}
                      </h3>
                      <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
                        {session.summary}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-[#D8CCEC]">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5 text-primary" />
                          <span className="capitalize">{sessionDate.fullDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Monitor className="h-3.5 w-3.5 text-primary" />
                          <span>{session.audience}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span>{session.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full shrink-0 flex-col gap-3 md:w-[180px]">
                      <div className="rounded-[22px] border border-white/10 bg-background/60 px-4 py-3 text-center">
                        <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#D8CCEC]">Plekken</p>
                        <p className="mt-2 font-display text-3xl leading-none text-white">
                          {session.seatsLeft}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">{session.priceLabel}</p>
                      </div>
                      <Button className="w-full gap-2" onClick={() => setSelectedLiveSession(session)}>
                        Doe mee
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <a
                        href="mailto:totmorgen@morgenacademy.nl?subject=Summer%20School"
                        className="text-center text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                      >
                        Summer School inbegrepen
                      </a>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
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
                <a href="https://morgencompany.com/academy" target="_blank" rel="noopener noreferrer">
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
      <LiveSessionSignupDialog
        open={!!selectedLiveSession}
        onOpenChange={(open) => !open && setSelectedLiveSession(null)}
        session={selectedLiveSession}
      />
      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[rgba(6,4,14,0.96)] py-14 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 border-b border-white/10 pb-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div>
              <a
                href="https://www.morgenacademy.nl/"
                className="font-display text-[1.5rem] font-black uppercase tracking-[0.1em] text-white"
              >
                MORGEN<span className="text-[#d8fe56] font-black not-italic">.</span>
              </a>
              <p className="mt-5 max-w-[32ch] text-[0.95rem] leading-7 text-[#9F97B9]">
                Morgen Academy is het trainingsplatform van{" "}
                <a
                  href="https://morgencompany.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white transition-colors hover:text-[#d8fe56]"
                >
                  Morgen
                </a>
                .
              </p>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-5 text-[1rem] font-extrabold uppercase tracking-[0.06em] text-white">
                  {column.title}
                </h3>
                <div className="flex flex-col gap-3">
                  {column.links.map((link) => renderFooterLink(link))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 pt-6 text-xs text-[#7E7896] sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Morgen Academy. Alle rechten voorbehouden.</p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://morgencompany.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                Morgen Company
              </a>
              <Link to="/privacy" className="transition-colors hover:text-white">
                Privacybeleid
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
