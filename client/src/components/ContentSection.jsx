import axios from 'axios';
import {useEffect,useState} from 'react';
import ContentCard from './ContentCard';
import {Navigate, useNavigate} from 'react-router-dom'

export default function ContentSection(props)
{
    const [results,setResults]=useState([]);
    const {endpoint,media_type,title,scrollbar}=props;
    const navigate=useNavigate();

        const linkMap={
        trending_movies : `${import.meta.env.VITE_API_URL}/trending_movies`,
        popular_movies : `${import.meta.env.VITE_API_URL}/popular_movies`,
        upcoming_movies : `${import.meta.env.VITE_API_URL}/upcoming_movies`,
        now_playing_movies : `${import.meta.env.VITE_API_URL}/now_playing_movies`,
        top_rated_movies : `${import.meta.env.VITE_API_URL}/top_rated_movies`,
        tv_airing_today : `${import.meta.env.VITE_API_URL}/tv_airing_today`,
        tv_on_air : `${import.meta.env.VITE_API_URL}/tv_on_air`,
        popular_tv : `${import.meta.env.VITE_API_URL}/popular_tv`,
        top_rated_tv : `${import.meta.env.VITE_API_URL}/top_rated_tv`,
        trending_tv : `${import.meta.env.VITE_API_URL}/trending_tv/day`
    };

    const url=linkMap[endpoint];

    useEffect(()=>{
        async function fetchData()
        {
            try
            {
                console.log(url);
                const res=await axios.get(url);
                const {results}=res.data.data;
                const arr=(scrollbar ? results.slice(0,10) : results.slice(0,6));
                setResults(arr);
                console.log(arr);
            }catch(e){console.log(e);}
        }
        fetchData();
        console.log(media_type);
    },[url]);

    return (
        <div className="w-full flex flex-col p-4 gap-4 min-w-0"> 
                <header className="flex w-full justify-between text-white items-center">
                    <div className="flex gap-4">
                        <h1 className="text-4xl">{title}</h1>
                        <span className="px-2 py-1 flex items-center justify-center self-end bg-transparent text-white font-bold border-2 border-white text-xs rounded-md">{
                            media_type==="movie" ? "Movie" : "TV"    
                        }</span>
                    </div>
                    <span onClick={()=>{
                        navigate(`/dashboard/search_results?endpoint=${endpoint}`)
                    }} className="flex cursor-pointer text-gray-400 font-bold self-end text-xs">SEE MORE</span>
                </header>
                {
                    scrollbar ? 
                    <div className="overflow-x-auto flex px-3">
                        <ul className="flex gap-4 my-2 flex">
                            {results.map((value, index) => {
                                const year=new Date(value.release_date || value.first_air_date).getFullYear();
                                return (<li key={value.id} className="flex-shrink-0 w-[420px] aspect-video">
                                    <ContentCard id={value.id} backdrop_path={value.backdrop_path} gray_overlay title={value.title || value.name} year={year} media_type={media_type}/>
                                </li>);
                            })}
                        </ul>
                    </div> : <div className="grid grid-cols-4 gap-2 min-w-0 grid-rows-[auto_180px]">
                            {
                                results.map((value,index)=>{
                                    const year=new Date(value.release_date || value.first_air_date).getFullYear();
                                    if(index<=3)
                                        return <div key={value.id} className="aspect-video">
                                                <ContentCard id={value.id} backdrop_path={value.backdrop_path} title={value.title || value.name} year={year} media_type={media_type}/>
                                            </div>
                                    else return <div key={value.id} className="col-span-2">
                                            <ContentCard id={value.id} backdrop_path={value.backdrop_path} title={value.title || value.name} year={year} media_type={media_type}/>
                                    </div>
                                })
                            }
                    </div>
                }
        </div>
    );
}