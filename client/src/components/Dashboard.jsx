import Sidebar from "./Sidebar";
import { useNavigate, useOutletContext, Outlet } from "react-router-dom";
import { useEffect } from "react";
import axios from 'axios';
import SearchBar from "./SearchBar";

export default function Dashboard()
{
    const {accessToken,setAccessToken,guestMode}=useOutletContext();
    const navigate=useNavigate();

    async function handleLogout()
    {
        await axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`,{withCredentials : true});
        setAccessToken(null);
        navigate('/',{replace : true});
    }

    useEffect(()=>{
        // console.log(accessToken);
        if(guestMode) return;
        if(!accessToken)
            navigate('/',{replace : true});
    },[accessToken,navigate]);

    return (
    <div className="flex box-border p-12 gap-6 w-full h-full min-w-0"> 
                <Sidebar accessToken={accessToken} setAccessToken={setAccessToken} guestMode={guestMode}/>
                <div className="flex flex-col flex-1 min-w-0 gap-12 ml-24">
                    <button className="bg-red-500 text-xs font-bold px-3 py-2 rounded-md text-white self-end flex" onClick={handleLogout}>Logout</button>
                    <SearchBar/>
                    <Outlet context={{accessToken,setAccessToken,guestMode}}/>
                </div>
        </div>
    );
}