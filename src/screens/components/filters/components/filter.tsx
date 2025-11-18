interface FilterProps{
    title:string,
    options: Array<string|number>,
    setSelectedOption: React.Dispatch<React.SetStateAction<string[]>>
}

export default function Filter({title,options,setSelectedOption}:FilterProps){
    return(
        <div className='flex flex-col '>
            <span>{title}</span>
            <select onChange={(e)=>setSelectedOption(Array.from(e.target.selectedOptions, option => option.value))} multiple>
                {options.map((option,i)=>(<option value={option} key={i}>{option}</option>))}
            </select>
        </div>
    )
}