import { Helmet } from "react-helmet-async";

const SITE_URL = "https://academy.morgencompany.com";
const DEFAULT_TITLE =
  "Morgen Academy | Online trainingen over AI en automatisering";
const DEFAULT_DESCRIPTION =
  "Praktische videotrainingen waarmee je direct aan de slag kunt met AI en automatisering. Leer op je eigen tempo, waar en wanneer je wilt.";

type SeoProps = {
  /** Volledige <title>. */
  title?: string;
  /** Meta description. */
  description?: string;
  /** Pad t.o.v. de site-root, bijv. "/ai-accelerator". Bepaalt de canonical. */
  path?: string;
};

/**
 * Zet per pagina een unieke title, description en canonical, plus de
 * bijbehorende Open Graph- en Twitter-tags. Voorkomt duplicate-content omdat
 * elke route anders een identieke shell-title en -canonical zou delen.
 */
const Seo = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "/",
}: SeoProps) => {
  const canonical = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default Seo;
