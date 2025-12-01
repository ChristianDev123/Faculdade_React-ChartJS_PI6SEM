import type { IGame, IGameEntity } from "../shared/interfaces/IGame";
import { api } from "./apiSetting";

export const fetchGames = (gameId:string) => {
    return new Promise<IGame[]>((resolve, reject)=>{
        api.get(`/prices?game_id=${gameId}`)
        .then(({data})=>{
            if(!Array.isArray(data))
                resolve([data])
            resolve(data)
        })
        .catch((error)=>reject(error))    
    })
}

export const fetchGamesList = ()=>{
    return new Promise<IGameEntity[]>((resolve, reject)=>{
        api.get("/games_list")
        .then(({data})=>resolve(data))
        .catch((error)=>reject(error))

    })
}