import type { EconomicIndicator, EconomicIndicatorsEntity } from "../shared/interfaces/IEconomicIndicators"
import { api } from "./apiSetting"

interface getIndicatorsParams {
    countries?:string[],
    initDate?:string|undefined,
    endDate?:string|undefined
}

export const fetchIndicators = ({countries=[], endDate, initDate}:getIndicatorsParams)=>{
    return new Promise<EconomicIndicator[]>((resolve, reject)=>{
        let url ='/economic-indicators'; 

        if(countries.length > 0){   
            const arr_countries = countries.map((value)=>`countries=${value}`)
            url = `${url}${!url.includes("?")?"?":'&'}${arr_countries.join("&")}`
        }
        if(endDate)
            url = `${url}${!url.includes("?")?"?":'&'}end_year=${endDate.substring(0,4)}`
        if(initDate)
            url = `${url}${!url.includes("?")?"?":'&'}start_year=${initDate.substring(0,4)}`

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