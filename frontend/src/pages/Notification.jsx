import React from 'react'
import Nav from '../components/Nav'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import dp from "../assets/dp.webp"
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from '../context/UserContext'

function Notification() {
    const {serverurl}=useContext(authDataContext)
    const{userData}=useContext(userDataContext)
    console.log("userData in notification:",userData)
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

    const handledeleteSingleNotification=async(id)=>{
       try {
        const result=await axios.delete(`${serverurl}/api/v1/notification/deleteone/${id}`,{withCredentials:true})
        console.log(result)
        await handleNotification()
       } catch (error) {
        console.log("handledeleteSingleNotification error",error)
       }
    }

    const handledeleteAllNotification=async()=>{
      try {
          const result=await axios.delete(`${serverurl}/api/v1/notification`,{withCredentials:true})
          console.log(result)
          await handleNotification()
      } catch (error) {
        console.log("handledeleteAllNotification error: ",error)
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
     <div className="w-full h-[80px] bg-white shadow-lg rounded-lg flex items-center justify-between p-[16px] text-[22px] text-gray-600">
  <span>Notifications: {notificationData.length}</span>

  {notificationData.length>0 && 

  <button className="bg-gray-100 !border-1 !border-blue-400 hover:!bg-gray-300 text-blue-800 text-[16px] px-4 py-2 rounded-md transition" onClick={handledeleteAllNotification}>
    Clear All
  </button> }
</div>


    {
        notificationData.length>0 &&
        <div>
          {notificationData.map((notify, index) => (
            <div
              key={index}
              className="relative w-full  max-w-screen flex flex-col items-start justify-between mt-6 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition"
            >
            <RxCross1 className='absolute top-2 right-2 w-[20px] h-[20px] text-gray-800 cursor-pointer hover:text-red-500 transition' onClick={()=>handledeleteSingleNotification(notify._id)} />
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
             <div className="flex flex-col items-center border rounded-lg p-3 bg-gray-50 shadow-sm ml-[110px] w-full overflow-hidden">
  {/* Image Box */}
  {notify.relatedPost.image && (
    <div className="w-[180px] h-[120px] overflow-hidden rounded-md mb-2">
      <img
        src={notify.relatedPost.image}
        alt=""
        className="w-full h-full object-cover"
      />
    </div>
  )}

  {/* Description Box */}
  {notify.relatedPost.description && (
    <div className="text-sm text-gray-700 text-center w-[1300px] overflow-hidden">
      {notify.relatedPost.description}
    </div>
  )}
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