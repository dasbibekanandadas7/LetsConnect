import React, { useEffect,useContext, useState} from 'react'
import logo from '../assets/logo.svg'
import {useNavigate} from 'react-router-dom'
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { userDataContext } from '../context/UserContext';

function Login() {
  const [show, setShow]=useState(false);
  const navigate=useNavigate();
  const {serverurl}=useContext(authDataContext);

  const{userData,setUserData}=useContext(userDataContext)

  const [email, setemail]=useState("");
  const[password, setPassword]=useState("")

  const[loading, setLoading]=useState(false)
  const[error, setError]=useState("")

  const handleSignin=async(e)=>{
    e.preventDefault();
    setLoading(true)
    try {
      const result=await axios.post(serverurl+"/api/v1/auth/login",{
        email,
        password
      },{withCredentials:true})
      console.log("login result: ",result)
      setLoading(false)
      setUserData(result.data);
      setemail("")
      setPassword("")
      setError("")
      navigate("/")
    } catch (error) {
      if (error.response) {
        const backendError = error.response.data;
        setError(backendError.errors?.[0] || backendError.message);
       } else {
         setError("Something went wrong!");
        }

      setLoading(false)
    }
    
  }

  return (
    <div className='w-full h-screen bg-[white] flex flex-col items-center justify-start gap-2.5'>
     <div className="absolute top-3 left-1/2 transform -translate-x-1/2 sm:top-5 sm:left-5 sm:translate-x-0 md:top-7 md:left-7">
    <img src={logo} alt="Logo" className="w-24 sm:w-36 md:w-40" />
  </div>

    <form className='w-[120%] max-w-[600px] h-[600px] md:shadow-xl flex flex-col justify-center  gap-2.5 p-[15px]' onSubmit={handleSignin}>
    <h1 className='text-gray-800 text-[30px] font-semibold mb-[30px]'>Login</h1>
    <input type="email" placeholder='email' required className='w-full h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-5 py-2.5 rounded-md placeholder-gray-400'  value={email} onChange={(e)=>setemail(e.target.value)}/>
    <div className='w-full h-[50px] border-2 border-gray-600 text-gray-800 text-[18px]  rounded-md relative'>
    <input type={show?"text":"password"} placeholder='password' required className='w-full h-full border-none text-gray-800 text-[18px] px-5 py-2.5 rounded-md placeholder-gray-400' value={password} onChange={(e)=>setPassword(e.target.value)}/>
    <span className='absolute right-5 top-2.5 text-[#13181b] cursor-pointer font-semibold' onClick={()=>setShow(prev=>!prev)}>{show?"hide":"show"}</span>
     </div>

     {error && <p className='text-center text-red-500'>
      *{error}
     </p>}

     <button className='w-full h-[50px] rounded-full  bg-[#5b78e2]! mt-10 text-black' disabled={loading}>{loading?"Loading...":"Login"}</button>
     <p className='text-center cursor-pointer' onClick={()=>navigate("/Signup")}>Don't have an account ? <span className='text-[#2a9bd8]' 
     >Sign up </span> </p>
     
    </form>
   </div>
  )
}

export default Login