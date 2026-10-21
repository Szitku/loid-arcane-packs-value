import { caviaArcaneData } from "./caviaArcaneData.js";
import { duviriArcaneData } from "./duviriArcaneData.js";
import { eidolonArcaneData } from "./eidolonArcaneData.js";
import { holdfastsArcaneData } from "./holdfastsArcaneData.js";
import { hollvaniaArcaneData } from "./hollvaniaArcaneData.js";
import { necraliskArcaneData } from "./necraliskArcaneData.js";
import { ostronArcaneData } from "./ostronArcaneData.js";
import { solarisArcaneData } from "./solarisArcaneData.js";
import { steelArcaneData } from "./steelArcaneData.js";

// Rank 0 yields, verified against https://wiki.warframe.com/w/Vosfor.
// Yields depend on the Arcane's source, not just its displayed rarity.
const sources = [
  [caviaArcaneData, { uncommon: 18, rare: 24, legendary: 84 }],
  [duviriArcaneData, { uncommon: 18, rare: 24, legendary: 84 }],
  [eidolonArcaneData, { common: 14, uncommon: 21, rare: 28, legendary: 98 }],
  [holdfastsArcaneData, { rare: 22 }],
  [hollvaniaArcaneData, { rare: 24, legendary: 84 }],
  [necraliskArcaneData, { rare: 24 }],
  [ostronArcaneData, { common: 12, uncommon: 18, rare: 24 }],
  [solarisArcaneData, { common: 12, uncommon: 18, rare: 24 }],
  [steelArcaneData, { rare: 20 }],
];

export const vosforByArcane = new Map(
  sources.flatMap(([arcanes, yields]) =>
    arcanes.map((arcane) => [arcane.id, yields[arcane.rarity] ?? null]),
  ),
);

// Pax Arcanes have a different yield from other rare Solaris Arcanes.
for (const id of ["pax_bolt", "pax_charge", "pax_seeker", "pax_soar"]) {
  vosforByArcane.set(id, 36);
}
vosforByArcane.set("exodia_contagion", 0);
vosforByArcane.set("exodia_epidemic", 0);
