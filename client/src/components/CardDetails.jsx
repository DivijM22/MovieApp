import { useSearchParams,useNavigate,useOutletContext} from "react-router-dom";
import {useEffect,useState} from 'react';
import axios from 'axios';
import fetchWithAuth from "../fetchWithAuth";

export default function CardDetails()
{
    const [searchParams,setSearchParams]=useSearchParams();
    const {accessToken,setAccessToken,guestMode}=useOutletContext();
    const navigate=useNavigate();
    const media_type=searchParams.get('media_type');
    const id=searchParams.get('id');
    const [data,setData]=useState();
    const [credits,setCredits]=useState();
    const [date,setDate]=useState("");

    useEffect(()=>{
        async function fetchData()
        {
            try{
                const res=await axios.get(`${import.meta.env.VITE_API_URL}/details?media_type=${media_type}&id=${id}`);
                const creditsRes=await axios.get(`${import.meta.env.VITE_API_URL}/credits?media_type=${media_type}&id=${id}`);
                const credits=creditsRes.data.data.cast.slice(0,5);
                const {data}=res.data;
                setData(data);
                const currDate=new Date(data.release_date || data.first_air_date);
                const year=currDate.getFullYear();
                const month=currDate.getMonth();
                const day=currDate.getDate();
                setDate(`${day}-${month}-${year}`);
                setCredits(credits);
            }catch(e){console.log(e);}
        }
        if(!media_type || !id){
            navigate("/dashboard",{replace : true});
            return;
        }
        fetchData();
    },[media_type,id]);

    async function handleClick(url,method)
    {
        if(!accessToken){
            alert("Please login to use this feature");
            return;
        }
        try{
            const res=await fetchWithAuth({url,accessToken,setAccessToken,method,body: {
                itemId : id,
                media_type
            },navigate});
            alert(res.data.message);
        }catch(err){
            if(err.status===409)
                alert('Item already in watchlist');
            else if(err.status===404)
                alert('Item not in watchlist')
            else alert('Something went wrong');
        }
    }

    if(!data) return <div>Loading...</div>
return (
    <div className="flex flex-col w-full min-h-screen items-start text-white">

        {/* Backdrop Section */}
        <div
        className="relative w-full h-[60vh] bg-cover bg-center"
        style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${data?.backdrop_path})`
        }}
        >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Content Section */}
        <div className="relative -mt-32 px-12 flex gap-12 items-start">

            {/* Poster */}
            <div className="flex flex-col gap-4">
                <img
                    src={`https://image.tmdb.org/t/p/w500${data?.poster_path}`}
                    alt={data?.title}
                    className="w-[300px] rounded-2xl shadow-2xl"
                />
                <div className="flex flex-col gap-2">
                        <div className="flex justify-center w-full bg-red-500 font-bold cursor-pointer px-3 py-1 rounded-md
                                    transition duration-300 ease-in-out hover:scale-105 hover:bg-red-600"
                        onClick={()=>{
                            handleClick(`${import.meta.env.VITE_API_URL}/api/add_to_watchlist`,'POST');
                        }}>
                        Add to Watchlist
                    </div>
                    <div onClick={()=>{
                        handleClick(`${import.meta.env.VITE_API_URL}/api/remove_from_watchlist`,'DELETE');
                    }} className="flex justify-center w-full bg-yellow-500 font-bold cursor-pointer px-3 py-1 rounded-md
                    transition duration-300 ease-in-out hover:scale-105 hover:bg-yellow-600">
                        Remove from Watchlist
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="flex flex-col max-w-3xl gap-12">

                <h1 className="text-5xl font-bold leading-tight">
                {data?.title || data?.name}
                </h1>

                {data?.tagline && (
                <h3 className="text-xl text-zinc-400 italic">
                    {data.tagline}
                </h3>
                )}

                <div className="flex gap-12 text-white">
                    <div className="flex flex-col">
                        <span className="text-zinc-600">Rating</span>
                        <span className="text-gray-400">{(data?.vote_average/2).toFixed(2)}/5</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-zinc-600">Release Date</span>
                        <span className="text-gray-400">{new Date(data?.release_date || data?.first_air_date)}/5</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-zinc-600">Language</span>
                        <span>
                            {
                                data.spoken_languages.map((value,index)=>{
                                    if(value.iso_639_1===data.original_language)
                                        return (<span key={index} className="text-gray-400">{value.english_name}</span>)
                                })
                            }
                        </span>
                    </div>
                    {
                        data.runtime &&
                        <div className="flex flex-col">
                            <span className="text-zinc-600">Length</span>
                            <span  className="text-gray-400">{data.runtime} mins</span>
                        </div>
                    }
                    {
                        data.episode_run_time?.length>0 && 
                            <div className="flex flex-col">
                                <span className="text-zinc-600">Runtime</span>
                                <span  className="text-gray-400">{data.episode_run_time[0]} mins</span>
                            </div>
                    }
                    {
                        data.seasons && 
                            <div className="flex flex-col">
                                <span className="text-zinc-600">Seasons</span>
                                <span  className="text-gray-400">{data.seasons.length}</span>
                            </div>
                    }
                </div>

                {/* Overview */}
                <p className="text-lg text-zinc-300 leading-relaxed mt-4">
                    {data?.overview}
                </p>

                <div className="flex flex-col gap-4">
                    <span className="text-2xl text-zinc-600">Genre</span>
                    <div className="flex text-s gap-6">
                        {
                            data.genres.map((value,index)=>{
                                return <div key={index} className="flex px-2 py-1 bg-white text-black rounded-lg">{value.name}</div>
                            })
                        }
                    </div>
                </div>
                
                {
                    credits.length>0 &&
                    <div className="flex flex-col gap-6">
                        <span className="text-2xl text-zinc-600">Cast</span>
                            <div className="flex text-s gap-6">
                                {
                                    credits.map((value,index)=>{
                                        return <span className="bg-white text-black px-2 rounded-lg py-1" key={value.id}>{value.name}</span>
                                    })
                                }
                            </div>
                    </div>
                }
            </div>
        </div>
    </div>
    );
}