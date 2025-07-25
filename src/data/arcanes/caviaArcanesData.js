import { Rarity } from "./enum/Rarity";

export const caviaArcanesData = [
  {
    id: "melee_fortification",
    rarity: Rarity.UNCOMMON,
    weight: 0.225,
    maxRank: 5,
  },
  {
    id: "melee_retaliation",
    rarity: Rarity.UNCOMMON,
    weight: 0.225,
    maxRank: 5,
  },
  { id: "melee_animosity", rarity: Rarity.RARE, weight: 0.125, maxRank: 5 },
  { id: "melee_exposure", rarity: Rarity.RARE, weight: 0.125, maxRank: 5 },
  { id: "melee_influence", rarity: Rarity.RARE, weight: 0.125, maxRank: 5 },
  { id: "melee_vortex", rarity: Rarity.RARE, weight: 0.125, maxRank: 5 },
  {
    id: "melee_crescendo",
    rarity: Rarity.LEGENDARY,
    weight: 0.025,
    maxRank: 5,
  },
  {
    id: "melee_duplicate",
    rarity: Rarity.LEGENDARY,
    weight: 0.025,
    maxRank: 5,
  },
];
