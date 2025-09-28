import { create } from "zustand";
import type { IGame } from "../shared/interfaces/IGame";

interface GameState{
    games:IGame[],
    setGames:(games:IGame[])=>void
}


export const useGameStore = create<GameState>((set)=>({
    games:[],
    setGames:(games)=>set(()=>({games}))
}))