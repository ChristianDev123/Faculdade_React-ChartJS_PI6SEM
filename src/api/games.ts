import type { IGame } from "../shared/interfaces/IGame";
import { api } from "./apiSetting";

export const fetchGames = () => {
    return new Promise<IGame[]>((resolve, reject)=>{
        api.get('/prices')
        .then(({data})=>{
            if(!Array.isArray(data))
                resolve([data])
            resolve(data)
        })
        .catch((error)=>reject(error))    
    })
}