import type { EconomicIndicatorsEntity } from "../shared/interfaces/IEconomicIndicators"
import { api } from "./apiSetting"

export const fetchIndicatorsList = ()=>{
    return new Promise<EconomicIndicatorsEntity[]>((resolve, reject)=>{
        api.get("/indicators_list")
        .then(({data})=>{resolve(data)})
        .catch((e)=>reject(e))
    })
}

export const fetchCountriesList = ()=>{
    return new Promise<EconomicIndicatorsEntity[]>((resolve, reject)=>{
        api.get("/countries_list")
        .then(({data})=>resolve(data))
        .catch((e)=>reject(e))
    })
}