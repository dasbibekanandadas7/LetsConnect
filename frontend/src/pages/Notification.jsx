import React from 'react'
import Nav from '../components/Nav'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import dp from "../assets/dp.webp"

function Notification() {
    const {serverurl}=useContext(authDataContext)
    const[notificationData, setNotificationData]=useState([])

    const handleNotification=async()=>{
        try {
            const result=await axios.get(serverurl+"/api/v1/notification/get", {withCredentials:true})
            console.log(result)
            setNotificationData(result.data.data)
        } catch (error) {
            console.log("handleNotification Error", error);
        }
    }

   function handleMessage(type){
    if(type=="like"){
        return "liked your post"
    }
    else if(type=="comment"){
        return "commented on your post"
    }
    else{
        return "accepted your connection request"
    }
   }

    useEffect(()=>{
        handleNotification()
    },[])

  return (
    <div className='w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[200px]'>
      <Nav/>
      <div className='w-full h-[80px] bg-white shadow-lg rounded-lg flex items-cnter p-[10px] text-[22px] text-gray-600'>
       Notifications: {notificationData.length}
    </div>

    {
        notificationData.length>0 &&
        <div>
          {notificationData.map((notify, index) => (
            <div
              key={index}
              className="w-full max-w-[1000%] flex items-center justify-between mt-6 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition"
            >
            <div>
              {/* Profile image and name */}
              <div className="flex items-center gap-4">
                <div className="w-[70px] h-[70px] rounded-full overflow-hidden cursor-pointer">
                  <img
                    src={notify.relatedUser.profileImage || dp}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-[21px] font-semibold text-gray-800">
                    {`${notify.relatedUser.firstname} ${notify.relatedUser.lastname}`}
                    <span> {handleMessage(notify.type)}</span>
                  </div>
                </div>            
              </div>

             {notify.relatedPost &&
             <div>
             {notify.relatedPost.image &&
                <div>
                    <img src={notify.relatedPost.image} alt="" />
                </div>}

             {notify.relatedPost.description &&
                <div>
                     {notify.relatedPost.description} 
                </div>}
             </div>
             }

              </div>
              
            </div>
          ))}
            </div>
    }


    </div>
  )
}

export default Notification