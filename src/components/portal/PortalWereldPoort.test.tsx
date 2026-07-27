import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PortalWereldPoort from "./PortalWereldPoort";

const hrefVoor = (beschrijving: string) =>
  screen.getByLabelText(beschrijving).getAttribute("href");

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
    ["Wegwijzer: vind de route die bij je past", "https://morgencompany.com/?"],
  ];

  it("wijst alle vijf hotspots naar de juiste hoek van de company-site", () => {
    render(<PortalWereldPoort />);

    for (const [beschrijving, bestemming] of bestemmingen) {
      expect(hrefVoor(beschrijving)).toContain(bestemming);
    }
  });

  it("geeft elke uitgaande link de utm-parameters mee", () => {
    render(<PortalWereldPoort />);

    for (const [beschrijving] of bestemmingen) {
      const href = hrefVoor(beschrijving);
      expect(href).toContain("utm_source=portal");
      expect(href).toContain("utm_medium=referral");
      expect(href).toContain("utm_campaign=wereld-poort");
    }

    expect(
      screen.getByRole("link", { name: /De wereld van Morgen in/ }),
    ).toHaveAttribute(
      "href",
      "https://morgencompany.com/?utm_source=portal&utm_medium=referral&utm_campaign=wereld-poort",
    );
  });

  it("zet de query voor de hash zodat de wereld de route #wegwijzer nog leest", () => {
    render(<PortalWereldPoort />);

    expect(hrefVoor("Wegwijzer: vind de route die bij je past")).toBe(
      "https://morgencompany.com/?utm_source=portal&utm_medium=referral&utm_campaign=wereld-poort#wegwijzer",
    );
  });
});
