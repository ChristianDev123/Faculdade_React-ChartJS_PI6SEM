import { useEffect, useState } from "react";
import Mockdata from "../api/mockdata.json";
import type { IGame } from "../shared/interfaces/IGame";
import { useGameStore } from "../stores/games";
import AreaChart from "./components/charts/area";
import DateFilter from "./components/filters/date";
import { EnumMonthName } from "../shared/enumMonthName";
import LineChart from "./components/charts/line";

export default function Home(){
    const {games, setGames} = useGameStore()
    const [gamesDate,setGamesDate] = useState<string[]>([])
    const [dayFilter, setDayFilter] = useState(['Todos'])
    const [monthFilter, setMonthFilter] = useState(['Todos'])
    const [yearFilter, setYearFilter] = useState(['Todos'])
    
    useEffect(()=>{
        const data = Mockdata.map<IGame>((game)=>(
            {
                data:game.timestamp.substring(0,10),
                discontoNaData: Number(game.discount_cut),
                loja:game.shop_name,
                lojaId:Number(game.shop_id),
                precoNaData: Number(game.price_amount),
                precoRegular:Number(game.regular_amount),
                moeda:game.price_currency,
            }
        ))
        setGamesDate(data.map(({data})=>{
            const date = new Date(data);
            date.setHours(0,0,0,0);
            return date.toISOString()
        }))
        setGames(data)
    },[])

    useEffect(()=>{
        if(gamesDate.length === 0) return;

        const data = Mockdata.map<IGame>((game)=> (
            {
                data:game.timestamp.substring(0,10),
                discontoNaData: Number(game.discount_cut),
                loja:game.shop_name,
                lojaId:Number(game.shop_id),
                precoNaData: Number(game.price_amount),
                precoRegular:Number(game.regular_amount),
                moeda:game.price_currency,
            }
        ))
        
        const years = yearFilter.includes('Todos')? gamesDate:
            gamesDate.filter((date)=>yearFilter.includes(date.substring(0,4)));
        const month = monthFilter.includes('Todos')? gamesDate:
            gamesDate.filter((date)=>monthFilter.includes(EnumMonthName[Number.parseInt(date.substring(5,7))]))
        const day = dayFilter.includes('Todos')? gamesDate:
            gamesDate.filter((date)=>dayFilter.includes(date.substring(8,10)));
            
        setGames(data.filter(({data})=>{
            const date = new Date(data);
            date.setHours(0,0,0,0);
            return years.includes(date.toISOString()) 
            && month.includes(date.toISOString()) 
            && day.includes(date.toISOString())
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
            {games.length > 0 &&
            (
                <>
                    <AreaChart 
                        games={games}
                    />
                    <LineChart
                        games={games}
                    />
                </>
            )}
        </main>
    )
}