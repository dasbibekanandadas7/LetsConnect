import React from 'react'
import io from "socket.io-client"
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import { useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const socket=io("http://localhost:8000")

function ConnectionButton({userId}) {
    const {serverurl}=useContext(authDataContext)
    const{userData, setUserData}=useContext(userDataContext)

    const[status, setStatus]=useState("connect")

    const navigate=useNavigate()

    const handleSendConnection=async()=>{
        try {
            const result=await axios.post(`${serverurl}/api/v1/connection/send/${userId}`,{},{withCredentials:true})
            console.log(result)
            setStatus(result.data.data.status)
        } catch (error) {
            console.log(error);
        }
    }
 
    const handleRemoveConnection=async()=>{
        try {
            const result=await axios.delete(`${serverurl}/api/v1/connection/removeconnection/${userId}`,{withCredentials:true})
           setStatus(result.data.data.status)
            console.log(result)
        } catch (error) {
            console.log(error);
        }
    }

    const handleGetStatus=async()=>{
        try {
            let result=await axios.get(`${serverurl}/api/v1/connection/getconnectionstatus/${userId}`,{withCredentials:true})
            console.log("connection::",result);
            setStatus(result.data.data.status)
        } catch (error) {
            console.log(error);
        }
    }

    const handleClick=async()=>{
        if(status=="disconnect"){
            await handleRemoveConnection()
        }else if(status=="received"){
             navigate("/network")
        } else{
           await handleSendConnection()
        }     
    }

    

    useEffect(() => {
        console.log(userData)
  socket.emit("register", userData?.data?._id);
  handleGetStatus();

  const handleStatusUpdate = ({ updatedUserId, newStatus }) => {
    if (userId === updatedUserId) {
      setStatus(newStatus);
    }
  };

  socket.on("statusUpdate", handleStatusUpdate);

  return () => {
    socket.off("statusUpdate", handleStatusUpdate);
  };
}, [userId]);


  return (
    <button
  className="w-[160px] h-[50px] !rounded-full border !border-blue-400 !text-blue-600 font-semibold
             hover:!bg-blue-100 hover:!text-black !active:bg-blue-100 !transition-all duration-200" disabled={status=="pending"} onClick={handleClick}> {status || "Connect"} </button>

  )
}

export default ConnectionButton
