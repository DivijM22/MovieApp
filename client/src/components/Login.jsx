import { useState,useEffect } from "react";
import { Link, useOutletContext,useNavigate} from "react-router-dom";
import axios from 'axios';

export default function Login() {
const navigate=useNavigate();
const {accessToken,setAccessToken,setGuestMode}=useOutletContext();

useEffect(()=>{
  if(!navigate || !accessToken) return;
  if(accessToken)
  {
    console.log(accessToken);
    navigate('/dashboard',{replace : true});
  }
},[navigate,accessToken]);

const [mode, setMode] = useState("login"); // login | register
const [form, setForm] = useState({
  name: "",
  email: "",
  password: ""
});

function handleChange(e) {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
}

async function handleSubmit(e) {
  e.preventDefault();
  setGuestMode(false);
  try 
  {
    var payload;
    if (mode === "login") 
    {
      payload={
          email : form.email,
          password : form.password
      };
      const res=await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`,{payload},{headers:{
        'Content-Type' : 'application/json'
      },withCredentials : true});
      const {data}=res;
      if(data.success)
      {
        navigate('/dashboard',{replace : true});
        setAccessToken(data.accessToken);
      }
    }
    else {
      payload={
        username : form.name,
        email : form.email,
        password : form.password
      };
      const res=await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`,{payload},{headers:{
        'Content-Type' : 'application/json'
      }});
      const {data}=res;
      if(data.success)
        setMode('login');
    }
  }catch(e){
    console.log(e);
  }

  }

  return (
    <div className="flex min-h-screen w-full bg-zinc-900 items-center justify-center">
      <div className="w-full max-w-md bg-zinc-800 rounded-2xl p-8 shadow-lg">
        
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          {mode === "login" ? "Login" : "Create Account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === "register" && (
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-sm text-zinc-400 text-center mt-6">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-red-400 hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-red-400 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>

        <div className="text-center mt-4">
          <Link to="/dashboard" className="text-xs text-zinc-500 hover:underline" onClick={()=>{
            setGuestMode(true);
          }}>
            Continue as guest
          </Link>
        </div>

      </div>
    </div>
  );
}
