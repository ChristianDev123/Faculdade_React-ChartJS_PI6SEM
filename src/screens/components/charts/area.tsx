import { Line } from "react-chartjs-2"
import type { IHistory } from "../../../shared/interfaces/IGame"

interface AreaChartProps{
    history:IHistory[]
    typePrice:'regular'|'current'
}

export default function AreaChart({history, typePrice}:AreaChartProps){ 
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
                        data: history.map(({timestamp,deal})=>({
                            x:timestamp,
                            y:typePrice == 'regular'? deal.regular.amount: deal.price.amount
                        })),
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