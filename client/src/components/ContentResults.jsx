import ContentCard from "./ContentCard";

export default function ContentResults(props)
{
    const {page,setPage,totalPages}=props;
    const results=props.results;
    const heading=props.heading || 'Search Results';
    
    if(results.length<=0) return <div className="text-4xl text-white font-bold">No items found!</div>

    return (
        <div className="flex flex-col items-center w-full h-full">
            <h1 className="text-4xl text-white font-bold self-start my-4">{heading}</h1>
            <div className="grid grid-cols-3 w-full gap-4">
                {
                    results.map((value,index)=>{
                        const year=new Date(value.release_date || value.first_air_date).getFullYear();
                        const title=value.title || value.name;
                        return <li key={value.id} className='w-full aspect-video'>
                            <ContentCard backdrop_path={value.backdrop_path || (value.poster_path || null)} year={year || null} title={title} media_type={value.media_type} id={value.id}/>
                        </li>
                    })
                }
            </div>
            <footer className="flex justify-center my-8 gap-6">
                <div onClick={()=>{
                    if(page>1)
                        setPage(page-1);
                }} className="flex px-3 py-1 rounded-md bg-white hover:bg-blue-500 hover:text-white cursor-pointer">Prev</div>
                <div className="flex px-3 py-1 rounded-md bg-white">Page {page} of {totalPages}</div>
                <div onClick={()=>{
                    if(page<totalPages)
                        setPage(page+1);
                }} className="flex px-3 py-1 rounded-md bg-white hover:bg-blue-500 hover:text-white cursor-pointer">Next</div>
            </footer>
        </div>
    );
}