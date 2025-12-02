import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { MultiValue, SingleValue } from "react-select";
import { fetchCountriesList, fetchIndicators, fetchIndicatorsList } from "../api/economy";
import { fetchGames, fetchGamesList } from "../api/games";
import type { ISelectOption } from "../shared/interfaces/IGame";
import { useGameStore, usePresentationGame } from "../stores/games";
import AreaChart from "./components/charts/area";
import LineChart from "./components/charts/line";
import DateFilter from "./components/filters/date";
import { OptionsFilterMulti, OptionsFilterSingle } from "./components/filters/options";
import { useEconIndicators } from "../stores/economy";

export default function Home(){
    const [get, set] = useSearchParams();
    const [gamesOption, setGamesOption] = useState<ISelectOption[]>([])
    const [countriesOptions, setCountriesOptions] = useState<ISelectOption[]>([])
    const [indicatorsOptions, setIndicatorsOptions] = useState<ISelectOption[]>([])
    
    const {games, setGames} = useGameStore()
    const {presentationGameHistories, setPresentationGameHistories} = usePresentationGame()
    const {indicators, setIndicators} = useEconIndicators()
    const [gamesDate,setGamesDate] = useState<string[]>([])
    /* Filtros */
    const [dateInitFilter, setDateInitFilter] = useState<SingleValue<ISelectOption> | null>(null)
    const [dateEndFilter, setDateEndFilter] = useState<SingleValue<ISelectOption> | null>(null)
    const [selectedGame, setSelectedGame] = useState<SingleValue<ISelectOption>>({label:'', value:''})
    const [selectedCountries, setSelectedCountries] = useState<MultiValue<ISelectOption>>([])

    const fetchPriceData = (game_id:string)=>{
        fetchGames(game_id)
        .then((data)=>{ 
            setGames(data)
            setPresentationGameHistories(data.prices)
            let dates = data.prices.map(item => item.timestamp.substring(0,10));
            dates = [...new Set(dates)];
            const arr_dates = dates.map((date)=>new Date(date))
            setGamesDate([...arr_dates.map((date)=>date.toISOString().split('T')[0])])
            const max_date = new Date(Math.max(...arr_dates)).toISOString().split('T')[0];
            const min_date = new Date(Math.min(...arr_dates)).toISOString().split('T')[0];

            setDateInitFilter({label:min_date, value:'1'})
            setDateEndFilter({label:max_date, value:dates.length.toString()})
        })
        .catch((error)=>console.log(error))
    }
    
    const fetchOptions = async ()=>{
        const indicators = await fetchIndicatorsList();
        const countries = await fetchCountriesList();
        setIndicatorsOptions(indicators.map(({input_code, description})=>({label:description, value:input_code})))
        setCountriesOptions(countries.map(({input_code, description})=>({label:description, value:input_code})))
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
        .catch((e)=>console.log(e))

        fetchIndicators({})
        .then((indicator)=>setIndicators(indicator))
        .catch((e)=>console.log(e))

    },[])

    useEffect(()=>{
        if(!games || !dateEndFilter || !dateInitFilter) return;

        setPresentationGameHistories(games.prices.filter(({timestamp})=>{
            const histDate = new Date(timestamp.substring(0,10));
            const minDate = new Date(dateInitFilter.label);
            const maxDate = new Date(dateEndFilter.label);
            return histDate >= minDate && histDate <= maxDate;
        }))

        fetchIndicators({
            countries:selectedCountries.map(({value})=>value),
            endDate:dateEndFilter.label,
            initDate:dateInitFilter.label
        })
        .then((indicator)=>setIndicators(indicator))
        .catch((e)=>console.log(e))

    },[dateInitFilter,dateEndFilter])

    useEffect(()=>{
        if(selectedGame?.value){
            set({'game_id':selectedGame!.value})
            fetchPriceData(selectedGame!.value)
        }
        if(dateEndFilter && dateInitFilter && selectedCountries)
            fetchIndicators({
                countries:selectedCountries.map(({value})=>value),
                endDate:dateEndFilter.label,
                initDate:dateInitFilter.label
            })
            .then((indicator)=>setIndicators(indicator))
            .catch((e)=>console.log(e))
    }, [selectedGame, selectedCountries])


    return (selectedGame && 
        <main className='w-full h-full flex flex-col'>
            <section className="flex justify-between">
                <div className="w-[15rem]">
                    <h3>Filtros de Datas</h3>
                    <DateFilter
                        title="Data Inicial"
                        options={gamesDate.map((date,i)=>({label:date, value:i.toString()}))}
                        selectedOptions={dateInitFilter}
                        setSelectedOptions={setDateInitFilter}
                    />
                    <DateFilter
                        title="Data Final"
                        options={gamesDate.map((date,i)=>({label:date, value:i.toString()}))}
                        selectedOptions={dateEndFilter}
                        setSelectedOptions={setDateEndFilter}
                    />
                </div>
                <div className="w-[15rem]">
                    <h3>Filtros Dados Economicos</h3>
                    <OptionsFilterMulti
                        title="País"
                        options={countriesOptions}
                        selectedOptions={selectedCountries}
                        setSelectedOptions={setSelectedCountries}
                    />
                </div>
                <div className="w-[15rem]">
                    <h3>Filtros de Games</h3>
                    <OptionsFilterSingle
                        title="Game"
                        options={gamesOption}
                        selectedOptions={selectedGame}
                        setSelectedOptions={setSelectedGame}
                    />
                </div>
            </section>
            <section className="w-full">
                {presentationGameHistories &&(
                    <>
                        <div className="flex w-full">
                            <div className='w-[60%]'>
                                <AreaChart
                                    title="Valores de Jogos"
                                    data={presentationGameHistories.map(({timestamp,deal:{price:{amount}}})=>({
                                        x:timestamp,
                                        y:amount
                                    }))}
                                    showTootipData
                                />
                            </div>
                            <div className="flex flex-wrap w-[40%]">
                                {indicatorsOptions.length > 0 && indicators.length > 0 && indicatorsOptions.map(({value:code2, label}, index)=>{
                                    const dados = indicators.map((indicator)=>({...indicator , indicators:indicator.indicators.filter(({code:code1})=> code1 == code2)}))  
                                    let sumIndicators = Object.values(
                                    dados.reduce((acc, { period, indicators }) => {
                                        const key = String(period);
                                        const soma = indicators.reduce((acc, { value }) => acc + value, 0);
                                        if (!acc[key]) acc[key] = { x: key, y: 0 };
                                        acc[key].y += soma;
                                        return acc;
                                    }, {})
                                    );
                                    return(
                                        <div className="w-1/2">
                                            <AreaChart
                                                key={index}
                                                title={label}
                                                data={sumIndicators.map(({ x, y }) => ({x,y}))}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <LineChart
                            history={presentationGameHistories}
                        />
                    </>
                )}
            </section>
        </main>
    )
}