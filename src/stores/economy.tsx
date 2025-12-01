import { create } from "zustand";
import type { EconomicIndicator } from "../shared/interfaces/IEconomicIndicators";

interface EconomyState{
    indicators: EconomicIndicator[],
    setIndicators: (indicators:EconomicIndicator[])=> void
}

export const useEconIndicators = create<EconomyState>((set)=>({
    indicators:[],
    setIndicators: (indicators:EconomicIndicator[])=>set(()=>({indicators}))
}))