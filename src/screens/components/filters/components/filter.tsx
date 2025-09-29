interface FilterProps{
    title:string,
    options: Array<string|number>,
    setSelectedOption: React.Dispatch<React.SetStateAction<string[]>>
}

export default function Filter({title,options,setSelectedOption}:FilterProps){
    return(
        <>
            <span>{title}</span>
            <select onChange={(e)=>setSelectedOption([e.target.selectedOptions[0].value])}>
                {options.map((option,i)=>(<option value={option} key={i}>{option}</option>))}
            </select>
        </>
    )
}