import React, { useContext, useEffect, useState } from 'react'
import Nav from "../components/Nav"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import dp from "../assets/dp.webp"
import { FaCheck } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";

import io from "socket.io-client"

const socket=io("http://localhost:8000")

function Network() {
  const {serverurl}=useContext(authDataContext)

  const[connections, setConnections]=useState([])

  const handleGetRequest=async()=>{
    try {
      const result=await axios.get(`${serverurl}/api/v1/connection/requests`, {withCredentials: true})
      console.log("network res::",result)
      setConnections(result.data.data)
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleAcceptConnection=async(requestId)=>{
    try {
      const result=await axios.put(`${serverurl}/api/v1/connection/accept/${requestId}`,{},{withCredentials: true})
      setConnections(connections.filter((con)=>con._id!=requestId))
    } catch (error) {
      console.log(error);
    }
  }

   const handleRejectConnection=async(requestId)=>{
    try {
      const result=await axios.put(`${serverurl}/api/v1/connection/reject/${requestId}`,{withCredentials:true})
      setConnections(connections.filter((con)=>con._id!=requestId))
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    handleGetRequest()
  },[])



  return (
    <div className='w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[200px]'>
    <Nav/>
    <div className='w-full h-[80px] bg-white shadow-lg rounded-lg flex items-cnter p-[10px] text-[22px] text-gray-600'>
       Invitations: {connections.length}
    </div>
   {
    connections.length>0 &&
     <div>
  {connections.map((connection, index) => (
    <div
      key={index}
      className="w-full max-w-[1000%] flex items-center justify-between mt-6 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition"
    >
      {/* Profile image and name */}
      <div className="flex items-center gap-4">
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden cursor-pointer">
          <img
            src={connection.sender.profileImage || dp}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="text-[21px] font-semibold text-gray-800">
            {`${connection.sender.firstname} ${connection.sender.lastname}`}
          </div>
          <div className="text-gray-500 text-sm">Software Developer</div> {/* optional */}
        </div>
      </div>

      {/* Accept / Reject buttons on right */}
      <div className="flex items-center gap-3">
      {/* Accept button */}
  <button className='border  !rounded-full border-2 !border-green-600 hover:!bg-green-100 !transition' onClick={()=>handleAcceptConnection(connection._id)}>
    <FaCheck size={18} className='!text-green-600' />
  </button>

  {/* Reject button */}
  <button className='border !rounded-full border-2 !border-red-600 hover:!bg-red-100 !transition' onClick={()=>handleRejectConnection(connection._id)} >
    <RxCross1 size={18} className='text-red-600'/>
  </button>

      </div>
    </div>
  ))}
    </div>

   }
    </div>
  )
}

export default Network