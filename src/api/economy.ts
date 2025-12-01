import type { EconomicIndicator, EconomicIndicatorsEntity } from "../shared/interfaces/IEconomicIndicators"
import { api } from "./apiSetting"

export const fetchIndicators = (indicators:string[]=[], countries:string[]=[])=>{
    return new Promise<EconomicIndicator[]>((resolve, reject)=>{
        let url ='/economic-indicators'; 
        if(indicators.length > 0) {
            const arr_indicators = countries.map((value)=>`indicators=${value}`)
            url = `${url}?${arr_indicators.join("&")}`
        }
        if(countries.length > 0){   
            const arr_countries = countries.map((value)=>`countries=${value}`)
            url = `${url}${!url.includes("?")?"?":'&'}${arr_countries.join("&")}`
        }
        api.get(url)
        .then(({data:{data}})=>resolve(data))
        .catch((e)=>reject(e))
    })
}

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