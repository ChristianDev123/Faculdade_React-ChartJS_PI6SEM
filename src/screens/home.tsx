import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { MultiValue, SingleValue } from "react-select";
import { fetchGames, fetchGamesList } from "../api/games";
import { EnumMonthName } from "../shared/enumMonthName";
import type { ISelectOption } from "../shared/interfaces/IGame";
import { useGameStore, usePresentationGame } from "../stores/games";
import DateFilter from "./components/filters/date";
import { OptionsFilterMulti, OptionsFilterSingle } from "./components/filters/options";
import { fetchCountriesList, fetchIndicatorsList } from "../api/economy";
import AreaChart from "./components/charts/area";
import LineChart from "./components/charts/line";

export default function Home(){
    const [get, set] = useSearchParams();
    const [gamesOption, setGamesOption] = useState<ISelectOption[]>([])
    const [countriesOptions, setCountriesOptions] = useState<ISelectOption[]>([])
    const [indicatorsOptions, setIndicatorsOptions] = useState<ISelectOption[]>([])
    
    const {games, setGames} = useGameStore()
    const {presentationGameHistories, setPresentationGameHistories} = usePresentationGame()
    const [gamesDate,setGamesDate] = useState<string[]>([])
    /* Filtros */
    const ALLSELECTION ={label:'Todos', value:'Todos'}
    const [dayFilter, setDayFilter] = useState<MultiValue<ISelectOption>>([ALLSELECTION])
    const [monthFilter, setMonthFilter] = useState<MultiValue<ISelectOption>>([ALLSELECTION])
    const [yearFilter, setYearFilter] = useState<MultiValue<ISelectOption>>([ALLSELECTION])
    const [selectedGame, setSelectedGame] = useState<SingleValue<ISelectOption>>({label:'', value:''})
    const [selectedCountries, setSelectedCountries] = useState<MultiValue<ISelectOption>>([ALLSELECTION])
    const [selectedIndicators, setSelectedIndicators] = useState<MultiValue<ISelectOption>>([ALLSELECTION])

    const fetchPriceData = (game_id:string)=>{
        fetchGames(game_id)
        .then((data)=>{ 
            setGames(data)
            setPresentationGameHistories(data.prices)
            setGamesDate(data.prices.map(({timestamp})=>timestamp))
        })
        .catch((error)=>console.log(error))
    }
    
    const fetchOptions = async ()=>{
        const indicators = await fetchIndicatorsList();
        const countries = await fetchCountriesList();
        setIndicatorsOptions(indicators.map(({code_input, description})=>({label:description, value:code_input})))
        setCountriesOptions(countries.map(({code_input, description})=>({label:description, value:code_input})))
    }


    useEffect(()=>{
        fetchGamesList()
        .then((games)=>{
            fetchOptions()
            .then(()=>{
                setGamesOption(games.map(({id, name})=>({label:name, value:id})))
                const game_id = get.get("game_id")
                !game_id && set({'game_id':games[0].id})
                setSelectedGame({label:games[0].name, value:games[0].id})
                fetchPriceData(!game_id ? games[0].id : game_id)
            })
        })
    },[])

    // useEffect(()=>{
    //     if(gamesDate.length === 0 || !selectedGame) return;
        
    //     const years = yearFilter.includes('Todos')? gamesDate:
    //         gamesDate.filter((date)=>yearFilter.includes(date.substring(0,4)));
    //     const month = monthFilter.includes('Todos')? gamesDate:
    //         gamesDate.filter((date)=>monthFilter.includes(EnumMonthName[Number.parseInt(date.substring(5,7))]))
    //     const day = dayFilter.includes('Todos')? gamesDate:
    //         gamesDate.filter((date)=>dayFilter.includes(date.substring(8,10)));

    //     setPresentationGameHistories(selectedGame.prices.filter(({timestamp})=>{
    //         const histDate = new Date(timestamp);
    //         histDate.setHours(0,0,0,0);
    //         return years.includes(histDate.toISOString()) 
    //         && month.includes(histDate.toISOString()) 
    //         && day.includes(histDate.toISOString());
    //     }))
    // },[dayFilter,monthFilter,yearFilter])

    useEffect(()=>{
        if(selectedGame?.value){
            set({'game_id':selectedGame!.value})
            fetchPriceData(selectedGame!.value)
        }

    }, [selectedGame, selectedIndicators, selectedCountries])


    return (selectedGame && 
        <main className='w-full h-full flex flex-col'>
            <section className="flex justify-around w-[45rem]">
                <DateFilter
                    period="Ano"
                    gameDates={gamesDate}
                    selectedOptions={yearFilter}
                    setSelectedOptions={setYearFilter}
                />
                <DateFilter
                    period="Mês"
                    gameDates={gamesDate}
                    selectedOptions={monthFilter}
                    setSelectedOptions={setMonthFilter}
                />
                <DateFilter
                    period="Dia"
                    gameDates={gamesDate}
                    selectedOptions={dayFilter}
                    setSelectedOptions={setDayFilter}
                />
            </section>
            <section className="flex justify-around w-[45rem]">
                <OptionsFilterSingle
                    title="Game"
                    options={gamesOption}
                    selectedOptions={selectedGame}
                    setSelectedOptions={setSelectedGame}
                />
                <OptionsFilterMulti
                    title="País"
                    options={countriesOptions}
                    selectedOptions={selectedCountries}
                    setSelectedOptions={setSelectedCountries}
                />
                <OptionsFilterMulti
                    title="Indicador Economico"
                    options={indicatorsOptions}
                    selectedOptions={selectedIndicators}
                    setSelectedOptions={setSelectedIndicators}
                />
            </section>
            {presentationGameHistories &&
            (
                <>
                    <AreaChart 
                        history={presentationGameHistories}
                        typePrice="current"
                    />
                    <LineChart
                        history={presentationGameHistories}
                    />
                </>
            )}
        </main>
    )
}