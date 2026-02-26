require('dotenv').config();
const express=require('express');
const cors=require('cors');
const axios=require('axios');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const authRouter=require('./auth.routes');
const jwt=require('jsonwebtoken');
const {User,WatchList}=require('./models');

const app=express();
const port=process.env.PORT || 3000;
const accessToken=process.env.API_ACCESS_TOKEN;

const headers={
    accept : 'application/json',
    Authorization : `Bearer ${accessToken}`
};

connectToDB();

app.use(express.json());
app.use(cors({
   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
   credentials: true
}));
app.use(cookieParser());
app.use('/auth',authRouter);

async function fetchData(url)
{
    try{
        const response=await axios.get(url,{headers,timeout : 5000});
        return response.data;
    }catch(err){
        const errPayload={
            type : 'UNKNOWN',
            message : err.message,
            status : err.response?.status || 0,
            data : err.response?.data || null
        };
        if(err.response) errPayload.type="TMDB_RESPONSE_ERROR";
        else if(err.request) errPayload.type="TMDB_NO_RESPONSE";
        else errPayload.type="AXIOS_INTERNAL_ERROR";
        throw errPayload;
    }
}

async function connectToDB()
{
    const uri=process.env.MONGO_URI;
    try 
    {
        await mongoose.connect(uri);
        console.log("Successfully connected to MongoDB");
    }catch(e){
        console.log(e);
    }
}

function handleUpstreamErrors(err,req,res,next)
{
    if(err.type==='TMDB_RESPONSE_ERROR')
    {
        console.log(err.data);
        if(err.status===429)
            return res.status(503).json({
                success : false,
                message : 'Unable to process request. Please try again.'
            });
        if(err.status>=500)
            return res.status(502).json({
                success : false,
                message : "Error with movie service. Please try again."
            });
        return res.status(502).json({
            success : false,
            message : "Failed to fetch movie data."  
        });
    }else if(err.type==='TMDB_NO_RESPONSE')
        return res.status(504).json({
            success : false,
            message : 'Movie service timed out'
        });
    console.log(err.message);
    return res.status(500).json({
        success : false,
        message : 'Internal server error'
    });
}

function handleAuth(req,res,next)
{
    try 
    {
        const authHeaders=req.headers['authorization']
        const token=authHeaders?.split(" ")[1];
        if(!authHeaders || !token || token==='undefined' || token==='null')
            return res.status(401).json({
                success : false,
                message : 'Access token required'
            });
        const decoded=jwt.verify(token,process.env.JWT_ACCESS_SECRET);
        req.user=decoded;
        next();
    }catch(e){
        console.log(e);
        return res.status(401).json({
            success : false,
            message : 'Expired or invalid access token'
        });
    }
}

app.get('/me',handleAuth,async (req,res)=>{
    try{
        const user=await User.findOne({_id : req.user.id});
        if(!user)
            return res.status(404).json({
                success : false,
                message : 'User not found'
            });
        const {createdAt}=user;
        const date=new Date(createdAt);
        const day=String(date.getDate()).padStart(2,'0');
        const month=String(date.getMonth()+1).padStart(2,'0');
        const year=date.getFullYear();
        return res.status(200).json({
            success : true,
            message : 'Successfully fetched user information',
            user : {
                username : user.username,
                email : user.email,
                joinDate : `${day}-${month}-${year}`
            }
        });
    }catch(e){
        return res.status(500).json({
            success : false,
            message : 'Some error occurred. Please try again.'
        });
    }
});

app.get('/now_playing_movies',async (req,res,next)=>{
    const page=req.query.page || 1;
    const url=`https://api.themoviedb.org/3/movie/now_playing?page=${page}`;
    try 
    {
        const data=await fetchData(url);
        res.status(200).json({
            success : true,
            message : 'Successfully fetched now playing movies',
            data
        });
    }catch(e){
        next(e);
    }

});

app.get('/upcoming_movies',async(req,res,next)=>{
    const page=req.query.page || 1;
    const url=`https://api.themoviedb.org/3/movie/upcoming?page=${page}`;
    try 
    {
        const data=await fetchData(url);
        return res.status(200).json({
            success : true,
            message : 'Successfully fetched upcoming movies',
            data
        });
    }catch(e){
        next(e);
    }
});

app.get('/top_rated_movies',async(req,res,next)=>{
    const page=req.query.page || 1;
    const url=`https://api.themoviedb.org/3/movie/top_rated?page=${page}`;
    try 
    {
        const data=await fetchData(url);
        return res.status(200).json({
            success : true,
            message : 'Successfully fetched top rated movies',
            data
        });
    }catch(e){next(e);}
});

app.get('/popular_movies',async(req,res,next)=>{
    const page=req.query.page || 1;
    const url=`https://api.themoviedb.org/3/movie/popular?page=${page}`;
    try
    {
        const data=await fetchData(url);
        return res.status(200).json({
            success : true,
            message : 'Successfully fetched popular movies',
            data
        });
    }catch(e){next(e);}
});

app.get('/trending_movies',async(req,res,next)=>{
    const page=req.query.page || 1;
    const url=`https://api.themoviedb.org/3/trending/movie/day?page=${page}`;
    try 
    {
        const data=await fetchData(url);
        return res.status(200).json({
            success : true,
            message : 'Successfully fetched trending movies',
            data
        });
    }catch(e){next(e);}
});

app.get('/tv_airing_today',async(req,res,next)=>{
    const page=req.query.page || 1;
    const url=`https://api.themoviedb.org/3/tv/airing_today?page=${page}`;
    try{
        const data=await fetchData(url);
        return res.status(200).json({
            success : true,
            message : 'Successfully fetched now airing tv',
            data
        });
    }catch(e){next(e);}
});

app.get('/tv_on_air',async(req,res,next)=>{
    const page=req.query.page || 1;
    const url=`https://api.themoviedb.org/3/tv/on_the_air?page=${page}`;
    try{
        const data=await fetchData(url);
        return res.status(200).json({
            success : true,
            message : 'Successfully fetched on air tv',
            data
        });
    }catch(e){next(e);}
});

app.get('/popular_tv',async(req,res,next)=>{
    const page=req.query.page || 1;
    const url=`https://api.themoviedb.org/3/tv/popular?page=${page}`;
    try{
        const data=await fetchData(url);
        return res.status(200).json({
            success : true,
            message : 'Successfully fetched popular tv',
            data
        });
    }catch(e){next(e);}
})

app.get('/top_rated_tv',async (req,res,next)=>{
    const page=req.query.page || 1;
    const url=`https://api.themoviedb.org/3/tv/top_rated?page=${page}`;
    try{
        const data=await fetchData(url);
        return res.status(200).json({
            success : true,
            message : 'Successfully fetched top rated tv',
            data
        });
    }catch(e){next(e);}
})

app.get('/trending_tv/:time_window',async(req,res,next)=>{
    const page=req.query.page || 1;
    const {time_window}=req.params;
    const url=`https://api.themoviedb.org/3/trending/tv/${time_window}?page=${page}`;
    try{
        const data=await fetchData(url);
        return res.status(200).json({
            success : true,
            message : 'Successfully fetched trending tv',
            data
        });
    }catch(e){next(e);}
});

app.get('/search',async(req,res)=>{
    const {query,page}=req.query;
    const url=`https://api.themoviedb.org/3/search/multi?query=${query}&page=${page}&include_adult=true&language=en-US`;
    try{
        const data=await fetchData(url);
        return res.status(200).json({
            success : true,
            message : 'Successfully fetched search results',
            data
        });
    }catch(e){next(e);}
});

app.get("/details",async (req,res,next)=>{
    const {media_type,id}=req.query;
    const baseUrl="https://api.themoviedb.org/3";
    try{
        const data=await fetchData(`${baseUrl}/${media_type}/${id}`);
        return res.status(200).json({
            success : true,
            message : 'Successfully fetched content details',
            data
        })
    }catch(e){next(e);}
});

app.get("/credits",async(req,res,next)=>{
    const {media_type,id}=req.query;
    const baseUrl="https://api.themoviedb.org/3";
    try{
        const data=await fetchData(`${baseUrl}/${media_type}/${id}/credits`);
        return res.status(200).json({
            success : true,
            messsage : 'Successfully fetched credits',
            data
        });
    }catch(e){next(e);}
});

app.post("/api/add_to_watchlist",handleAuth,async(req,res)=>{
    const {itemId,media_type}=req.body;
    const userId=req.user.id;
    try{
        const check=await WatchList.findOne({userId,itemId,media_type});
        if(check)
            return res.status(409).json({
                success : false,
                message : 'Item already in watchlist'
            });
        const newItem=new WatchList({userId,itemId,media_type});
        await newItem.save();
        
        return res.status(200).json({
            success : true,
            message : 'Item successfully added to watchlist'
        });
    }catch(e){
        return res.status(500).json({
            success : false,
            message : 'Please try again'
        });
    }
});

app.get('/api/watchlist',handleAuth,async(req,res)=>{
    const userId=req.user.id;
    try{
        const items=await WatchList.find({userId});
        if(!items)
            return res.status(404).json({
                success : false,
                message : 'Empty watchlist'
            });
        return res.status(200).json({
            success : true,
            message : 'Successfully fetched user watchlist',
            data : items
        });
    }catch(e){
        return res.status(500).json({
            success : false,
            message : 'Some error occurred. Please try again'
        });
    }
});

app.delete('/api/remove_from_watchlist',handleAuth,async(req,res)=>{
    const userId=req.user.id;
    const {media_type,itemId}=req.body;
    try{
        const check=await WatchList.exists({userId,media_type,itemId});
        if(!check)
            return res.status(404).json({
            success : false,
            message : 'Item not in watchlist'
        });
        await WatchList.deleteOne({userId,media_type,itemId});
        return res.status(200).json({
            success : true,
            message : 'Successfully removed from watchlist'
        });
    }catch(e){
        return res.status(500).json({
            success : false,
            message : 'Some error occurred. Please try again'
        });
    }
});

app.use(handleUpstreamErrors);

app.listen(port,()=>console.log("App is listening on port",port));
