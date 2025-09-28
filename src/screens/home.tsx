import { useEffect, useState } from "react";
import Mockdata from "../api/mockdata.json";
import type { IGame } from "../shared/interfaces/IGame";
import { useGameStore } from "../stores/games";
import AreaChart from "./components/charts/area";
import DateFilter from "./components/filters/date";

export default function Home(){
    const {games, setGames} = useGameStore()
    const [gamesDate,setGamesDate] = useState<Date[]>([])
    const [dayFilter, setDayFilter] = useState('Todos')
    const [monthFilter, setMonthFilter] = useState('Todos')
    const [yearFilter, setYearFilter] = useState('Todos')
    
    useEffect(()=>{
        const data = Mockdata.map<IGame>((game)=>{
            return ({
                data:game.timestamp.substring(0,10),
                discontoNaData: Number(game.discount_cut),
                loja:game.shop_name,
                lojaId:Number(game.shop_id),
                precoNaData: Number(game.price_amount),
                precoRegular:Number(game.regular_amount),
                moeda:game.price_currency,
            })
        })
        setGamesDate(data.map(({data})=>new Date(data)))
        setGames(data)
    },[])

    useEffect(()=>{
        const data = Mockdata.map<IGame>((game)=>{
            return ({
                data:game.timestamp.substring(0,10),
                discontoNaData: Number(game.discount_cut),
                loja:game.shop_name,
                lojaId:Number(game.shop_id),
                precoNaData: Number(game.price_amount),
                precoRegular:Number(game.regular_amount),
                moeda:game.price_currency,
            })
        })
        const years = yearFilter == 'Todos'?
            gamesDate.map((date)=>date):
            gamesDate.filter((date)=>yearFilter.includes(date.getFullYear().toString()));
        const month = yearFilter == 'Todos'?
            gamesDate.map((date)=>date):
            gamesDate.filter((date)=>monthFilter.includes(`${String.fromCharCode(date.getMonth()+65)} ${date.toLocaleString('pt-BR', { month: 'long' })}`));
        const day = dayFilter == 'Todos'?
            gamesDate.map((date)=>date):
            gamesDate.filter((date)=>date.getDate());
        setGames(data.filter(({data})=>{
            const date = new Date(data);
            return years.includes(date) && month.includes(date) && day.includes(date)
        }))
    },[dayFilter,monthFilter,yearFilter])


    return (
        <main className='w-full h-full'>
            <section>
                <DateFilter
                    period="Ano"
                    gameDates={gamesDate}
                    setSelectedOptions={setDayFilter}
                />
                <DateFilter
                    period="Mês"
                    gameDates={gamesDate}
                    setSelectedOptions={setMonthFilter}
                />
                <DateFilter
                    period="Dia"
                    gameDates={gamesDate}
                    setSelectedOptions={setYearFilter}
                />
            </section>
            {games.length>0 &&
            (
                <AreaChart 
                    games={games}
                />
            )}
        </main>
    )
}