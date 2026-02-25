import { useEffect,useState } from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom'
import axios from 'axios';
import ContentResults from './ContentResults';

export default function SearchResultsPage()
{
    const [searchParams,setSearchParams]=useSearchParams();
    const searchQuery=searchParams.get('query');
    const endpoint=searchParams.get('endpoint');
    const [page,setPage]=useState(1);
    const [results,setResults]=useState([]);
    const [totalPages,setTotalPages]=useState(0);
    const navigate=useNavigate();

    const headings={
        'trending_movies' : 'Trending Movies',
        'popular_movies' : 'Popular Movies',
        'upcoming_movies' : 'Upcoming Movies',
        'now_playing_movies' : 'Now Playing Movies',
        'top_rated_movies' : 'Top Rated Movies',
        'tv_airing_today' : 'Airing Today',
        'tv_on_air' : 'On Air',
        'popular_tv' : 'Popular TV',
        'top_rated_tv' : 'Top Rated TV'
    }

    useEffect(()=>{
        async function fetchData()
        {
            var url;
            if(endpoint)
                url=`http://localhost:3000/${endpoint}?page=${page}`
            else url=`http://localhost:3000/search?query=${searchQuery}&page=${page}`;
            try{
                const res=await axios.get(url,{
                    headers:{
                        "Content-Type" : "application/json"
                    }
                });
                const {data}=res.data;
                console.log(data);
                setResults(data.results);
                setTotalPages(data.total_pages);
            }catch(e){
                console.log(e);
                alert('Some error ocurred!');
                navigate("/dashboard");
            }
        }
        fetchData();
    },[searchQuery,page,endpoint]);

    return <ContentResults results={results} page={page} setPage={setPage} totalPages={totalPages} heading={headings[endpoint]}/>;
}