import IconCategoryMovie from "./icons/IconCategoryMovie";
import { useNavigate } from "react-router-dom";

export default function ContentCard(props)
{
    const {backdrop_path,gray_overlay,title,year,media_type,id}=props;
    const navigate=useNavigate();

    const imgUrl=`https://image.tmdb.org/t/p/original/${backdrop_path}`;
    return (
        <div onClick={()=>{
            navigate(`/dashboard/details?id=${id}&media_type=${media_type}`);
        }} className="flex cursor-pointer transition-all duration-300 ease-in-out 
            hover:scale-105 hover:shadow-xl flex-col p-2 items-start justify-end relative w-full h-full box-border bg-cover bg-center rounded-xl w-full" style={{backgroundImage : `url(${imgUrl})`}}>
            {
                gray_overlay && 
                <div className="absolute inset-0 bg-white/10 rounded-xl"></div>
            }
            <span className="flex justify-start gap-2 items-center text-white">
                <span className="text-lg font-bold">{year}</span>
                <IconCategoryMovie className="w-4 h-4"/>
                <span>{media_type==='movie' ? 'MOVIE' : 'TV'}</span>
            </span>
            <span className="text-lg text-white font-bold">{title}</span>
        </div>  
    );
}