import { useEffect,useState} from 'react';
import fetchWithAuth from '../fetchWithAuth.js';
import {useNavigate, useOutletContext} from 'react-router-dom';
import axios from 'axios';
import ContentCard from './ContentCard.jsx';

export default function UserPage()
{
    const navigate=useNavigate();
    const {accessToken,setAccessToken,guestMode}=useOutletContext();
    const [watchList,setWatchList]=useState([]);
    const [watchListDetails,setWatchListDetails]=useState([]);
    const [user,setUser]=useState(null);

    useEffect(()=>{
        if(guestMode || !accessToken) return;
        async function fetchData()
        {
            try{
                const {data: userData,updatedToken}=(await fetchWithAuth({url : 'http://localhost:3000/me',accessToken,setAccessToken,navigate}));
                setUser(userData.user);
                const {data : watchListData}=(await fetchWithAuth({url : 'http://localhost:3000/api/watchlist',accessToken : updatedToken,setAccessToken,navigate}));
                setWatchList(watchListData.data);
            }catch(e){}
        }
        fetchData();
    },[accessToken,guestMode]);

    useEffect(()=>{
        async function fetchData()
        {
            try{
                const results=await Promise.all(watchList.map(async (value,index)=>{
                    try{
                        const {media_type,itemId}=value;
                        const res=await axios.get(`http://localhost:3000/details?media_type=${media_type}&id=${itemId}`);
                        const {data}=res.data;
                        console.log(data);
                        const year=new Date(data.release_date || data.first_air_date).getFullYear();
                        const title = data.title || data.name;
                        const backdrop_path=data.backdrop_path || data.poster_path;
                        return {
                            id : itemId,
                            year,
                            title,
                            backdrop_path,
                            media_type
                        };
                    }catch(e){console.log(e);}
                    return null;
                }));
                setWatchListDetails(results);
            }catch(e){
                console.log(e);
            }
        }
        if(watchList.length>0) fetchData();
        else setWatchListDetails([]);
    },[watchList]);

    return (
  <div className="min-h-screen w-full text-white px-6 md:px-12 py-12">

    
    {/* PROFILE SECTION */}
    <div className="max-w-6xl mx-auto mb-14">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 shadow-2xl">

        <div className="flex items-center gap-6 mb-8">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-3xl font-bold shadow-lg">
            {guestMode ? 'G' : user?.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-3xl font-semibold tracking-wide">
              {guestMode ? 'Guest' : user?.username}
            </h2>
            {
              !guestMode && 
              <p className="text-zinc-400 text-sm">
                Member since {user?.joinDate}
              </p>
            }
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 text-zinc-300">
          <div>
            <p className="text-sm text-zinc-400 mb-1">Email</p>
            <p className="text-lg text-white">{user?.email}</p>
          </div>

          <div>
            <p className="text-sm text-zinc-400 mb-1">Joined</p>
            <p className="text-lg text-white">{user?.joinDate}</p>
          </div>
        </div>
      </div>
    </div>


    {/* WATCHLIST SECTION */}
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold tracking-wide">
          Your Watchlist
        </h2>
        <span className="text-zinc-400 text-sm">
          {watchListDetails.length} items
        </span>
      </div>

      {watchListDetails.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {watchListDetails.map((value) => (
            <div
              key={value.id}
              className="transform hover:scale-105 transition duration-300"
            >
              <div className="w-full aspect-video flex-shrink-0">
                <ContentCard
                  id={value.id}
                  media_type={value.media_type}
                  title={value.title}
                  backdrop_path={value.backdrop_path}
                  year={value.year}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white/5 border border-white/10 rounded-2xl text-zinc-400">
          <p className="text-xl mb-2">Your watchlist is empty 🎬</p>
          <p className="text-sm">
            Start exploring and add movies or shows to your list.
          </p>
        </div>
      )}
    </div>
  </div>
);
}