import axios from 'axios';

async function fetchData(config)
  {
    try{
      const res=await axios(config);
      return res.data;
    }catch(err){
      const errPayload={
        type : 'UNKNOWN',
        message : err.message,
        status : err.response?.status,
        data : err.response?.data
      };
      if(err.response) errPayload.type='API_RESPONE_ERROR';
      else if(err.request) errPayload.type='API_NO_RESPONSE';
      else errPayload.type='AXIOS_INTERNAL_ERROR';
      throw errPayload;
    }
  }

export default async function fetchWithAuth({
    url,
    accessToken,
    setAccessToken,
    method='GET',
    body=null,
    navigate,
    options={}
})
{
    if(!accessToken || accessToken==="null" || accessToken==="undefined") throw new Error("No access token");
    try{
        const data=await fetchData({
            url,
            method,
            data : body,
            ...options,
            headers: {
                ...(options?.headers || {}),
                Authorization : `Bearer ${accessToken}`
            }
        });
        return {data,updatedToken : accessToken}
    }catch(err){
        if(err.status===401){
            try{
                const refreshRes=await fetchData({
                    url : "http://localhost:3000/auth/refresh",
                    withCredentials : true
                });
                const newAccessToken=refreshRes.accessToken;
                setAccessToken(newAccessToken);
                const data=await fetchData({
                    url,
                    method,
                    data : body,
                    ...options,
                    headers:{
                        ...(options?.headers || {}),
                        Authorization : `Bearer ${newAccessToken}`
                    }
                });
                return {data,updatedToken:newAccessToken};
            }catch(refreshErr){
                setAccessToken(null);
                navigate('/',{replace : true});
                throw refreshErr;
            }
        }
        throw err;
    }
}
