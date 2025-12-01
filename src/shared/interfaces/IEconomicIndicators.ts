export interface EconomicIndicatorsEntity {
    input_code:string,
    description:string
}

export interface EconomicIndicator{
    period:number,
    period_type:'year',
    country:string
    indicators:IIndicator[]
}

export interface IIndicator{
    code:string,
    value:number
}