import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import type { IGame } from "../../../shared/interfaces/IGame"

interface AreaChartProps{
    games:IGame[]
}

export default function AreaChart({games}:AreaChartProps){ 
    const [selectedData, setSelectedData] = useState<IGame[]>([])
    useEffect(()=>{
        if(games.length === 0) return;
        setSelectedData(games.filter((game, index, arr)=>(index === 0 || game.precoRegular != arr[index-1].precoRegular)))
    },[games])

    return(
        <section className="w-full h-full p-8">
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
                            type:'time',
                            time:{
                                unit:'day',
                                tooltipFormat: "PP",
                            },
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
                        data: selectedData.map(({data,precoRegular})=>({x:data,y:precoRegular})),
                        fill:true,
                        borderColor: "rgba(34,197,94,1)", // verde-500 Tailwind como exemplo
                        backgroundColor: "rgba(34,197,94,0.12)",
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        stepped: true,   // ✅ transforma em gráfico de degraus
                        tension: 0, 
                    }]
                }}
            />
        </section>
    )
}