import { create } from "zustand";
import type { IGame, IHistory } from "../shared/interfaces/IGame";

interface GameState{
    games:IGame|null,
    setGames:(games:IGame)=>void
}

interface PresentationGameHistoryState{
    presentationGameHistories:IHistory[],
    setPresentationGameHistories:(histories:IHistory[])=>void
}

export const useGameStore = create<GameState>((set)=>({
    games:null,
    setGames:(games)=>set(()=>({games})),
}))

export const usePresentationGame = create<PresentationGameHistoryState>((set)=>({
    presentationGameHistories:[],
    setPresentationGameHistories:(histories)=>set(()=>({presentationGameHistories:histories}))
})) 