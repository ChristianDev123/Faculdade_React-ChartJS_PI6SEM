import type { SingleValue } from "react-select";
import type { ISelectOption } from "../../../shared/interfaces/IGame";
import { FilterSingle } from "./components/filter";

interface DateFilterProps {
    title:string
    options:ISelectOption[]
    selectedOptions:SingleValue<ISelectOption>,
    setSelectedOptions: React.Dispatch<React.SetStateAction<SingleValue<ISelectOption>>>
}

export default function DateFilter({title, options, selectedOptions, setSelectedOptions}:DateFilterProps){
    return(
        <FilterSingle
            title={title}
            options={options}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
        />
    )
}