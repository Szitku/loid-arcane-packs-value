import { ArrowDown } from "lucide-react";
import { caviaArcaneData } from "./arcanes/caviaArcaneData";
import { duviriArcaneData } from "./arcanes/duviriArcaneData";
import { eidolonArcaneData } from "./arcanes/eidolonArcaneData";

const arcaneCollection = "Arcane Collection";

export const tiles = [
  {
    id: "cavia",
    label: `Cavia ${arcaneCollection}`,
    icon: ArrowDown,
    arcanes: caviaArcaneData,
  },
  {
    id: "duviri",
    label: `Duviri ${arcaneCollection}`,
    icon: ArrowDown,
    arcanes: duviriArcaneData,
  },
  {
    id: "eidolon",
    label: `Eidolon ${arcaneCollection}`,
    icon: ArrowDown,
    arcanes: eidolonArcaneData,
  },
  { id: "holdfasts", label: `Holdfasts ${arcaneCollection}`, icon: ArrowDown },
  { id: "necralisk", label: `Necralisk ${arcaneCollection}`, icon: ArrowDown },
  { id: "ostron", label: `Ostron ${arcaneCollection}`, icon: ArrowDown },
  { id: "solaris", label: `Solaris ${arcaneCollection}`, icon: ArrowDown },
  { id: "steel", label: `Steel ${arcaneCollection}`, icon: ArrowDown },
];
