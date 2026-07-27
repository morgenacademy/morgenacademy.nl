import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACADEMY_URL, COMPANY_URL } from "@/lib/links";

// De hub-illustratie komt rechtstreeks van de company-site. Bewust niet
// gekopieerd naar deze repo: wijzigt de wereld daar, dan volgt het portaal.
const HUB_AFBEELDING = `${COMPANY_URL}/wereld/assets/echt/hub.webp`;
const HUB_BREEDTE = 1112;
const HUB_HOOGTE = 834;

const UTM = "utm_source=portal&utm_medium=referral&utm_campaign=wereld-poort";

// Query hoort voor de hash, anders slikt de browser de parameters op.
const metUtm = (pad: string) => {
  const [route, anker] = pad.split("#");
  const scheiding = route.includes("?") ? "&" : "?";
  return `${COMPANY_URL}${route}${scheiding}${UTM}${anker ? `#${anker}` : ""}`;
};

interface Hotspot {
  label: string;
  pad: string;
  beschrijving: string;
  left: string;
  top: string;
  accent?: boolean;
}

// Posities overgenomen uit wereld/index.html van de company-repo, zodat de
// punten op dezelfde plekken van de illustratie staan als daar.
const hotspots: Hotspot[] = [
  {
    label: "Trainingen",
    pad: "/academy/",
    beschrijving: "Trainingen: AI-training voor teams",
    left: "22%",
    top: "34%",
  },
  {
    label: "Implementatie",
    pad: "/consultancy/",
    beschrijving: "Implementatie: begeleiding bij het invoeren van AI",
    left: "44%",
    top: "24%",
  },
  {
    label: "AI-oplossingen",
    pad: "/technology/",
    beschrijving: "AI-oplossingen: maatwerk en automatisering",
    left: "69%",
    top: "26%",
  },
  {
    label: "Inspiratie",
    pad: "/inspiratie/",
    beschrijving: "Inspiratie: keynotes, podcast en boek",
    left: "77%",
    top: "55%",
  },
  {
    // De wereld linkt zelf naar /organisatie/#trainingwijzer-app, maar dat pad
    // staat niet in validPages van de SPA: die valt terug op home en gooit de
    // hash weg. /academy/ landt wel goed. Het scrollen naar het Kompas werkt
    // pas als de nav()-fix van branch codex/projecten op main staat.
    label: "Wegwijzer",
    pad: "/academy/#trainingwijzer-app",
    beschrijving: "Wegwijzer: vind de route die bij je past",
    left: "52%",
    top: "47%",
    accent: true,
  },
];

const PortalWereldPoort = ({ vertraging = 0 }: { vertraging?: number }) => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: vertraging }}
    className="mt-16 overflow-hidden rounded-xl bg-card/60"
  >
    <div className="relative">
      <img
        src={HUB_AFBEELDING}
        width={HUB_BREEDTE}
        height={HUB_HOOGTE}
        loading="lazy"
        alt=""
        className="block w-full"
      />

      {/* Op mobiel staan de punten als chips onder het beeld: absolute
          puntjes zijn daar onleesbaar en nauwelijks aan te tikken. */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        {hotspots.map((hotspot) => (
          <a
            key={hotspot.label}
            href={metUtm(hotspot.pad)}
            aria-label={hotspot.beschrijving}
            style={{ left: hotspot.left, top: hotspot.top }}
            className="group pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 no-underline"
          >
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 rounded-full ring-4 transition-transform duration-200 group-hover:scale-110 ${
                hotspot.accent
                  ? "bg-neon ring-neon/20"
                  : "bg-primary ring-primary/20"
              }`}
            />
            <span className="whitespace-nowrap rounded-md bg-background/70 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
              {hotspot.label}
            </span>
          </a>
        ))}
      </div>
    </div>

    <div className="p-6">
      <h2 className="font-display text-xl font-semibold text-foreground">
        Er ligt meer achter deze training
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
        Een training is vaak het begin. Daarna komt het echte werken met AI:
        implementeren in de organisatie, laten landen in het dagelijkse werk, en
        maatwerk bouwen waar dat nodig is.
      </p>

      <div className="mt-5 flex flex-wrap gap-2 sm:hidden">
        {hotspots.map((hotspot) => (
          <a
            key={hotspot.label}
            href={metUtm(hotspot.pad)}
            aria-label={hotspot.beschrijving}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium no-underline transition-colors ${
              hotspot.accent
                ? "border-neon/40 text-neon"
                : "border-border/70 text-muted-foreground"
            }`}
          >
            {hotspot.label}
          </a>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button asChild size="sm" className="gap-2">
          <a href={metUtm("/")}>
            De wereld van Morgen in
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
        <a
          href={ACADEMY_URL}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Of leer zelf verder in de Online Academy
        </a>
      </div>
    </div>
  </motion.section>
);

export default PortalWereldPoort;
