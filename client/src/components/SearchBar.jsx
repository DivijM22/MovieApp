import { useState} from "react";
import IconSearch from "./icons/IconSearch";
import {useNavigate} from 'react-router-dom';

export default function SearchBar()
{
    const [search,setSearch]=useState();
    const navigate=useNavigate();

    return (
    <div className="flex w-full items-center justify-between bg-transparent px-4 py-3 text-white backdrop-blur-sm border-b-2 border-transparent transition focus-within:border-white/40">
        
        <div className="flex gap-3 items-center text-3xl">
            <span className="flex text-white/80">
                <IconSearch />
            </span>

            <input
            type="text"
            value={search}
            placeholder="Enter movie or TV show"
            className="w-full bg-transparent text-white placeholder-white/50 outline-none"
            onChange={e=>setSearch(e.target.value)}
            />
        </div>
        <button onClick={()=>{
                navigate(`/dashboard/search_results?query=${search}`,{replace : true});
                setSearch("");
            }} className="flex text-s bg-gray-600 text-white font-bold p-3 rounded-xl">Search</button>
    </div>
    );
}