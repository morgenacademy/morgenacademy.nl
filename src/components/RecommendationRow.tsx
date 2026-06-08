import { motion } from "framer-motion";
import { ArrowRight, Headphones, Lock, PlayCircle, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import type { RecommendationItem } from "@/data/recommendations";

interface RecommendationRowProps {
  title?: string;
  subtitle?: string;
  items: RecommendationItem[];
  className?: string;
}

const RecommendationCard = ({ item, index }: { item: RecommendationItem; index: number }) => {
  const isExternal = item.href.startsWith("http");
  const isPodcast = item.kind === "podcast";
  const content = (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group h-full min-w-[240px] overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/35 hover:shadow-[0_20px_50px_-30px_hsl(var(--primary)/0.35)] sm:min-w-[280px]"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className={`h-full w-full object-cover transition-transform duration-500 ${
            item.comingSoon ? "grayscale" : "group-hover:scale-105"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-sm">
          {isPodcast ? <Headphones className="h-3 w-3 text-primary" /> : <PlayCircle className="h-3 w-3 text-primary" />}
          {isPodcast ? "Podcast" : "Training"}
        </div>
        {item.comingSoon && (
          <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-secondary/90 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-sm">
            <Lock className="h-3 w-3 text-primary" />
            Binnenkort
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-display text-lg font-semibold leading-tight text-white">
            {item.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/78">
            {item.subtitle}
          </p>
        </div>
      </div>

      <div className="flex min-h-[72px] items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          {item.price && !item.comingSoon && (
            <p className="text-sm font-semibold text-primary">
              € {parseFloat(item.price).toFixed(2).replace(".", ",")}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {isPodcast ? "Audio om verder te verdiepen" : item.comingSoon ? "Nog in ontwikkeling" : "Online leerproduct"}
          </p>
        </div>
        <span className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground transition-transform group-hover:translate-x-0.5">
          {isPodcast ? <Headphones className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
          {item.cta}
        </span>
      </div>
    </motion.article>
  );

  if (item.comingSoon) {
    return <div>{content}</div>;
  }

  if (isExternal) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    );
  }

  return (
    <Link to={item.href} className="block h-full">
      {content}
    </Link>
  );
};

const RecommendationRow = ({
  title = "Dit is mogelijk ook iets voor jou",
  subtitle = "Ga makkelijk door naar een volgende training, verdieping of podcast.",
  items,
  className = "",
}: RecommendationRowProps) => {
  if (items.length === 0) return null;

  return (
    <section className={className}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary">
            Aanbevolen
          </p>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        </div>
        <ArrowRight className="hidden h-5 w-5 text-muted-foreground sm:block" />
      </div>
      <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-3 [scrollbar-width:thin]">
        {items.map((item, index) => (
          <RecommendationCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
};

export default RecommendationRow;
