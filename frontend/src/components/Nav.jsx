import React, { useContext, useEffect } from 'react'
import logo2 from '../assets/logo2.png'
import { IoSearch } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { IoMdNotifications } from "react-icons/io";
import dp from "../assets/dp.webp"
import { useState } from 'react';
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';
import {Navigate, useNavigate} from 'react-router-dom';
import axios from 'axios';

function Nav() {
  const[activeSearch, setActiveSearch]=useState(false)
  const[showPopup, setShowPopup]=useState(false)
  const[searchInput, setSearchInput]=useState("")
  const[searchdata, setSearchData]=useState([])
  
  const {userData, setUserData, handlegetProfile}=useContext(userDataContext)
  const navigate=useNavigate();

  const {serverurl}=useContext(authDataContext)
  const handleSignOut=async()=>{
    try {
      let result=await axios.post(serverurl+"/api/v1/auth/logout",{},{withCredentials:true}) 
      setUserData(null)
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }

  const handleViewProfile=async()=>{
   try {
     handlegetProfile(userData.data.username)
     navigate("/profile")
   } catch (error) {
    console.log(error);
   }
  }

  const handleSearch=async()=>{
      try {
        if(searchInput.trim() !== "" ){
        const result=await axios.get(`${serverurl}/api/v1/user/search?query=${searchInput}`,{withCredentials:true})
        console.log(result.data.data);
        setSearchData(result.data.data)}
      } catch (error) {
        console.log(error);
      }
  }

  useEffect(()=>{
      handleSearch()
  },[searchInput])

  return (
   <div className='w-full h-[80px] bg-white fixed top-0 left-0 shadow-lg flex md:justify-around  justify-between items-center px-[40px] z-[80]'>
    <div className='flex justify-center items-center gap-[10px] relative'>
    <div>
        <img src={logo2} alt="logo" className='w-[50px] ml-[20px]' onClick={()=>{navigate("/")}}/>
    </div>
    {!activeSearch && <div><IoSearch className='w-[30px] h-[50px] text-gray-600 lg:hidden'  onClick={()=>setActiveSearch(true)}/></div>}
    
     {searchInput.trim() !== "" && searchdata.length>0 && 
     <div className='absolute top-[65px] left-[0px] lg:left-[20px] w-screen max-w-[500px] bg-white min-h-[60px] shadow-lg flex flex-col gap-[20px]'>
      {searchdata.map((se,index)=>(
        <div key={index}>
         {/* profile pic */}
        <div className="flex items-center gap-3 cursor-pointer !border-b-1 !border-b-gray-300 p-[10px] hover:bg-gray-200 cursor-pointer rounded-lg" onClick={()=>handlegetProfile(se.username)}>
  {/* profile image */}
  <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
    <img
      src={se.profileImage || dp}
      alt=""
      className="w-full h-full object-cover"
    />
  </div>

  {/* name + headline */}
  <div className="flex flex-col">
    <div className="text-[21px] font-semibold text-gray-700">
      {`${se.firstname} ${se.lastname}`}
    </div>
    <div className="text-[15px] text-gray-500 mt-[2px]">
      {se.headline}
    </div>
  </div>
</div>


       
        </div>
      ))}
     </div>
     }


    <form className={`w-[200px] lg:w-[190px] lg:w-[350px] h-[40px] bg-[#f0efe7] flex items-center gap-[10px] px-[10px] py-[5px] rounded-md ${!activeSearch?"hidden lg:flex":"flex"}`}>
     {activeSearch?"":<div><IoSearch className='w-[30px] h-[22px] text-gray-600'/></div>}
     <input type="text" value={searchInput} className='w-[80%] h-full bg-transparent outline-none  border-0' placeholder='search users...' onChange={(e)=>setSearchInput(e.target.value)} />
   </form>
    </div>
    

    <div className='flex justify-center items-center gap-[20px] relative '>

    {showPopup && <div className='w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[75px] rounded-lg flex flex-col items-center p-[20px] gap-[20px] right-[5px] lg:right-[0px]'>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden cursor-pointer'>
        <img src={userData.data.profileImage || dp} alt="" className='w-full h-full object-cover' />
    </div>

    <div className='text-[21px] font-semibold text-gray-700'>{`${userData.data.firstname} ${userData.data.lastname}`}</div>
    <button
  className="w-[200px] h-[50px] rounded-full border-4 !border-blue-600 !text-white !bg-blue-400 
             !hover:bg-blue-600 !active:bg-blue-600 transition-all duration-200"
onClick={handleViewProfile}
>
  View Profile
</button>

    <div className='w-full h-[1px] bg-gray-700 '></div>

     <div className='flex  w-full items-center justify-start text-gray-600 gap-[10px] cursor-pointer' onClick={()=>{navigate("/network")}}>
        <ImUsers className='w-[23px] h-[23px] text-gray-600'/>
        <div>My Networks</div>
    </div>

    <button className='w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545]' onClick={()=>{handleSignOut()}}> Sign Out</button>
    </div> }

    


    <div className='lg:flex flex-col items-center justify-center cursor-pointer text-gray-600 hidden' onClick={()=>{navigate("/")}} >
    <FaHome className='w-[23px] h-[23px] text-gray-600'/>
    <div>Home</div>
    </div>

    <div className='md:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer' onClick={()=>{navigate("/network")}}>
        <ImUsers className='w-[23px] h-[23px] text-gray-600' />
        <div>My Networks</div>
    </div>
     
    <div 
  className='hidden lg:flex flex-col items-center justify-center text-gray-600 cursor-pointer' 
  onClick={()=>navigate("/notification")}
>
  <IoMdNotifications className='w-[23px] h-[23px] text-gray-600'/>
  <div className='hidden xl:block'>Notifications</div>      
</div>


    <div className='w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer' onClick={()=>setShowPopup(prev=>!prev)} >
        <img src={userData.data.profileImage || dp} alt="" className='w-full h-full' />
    </div>
    </div>

   </div>
  )
}

export default Nav