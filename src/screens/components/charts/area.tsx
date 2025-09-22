import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import Mockdata from "../../../api/mockdata.json"
import type { IGame } from "../../../shared/interfaces/IGame"


export default function AreaChart(){
    const [games, setGames] = useState<IGame[]>([]) 
    const [selectedData, setSelectedData] = useState<IGame[]>([])

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
        const firstPricePerDate = data.filter((game, index, arr)=>(index === 0 || game.precoRegular != arr[index-1].precoRegular))
        setGames(data)
        setSelectedData(firstPricePerDate)
    },[])

    return(
        <section className="w-full h-full">
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
                        borderWidth: 2,
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