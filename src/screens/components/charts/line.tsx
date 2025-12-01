import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import type { IHistory, ISelectOption } from "../../../shared/interfaces/IGame"
import { FilterSingle } from "../filters/components/filter"
import type { SingleValue } from "react-select"

interface LineChartProps{
    history:IHistory[]
}

interface DataResume {
    periodo: string,
    valor: number
}

export default function LineChart({history}:LineChartProps){
    const [resumeData, setResumeData] = useState<DataResume[]>([])
    const [period, setPeriod] = useState<SingleValue<ISelectOption>>({label:'mensal', value:'mensal'})
    const [resume, setResume] = useState<SingleValue<ISelectOption>>({label:'avg', value:'avg'})

    function media(){
        const dados_periodo:any= {}

        history.forEach(({timestamp, deal:{price:{amount}}})=>{
            const periodo = period?.value === 'anual'? timestamp.substring(0,4):timestamp.substring(0,7)
            if(!dados_periodo[periodo]) dados_periodo[periodo] = []
            dados_periodo[periodo].push(amount)
        })

        setResumeData(Object.entries(dados_periodo).map<DataResume>(([periodo, valores])=>({
            periodo,
            valor:valores.reduce((val,acc)=>val+acc,0)/valores.length
        })))
    }

    function maxMin(){
        const dados_periodo:any= {}

        history.forEach(({timestamp, deal:{price:{amount}}})=>{
            const periodo = period?.value === 'anual'? timestamp.substring(0,4):timestamp.substring(0,7)
            if(!dados_periodo[periodo]) dados_periodo[periodo] = []
            dados_periodo[periodo].push(amount)
        })

        setResumeData(Object.entries(dados_periodo).map<DataResume>(([periodo, valores])=>({
            periodo,
            valor: resume?.value === 'max'? Math.max(...valores):Math.min(...valores)
        })))
    }

    useEffect(()=>{
        if(history.length === 0) return;
        if(resume?.value === 'avg') media()
        else maxMin();        
    },[history, period, resume])

    return(
        <section className="w-full h-full p-8">
            <div className='flex justify-around'>
                <FilterSingle
                    selectedOptions={period}
                    options={[
                        {label:'mensal', value:'mensal'},
                        {label:'anual',value:'anual'}
                    ]}
                    setSelectedOptions={setPeriod}
                    title='Período'
                />
                <FilterSingle
                    selectedOptions={resume}
                    options={[
                        {label:'avg', value:'avg'},
                        {label:'max',value:'max'},
                        {label:'min',value:'min'}
                    ]}
                    setSelectedOptions={setResume}
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