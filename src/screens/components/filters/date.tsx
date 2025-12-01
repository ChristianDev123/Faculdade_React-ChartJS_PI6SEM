import type { MultiValue } from "react-select";
import { EnumMonthName } from "../../../shared/enumMonthName";
import type { ISelectOption } from "../../../shared/interfaces/IGame";
import { FilterMulti } from "./components/filter";

interface DateFilterProps {
    period:'Ano' | 'Mês' | 'Dia' | 'Trimestre',
    gameDates:string[]
    selectedOptions:MultiValue<ISelectOption>,
    setSelectedOptions: React.Dispatch<React.SetStateAction<MultiValue<ISelectOption>>>
}

export default function DateFilter({period, gameDates, selectedOptions, setSelectedOptions}:DateFilterProps){
    
    function getAvailableOptions():ISelectOption[]{
        let data = gameDates.map((date)=>
            period == 'Ano'? date.substring(0,4):
            period == 'Mês'? EnumMonthName[Number.parseInt(date.substring(5,7))]:
            date.substring(8,10)
        );
        const dataSet = new Set(data);
        const dataArr = [...dataSet];
        const arrTypeNumber = dataArr.every(el => typeof el === 'number'); 
        if(arrTypeNumber)
            dataArr.sort(((a, b) => a - b));
        dataArr.unshift('Todos');
        return dataArr.map((date)=>({label:date, value:date}));
    }

    return(
        <FilterMulti
            title={period}
            options={getAvailableOptions()}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
        />
    )
}