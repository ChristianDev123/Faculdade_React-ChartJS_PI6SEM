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

        fetchIndicators()
        .then((indicator)=>setIndicators(indicator))
        .catch((e)=>console.log(e))

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
            <section>
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
                                />
                            </div>
                            <div className="flex flex-wrap">
                                {indicatorsOptions.length > 0 && indicators.length > 0 && indicatorsOptions.map(({value:code2})=>{
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

                                    // 2. Contagem de registros por período (para calcular média)
                                    const countByPeriod = dados.reduce((acc, { period }) => {
                                        const key = String(period);
                                        acc[key] = (acc[key] || 0) + 1;
                                        return acc;
                                    }, {});

                                    // 3. Média por período → ainda como array
                                    const avgIndicators:ISelectOption[] = sumIndicators.map(({ x, y }) => ({
                                        x,
                                        y: y / countByPeriod[x]
                                    }));
                                    return(
                                        <div className="w-1/2">
                                            <AreaChart
                                                title={code2}
                                                data={avgIndicators}
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