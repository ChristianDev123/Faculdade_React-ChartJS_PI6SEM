import Filter from "./components/filter"

interface DateFilterProps {
    period:'Ano' | 'Mês' | 'Dia' | 'Trimestre',
    gameDates:Date[]
    setSelectedOptions:React.Dispatch<React.SetStateAction<string>>
}

export default function DateFilter({period, gameDates, setSelectedOptions}:DateFilterProps){
    
    function getAvailableOptions(){
        let data = gameDates.map((date)=>
            period == 'Ano'? date.getFullYear():
            period == 'Mês'? `${String.fromCharCode(date.getMonth()+65)} ${date.toLocaleString('pt-BR', { month: 'long' })}`:
            period == 'Dia'? date.getDate():
            Math.ceil((date.getMonth() + 1) / 3).toString()   
        );
        const dataSet = new Set(data);
        const dataArr = [...dataSet]
        const arrTypeNumber = dataArr.every(el => typeof el === 'number') 
        dataArr.sort(arrTypeNumber?((a, b) => a - b):undefined)
        return dataArr
    }

    return(
        <Filter
            title={period}
            options={getAvailableOptions()}
            setSelectedOption={setSelectedOptions}
        />
    )
}