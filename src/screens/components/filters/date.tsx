import { EnumMonthName } from "../../../shared/enumMonthName";
import Filter from "./components/filter"

interface DateFilterProps {
    period:'Ano' | 'Mês' | 'Dia' | 'Trimestre',
    gameDates:string[]
    setSelectedOptions:React.Dispatch<React.SetStateAction<string[]>>
}

export default function DateFilter({period, gameDates, setSelectedOptions}:DateFilterProps){
    
    function getAvailableOptions(){
        let data = gameDates.map((date)=>
            period == 'Ano'? date.substring(0,4):
            period == 'Mês'? EnumMonthName[Number.parseInt(date.substring(5,7))]:
            date.substring(8,10)
        );
        const dataSet = new Set(data);
        const dataArr = [...dataSet];
        const arrTypeNumber = dataArr.every(el => typeof el === 'number'); 
        dataArr.sort(arrTypeNumber?((a, b) => a - b):undefined);
        dataArr.unshift('Todos');
        return dataArr;
    }

    return(
        <Filter
            title={period}
            options={getAvailableOptions()}
            setSelectedOption={setSelectedOptions}
        />
    )
}