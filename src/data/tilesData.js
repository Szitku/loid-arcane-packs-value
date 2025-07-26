import { ArrowDown } from "lucide-react";
import { caviaArcaneData } from "./arcanes/caviaArcaneData";
import { duviriArcaneData } from "./arcanes/duviriArcaneData";
import { eidolonArcaneData } from "./arcanes/eidolonArcaneData";
import { holdfastsArcaneData } from "./arcanes/holdfastsArcaneData";
import { necraliskArcaneData } from "./arcanes/necraliskArcaneData";
import { ostronArcaneData } from "./arcanes/ostronArcaneData";
import { solarisArcaneData } from "./arcanes/solarisArcaneData";
import { steelArcaneData } from "./arcanes/steelArcaneData";

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
  {
    id: "holdfasts",
    label: `Holdfasts ${arcaneCollection}`,
    icon: ArrowDown,
    arcanes: holdfastsArcaneData,
  },
  {
    id: "necralisk",
    label: `Necralisk ${arcaneCollection}`,
    icon: ArrowDown,
    arcanes: necraliskArcaneData,
  },
  {
    id: "ostron",
    label: `Ostron ${arcaneCollection}`,
    icon: ArrowDown,
    arcanes: ostronArcaneData,
  },
  {
    id: "solaris",
    label: `Solaris ${arcaneCollection}`,
    icon: ArrowDown,
    arcanes: solarisArcaneData,
  },
  {
    id: "steel",
    label: `Steel ${arcaneCollection}`,
    icon: ArrowDown,
    arcanes: steelArcaneData,
  },
];
