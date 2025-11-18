import { useEffect, useState } from "react";
import { fetchGames } from "../api/games";
import { EnumMonthName } from "../shared/enumMonthName";
import type { IGame } from "../shared/interfaces/IGame";
import { useGameStore, usePresentationGame } from "../stores/games";
import DateFilter from "./components/filters/date";

export default function Home(){
    const {games, setGames} = useGameStore()
    const [selectedGame, setSelectedGame] = useState<IGame|undefined>(undefined)
    const {presentationGameHistories, setPresentationGameHistories} = usePresentationGame()
    const [gamesDate,setGamesDate] = useState<string[]>([])
    const [dayFilter, setDayFilter] = useState(['Todos'])
    const [monthFilter, setMonthFilter] = useState(['Todos'])
    const [yearFilter, setYearFilter] = useState(['Todos'])
    
    useEffect(()=>{
        fetchGames()
        .then((data)=>{ 
            setGames(data)
            setSelectedGame(data[0])
            setPresentationGameHistories(data[0].prices)
            setGamesDate(data[0].prices.map(({timestamp})=>timestamp))
        })
        .catch((error)=>console.log(error))
    },[])

    useEffect(()=>{
        if(gamesDate.length === 0 || !selectedGame) return;
        
        const years = yearFilter.includes('Todos')? gamesDate:
            gamesDate.filter((date)=>yearFilter.includes(date.substring(0,4)));
        const month = monthFilter.includes('Todos')? gamesDate:
            gamesDate.filter((date)=>monthFilter.includes(EnumMonthName[Number.parseInt(date.substring(5,7))]))
        const day = dayFilter.includes('Todos')? gamesDate:
            gamesDate.filter((date)=>dayFilter.includes(date.substring(8,10)));

        setPresentationGameHistories(selectedGame.prices.filter(({timestamp})=>{
            const histDate = new Date(timestamp);
            histDate.setHours(0,0,0,0);
            return years.includes(histDate.toISOString()) 
            && month.includes(histDate.toISOString()) 
            && day.includes(histDate.toISOString());
        }))
    },[dayFilter,monthFilter,yearFilter])


    return (
        <main className='w-full h-full flex flex-col'>
            <section>
                <DateFilter
                    period="Ano"
                    gameDates={gamesDate}
                    setSelectedOptions={setYearFilter}
                />
                <DateFilter
                    period="Mês"
                    gameDates={gamesDate}
                    setSelectedOptions={setMonthFilter}
                />
                <DateFilter
                    period="Dia"
                    gameDates={gamesDate}
                    setSelectedOptions={setDayFilter}
                />
            </section>
            {/* {games.length > 0 &&
            (
                <>
                    <AreaChart 
                        games={games}
                    />
                    <LineChart
                        games={games}
                    />
                </>
            )} */}
        </main>
    )
}