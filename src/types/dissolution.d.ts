/**
 * Type contracts for Arcane dissolution calculations and market comparisons.
 */

export type RankStrategy = "unranked" | "maxed";

export interface ArcaneValuation {
  average: number;
  volume: number;
  perCopy?: number;
  weightedValue?: number;
}

export interface ArcaneData {
  id: string;
  name: string;
  rarity: "common" | "uncommon" | "rare" | "legendary" | (string & {});
  maxRank?: number;
  copiesToMax?: number;
  weight?: number;
  valuations?: {
    unranked?: ArcaneValuation;
    maxed?: ArcaneValuation;
  };
}

export interface PackTarget {
  id: string;
  label: string;
  vosforCost: number;
  packValue: number;
}

export interface PackComparison extends PackTarget {
  expectedValue: number | null;
  gain: number | null;
  perCopy: {
    expectedValue: number | null;
    gain: number | null;
  };
}

export interface DissolutionRankResult {
  copies: number;
  vosfor: number | null;
  sellValue: number | null;
  perCopy: {
    vosfor: number | null;
    sellValue: number | null;
  };
  comparisons: PackComparison[];
  profitablePacks: PackComparison[];
  best: PackComparison | null;
}

export interface DissolutionDualResult {
  unranked: DissolutionRankResult;
  maxed: DissolutionRankResult;
}

export interface DissolutionTile {
  id: string;
  label: string;
  vosforCost: number;
  [key: string]: unknown;
}

export interface CollectionStrategyValue {
  packValue: number;
  [key: string]: unknown;
}

export interface DissolutionAdvisorProps {
  tiles: DissolutionTile[];
  fetchedArcanes: Map<string, ArcaneData[]>;
  weightedCollections: Map<string, Record<RankStrategy, CollectionStrategyValue>>;
  onScanAll?: () => void;
  isScanningAll?: boolean;
}

/**
 * Calculates Vosfor yields, pack conversion expected values, and profit gains.
 */
export function calculateDissolutionValues(
  arcane: ArcaneData,
  packs: PackTarget[],
  rank: "unranked" | "maxed",
): DissolutionRankResult;

export function calculateDissolutionValues(
  arcane: ArcaneData,
  packs: PackTarget[],
  rank?: null,
): DissolutionDualResult;

export default calculateDissolutionValues;
