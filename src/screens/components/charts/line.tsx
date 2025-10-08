import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import type { IGame } from "../../../shared/interfaces/IGame"
import Filter from "../filters/components/filter"

interface LineChartProps{
    games:IGame[]
}
type periodType = 'anual'|'mensal'
type resumeType = 'max'|'min'|'avg'
interface DataResume {
    periodo: string,
    valor: number
}

export default function LineChart({games}:LineChartProps){
    const [resumeData, setResumeData] = useState<DataResume[]>([])
    const [period, setPeriod] = useState<periodType[]>(['mensal'])
    const [resume, setResume] = useState<resumeType[]>(['avg'])

    function media(){
        const dados_periodo:any= {}

        games.forEach(({data, precoNaData})=>{
            const periodo = period[0] === 'anual'? data.substring(0,4):data.substring(0,7)
            if(!dados_periodo[periodo]) dados_periodo[periodo] = []
            dados_periodo[periodo].push(precoNaData)
        })

        setResumeData(Object.entries(dados_periodo).map<DataResume>(([periodo, valores])=>({
            periodo,
            valor:valores.reduce((val,acc)=>val+acc,0)/valores.length
        })))
    }

    function maxMin(){
        const dados_periodo:any= {}

        games.forEach(({data, precoNaData})=>{
            const periodo = period[0] === 'anual'? data.substring(0,4):data.substring(0,7)
            if(!dados_periodo[periodo]) dados_periodo[periodo] = []
            dados_periodo[periodo].push(precoNaData)
        })

        setResumeData(Object.entries(dados_periodo).map<DataResume>(([periodo, valores])=>({
            periodo,
            valor: resume[0] === 'max'? Math.max(...valores):Math.min(...valores)
        })))
    }

    useEffect(()=>{
        if(games.length === 0) return;
        if(resume[0] === 'avg') media()
        else maxMin();        

    },[games, period, resume])

    return(
        <section className="w-full h-full p-8">
            <div className='flex justify-around'>
                <Filter
                    options={['mensal','anual']}
                    setSelectedOption={setPeriod}
                    title='Período'
                />
                <Filter
                    options={['avg', 'max', 'min']}
                    setSelectedOption={setResume}
                    title='Resumo'
                />
            </div>
            {resumeData && resumeData.length > 0 &&
                <Line
                    options={{
                        responsive:true,
                        plugins:{
                            legend:{
                                position:'top'
                            },
                            title:{
                                position:"bottom",
                                display:true,
                                text:"Evolução de Precificação em Games"
                            }
                        },
                        scales:{
                            x:{
                                title: {
                                    display: true,
                                    text: "Data",
                                },
                                grid: {
                                    display: false,
                                },
                            },
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: "Preço",
                                },
                            },
                        }
                    }}
                    data={{
                        datasets:[{
                            label:'Valores Games',
                            data: resumeData.map(({periodo,valor})=>({x:periodo,y:valor})),
                            fill:true,
                            borderColor: "rgba(34,197,94,1)", // verde-500 Tailwind como exemplo
                            backgroundColor: "rgba(34,197,94,0.12)",
                            pointRadius: 3,
                            pointHoverRadius: 6,
                            tension: 0, 
                        }]
                    }}
                />
            }
        </section>
    )
}