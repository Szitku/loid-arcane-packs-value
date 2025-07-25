import { ArrowDown } from "lucide-react";
import { caviaArcanesData } from "./arcanes/caviaArcanesData";

const arcaneCollection = "Arcane Collection";

export const tiles = [
  {
    id: "cavia",
    label: `Cavia ${arcaneCollection}`,
    icon: ArrowDown,
    arcanes: caviaArcanesData,
  },
  { id: "duviri", label: `Duviri ${arcaneCollection}`, icon: ArrowDown },
  { id: "eidolon", label: `Eidolon ${arcaneCollection}`, icon: ArrowDown },
  { id: "holdfasts", label: `Holdfasts ${arcaneCollection}`, icon: ArrowDown },
  { id: "necralisk", label: `Necralisk ${arcaneCollection}`, icon: ArrowDown },
  { id: "ostron", label: `Ostron ${arcaneCollection}`, icon: ArrowDown },
  { id: "solaris", label: `Solaris ${arcaneCollection}`, icon: ArrowDown },
  { id: "steel", label: `Steel ${arcaneCollection}`, icon: ArrowDown },
];
