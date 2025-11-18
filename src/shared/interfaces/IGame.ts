interface IPeriod{
    amount:number,
    amountInt:number,
    currency:string
}

interface IPrice {
    price:IPeriod
    regular:IPeriod
    cut:number
}

export interface IHistory {
    timestamp:string
    shop:IShop
    deal:IPrice
}

export interface IShop {
    id:number
    name:string
}

export interface IGame {
    game_id:string
    last_updated:string
    prices:IHistory[]
}