import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PortalWereldPoort from "./PortalWereldPoort";

// Elke hotspot staat twee keer in de DOM: als punt op de illustratie (desktop)
// en als chip eronder (mobiel). CSS toont er altijd maar een van.
const hrefsVoor = (beschrijving: string) =>
  screen
    .getAllByLabelText(beschrijving)
    .map((element) => element.getAttribute("href"));

describe("PortalWereldPoort", () => {
  const bestemmingen: [string, string][] = [
    ["Trainingen: AI-training voor teams", "https://morgencompany.com/academy/"],
    [
      "Implementatie: begeleiding bij het invoeren van AI",
      "https://morgencompany.com/consultancy/",
    ],
    [
      "AI-oplossingen: maatwerk en automatisering",
      "https://morgencompany.com/technology/",
    ],
    [
      "Inspiratie: keynotes, podcast en boek",
      "https://morgencompany.com/inspiratie/",
    ],
    [
      "Wegwijzer: vind de route die bij je past",
      "https://morgencompany.com/academy/",
    ],
  ];

  it("wijst alle vijf hotspots naar de juiste hoek van de company-site", () => {
    render(<PortalWereldPoort />);

    for (const [beschrijving, bestemming] of bestemmingen) {
      const hrefs = hrefsVoor(beschrijving);
      expect(hrefs).toHaveLength(2);
      for (const href of hrefs) {
        expect(href).toContain(bestemming);
      }
    }
  });

  it("geeft elke uitgaande link de utm-parameters mee", () => {
    render(<PortalWereldPoort />);

    for (const [beschrijving] of bestemmingen) {
      for (const href of hrefsVoor(beschrijving)) {
        expect(href).toContain("utm_source=portal");
        expect(href).toContain("utm_medium=referral");
        expect(href).toContain("utm_campaign=wereld-poort");
      }
    }

    expect(
      screen.getByRole("link", { name: /De wereld van Morgen in/ }),
    ).toHaveAttribute(
      "href",
      "https://morgencompany.com/?utm_source=portal&utm_medium=referral&utm_campaign=wereld-poort",
    );
  });

  it("zet de query voor de hash zodat het anker naar het Kompas blijft werken", () => {
    render(<PortalWereldPoort />);

    for (const href of hrefsVoor("Wegwijzer: vind de route die bij je past")) {
      expect(href).toBe(
        "https://morgencompany.com/academy/?utm_source=portal&utm_medium=referral&utm_campaign=wereld-poort#trainingwijzer-app",
      );
    }
  });
});
