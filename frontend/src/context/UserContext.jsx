import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const userDataContext=createContext()

import {io} from "socket.io-client"
export const socket=io("http://localhost:8000")

function UserContext({children}) {
  
  const [userData, setUserData]=useState(null)
  const {serverurl}=useContext(authDataContext)
  const [edit, setEdit]=useState(false)
  const[postData, setPostData]=useState([])
  const[userProfileData, setUserProfileData]=useState({ data: {} })

  const navigate=useNavigate()
  const getCurrentUser = async () => {
    try {
      const result = await axios.get(serverurl + "/api/v1/user/currentuser", {
        withCredentials: true 
      });
      setUserData(result.data);
      console.log("Context:",result.data)
    } catch (error) {
      console.log("Error fetching user:", error);
      setUserData(null);
    }
  }

    const getPost=async()=>{
    try {
      const result=await axios.get(serverurl+"/api/v1/post/getpost",
        {withCredentials:true}
      )
       console.log("getPost result",result)       
       setPostData(result.data.data || [])
    } catch (error) {
      console.log(error);
      setPostData([])
    }finally {
        setLoading(false); 
      }
  }


  const [loading, setLoading] = useState(true);

  const handlegetProfile=async(username)=>{
    console.log("username",username)
    try {
       const result = await axios.get(serverurl + `/api/v1/user/profile/${username}`, {
        withCredentials: true 
      });
      setUserProfileData(result.data)
      console.log("result of userProfile::",result);
      navigate(`/profile/${username}`)
    } catch (error) {
      console.log("Unable to fetch user Profile data: ",error);
    }
  }

useEffect(() => {
  getCurrentUser()
  getPost()
  },[]);



    const value={
      userData,
      setUserData,
      edit,
      setEdit,
      postData,
      setPostData,
      loading,
      setLoading,
      getPost,
      userProfileData,
      setUserProfileData,
      handlegetProfile
  }



  return (
       <userDataContext.Provider value={value}>
          {children}
       </userDataContext.Provider>
 
  )
}

export default UserContext