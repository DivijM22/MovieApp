import { Outlet} from "react-router-dom";
import axios from "axios";
import { useState,useEffect } from "react";

export default function App()
{
    const [accessToken,setAccessToken]=useState();
    const [loading,setLoading]=useState(true);
    const [guestMode,setGuestMode]=useState(false);

    useEffect(()=>{
        async function verifyUserSession()
        {
            try{
                const res=await axios.get("http://localhost:3000/auth/refresh",{withCredentials : true});
                const {data}=res;
                if(data.success)
                    setAccessToken(data.accessToken);
            }catch(e){
                setAccessToken(null);
            }finally{
                setLoading(false);
            }
        }
        verifyUserSession();
    },[]);

    return (<div className='flex w-full min-w-0 min-h-screen bg-[#08081F]'>
            <div className="flex flex-1 min-w-0">
                {loading ?  <div>Loading ...</div> :
                <Outlet context={{accessToken,setAccessToken,guestMode,setGuestMode}}/>
                }
            </div>
        </div>);
}