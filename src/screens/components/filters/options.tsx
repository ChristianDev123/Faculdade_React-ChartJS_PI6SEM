import type { MultiValue, SingleValue } from "react-select";
import {FilterMulti, FilterSingle} from "./components/filter";
import type { ISelectOption } from "../../../shared/interfaces/IGame";

interface OptionFilterMultiProps {
    title:string,
    options:ISelectOption[],
    selectedOptions:MultiValue<ISelectOption>,
    setSelectedOptions: React.Dispatch<React.SetStateAction<MultiValue<ISelectOption>>> 
}

interface OptionFilterSingleProps {
    title:string,
    options:ISelectOption[],
    selectedOptions:SingleValue<ISelectOption>,
    setSelectedOptions: React.Dispatch<React.SetStateAction<SingleValue<ISelectOption>>> 
}

export function OptionsFilterMulti({title, options, selectedOptions, setSelectedOptions}:OptionFilterMultiProps){
    return(
        <FilterMulti
            title={title}
            options={options}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
        />
    )
}

export function OptionsFilterSingle({title, options, selectedOptions, setSelectedOptions}:OptionFilterSingleProps){
    return(
        <FilterSingle
            title={title}
            options={options}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
        />
    )
}