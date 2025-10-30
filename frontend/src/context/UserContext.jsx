import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext=createContext()


function UserContext({children}) {
  
  const [userData, setUserData]=useState(null)
  const {serverurl}=useContext(authDataContext)
  const [edit, setEdit]=useState(false)
  const[postData, setPostData]=useState([])


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

useEffect(() => {
  getCurrentUser(),
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
      getPost
  }



  return (
       <userDataContext.Provider value={value}>
          {children}
       </userDataContext.Provider>
 
  )
}

export default UserContext