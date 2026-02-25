import AppIcon from "./icons/AppIcon";
import GridIcon from "./icons/GridIcon";
import IconCategoryMovie from "./icons/IconCategoryMovie";
import IconCategoryTv from "./icons/IconCategoryTv";
import { useNavigate } from "react-router-dom";

export default function Sidebar(props) {
  const {accessToken,setAccessToken,setUserInfo,guestMode}=props;
  const navigate=useNavigate();

  return (
    <aside className="flex fixed py-12 h-[80vh] w-20 flex-col items-center rounded-2xl bg-white/10 py-6 text-white shadow-lg backdrop-blur-md">

        {/* Top */}
        <div>
            <AppIcon />
        </div>

        {/* Center */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-2xl">
            <div className="cursor-pointer" onClick={()=>{
              navigate("/dashboard",{replace : true});
            }}><GridIcon/></div>
            <IconCategoryMovie />
            <IconCategoryTv />
        </div>

        {/* Bottom (dummy space) */}
      
        <img src="/unnamed.png" alt="profile pic" className="h-8 rounded-full cursor-pointer" onClick={()=>navigate('/dashboard/user_page')}/>
    </aside>
  );
}

