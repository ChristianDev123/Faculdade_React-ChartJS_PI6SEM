import Select, { type MultiValue, type SingleValue } from 'react-select'
import type { ISelectOption } from '../../../../shared/interfaces/IGame'

interface FilterMultiProps{
    title:string,
    options: ISelectOption[],
    selectedOptions:MultiValue<ISelectOption>,
    setSelectedOptions: React.Dispatch<React.SetStateAction<MultiValue<ISelectOption>>> 
}

interface FilterSingleProps{
    title:string,
    options: ISelectOption[],
    selectedOptions:SingleValue<ISelectOption>,
    setSelectedOptions: React.Dispatch<React.SetStateAction<SingleValue<ISelectOption>>> 
}

export function FilterMulti({title,options,selectedOptions,setSelectedOptions}:FilterMultiProps){
    return(
        <div className='flex flex-col '>
            <span>{title}</span>
            <Select
                options={options}
                isMulti
                value={selectedOptions}
                onChange={setSelectedOptions}
            />
        </div>
    )
}

export function FilterSingle({title,options,selectedOptions,setSelectedOptions}:FilterSingleProps){
    return(
        <div className='flex flex-col '>
            <span>{title}</span>
            <Select
                options={options}
                value={selectedOptions}
                onChange={setSelectedOptions}
            />
        </div>
    )
}