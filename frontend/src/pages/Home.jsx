import React, { useContext, useState, useEffect } from 'react'
import Nav from '../components/Nav'
import dp from '../assets/dp.webp'
import { FaPlus } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { userDataContext } from '../context/UserContext';
import { IoPencil } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import EditProfile from '../components/EditProfile';
import { FaImage } from "react-icons/fa6";
import { useRef } from 'react';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import Post from '../components/Post';
import ConnectionButton from '../components/ConnectionButton';

function Home() {

  const{userData, setUserData, edit, setEdit,postData, setPostData, handlegetProfile}=useContext(userDataContext)
  const {serverurl}=useContext(authDataContext)

  const[frontendImage, setFrontendImage]=useState("")
  const[backendImage, setBackendImage]=useState("")
  const[description, setDescription]=useState("")
  const[uploadPost, setUploadPost]=useState(false)
  const[posting, setPosting]=useState(false)
  const[suggestedUser, setSuggestedUser]=useState([])

  let image=useRef()

  function handleImage(e){
    let file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }
  
   async function handleUploadPost(){
    setPosting(true)
    try{
       let formdata=new FormData()
       formdata.append("description", description)

       if(backendImage){
        formdata.append("image", backendImage)
       }
       let result=await axios.post(serverurl+"/api/v1/post/createpost",formdata, {withCredentials:true})
       console.log(result)
       setPosting(false);
       setDescription("")
       setBackendImage("")
       setFrontendImage("")
        if (image.current) {
        image.current.value = ""; // clear the file input
       }       
       setUploadPost(false)       
    }catch(error){
      setPosting(false)
       console.log(error)
    }
  }

  function handlePost(){
    setUploadPost(false)
    setDescription("")
    setBackendImage("")
    setFrontendImage("")
     if (image.current) {
      image.current.value = ""; // clear the file input
    }
  }

  function handleRemoveImage(){
    setBackendImage("")
    setFrontendImage("")
     if (image.current) {
      image.current.value = ""; // clear the file input
    }
  }

  const handleSuggestedUsers=async()=>{
    try {
      const result=await axios.get(serverurl+"/api/v1/user/suggestedusers",{withCredentials:true})
      console.log("SuggestedUser: ",result.data);
      setSuggestedUser(result.data.data)
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    handleSuggestedUsers()
  },[])
   
  return (
    <div className='w-screen max-w-[100vw] min-h-[100vh] bg-[#f0efe7] pt-[100px] flex items-center lg:items-start justify-center gap-[20px] px-4 lg:px-20 flex-col lg:flex-row relative pb-[50px] pb-[50px]'>
  
    {edit && <EditProfile/>}
     <Nav />

  {/* Left sidebar */}
<div className='w-full lg:w-[25%]  min-h-[400px] bg-white shadow-lg'>
  <div className='w-full h-[200px] bg-gray-400 rounded relative cursor-pointer' >
    <img src={userData.data.coverImage || dp} alt="" className='w-full h-full object-cover object-center rounded'/>
    {/* Camera icon at top-right of gray box */}
    <FaCamera className='absolute top-2 right-2 w-[32px] h-[32px] text-white cursor-pointer z-20' onClick={()=>setEdit(true)}/>

    {/* Avatar container */}
    <div className='absolute top-[95%] left-[2%] transform -translate-y-1/2 -translate-x-0' onClick={()=>setEdit(true)}>
      <div className='relative inline-block cursor-pointer' >
        <img src={userData.data.profileImage || dp} alt="" className='w-[80px] h-[80px] object-cover rounded-full' />

        {/* Plus icon on bottom-right of avatar */}
        <div className='w-[20px] h-[20px] bg-[#18b5ef] !rounded-full flex justify-center items-center 
                absolute bottom-0 right-0 -translate-x-1/4 -translate-y-1/4 z-10' >
          <FaPlus className='text-white text-[12px]' />
        </div>
      </div>
    </div>

  </div>


  <div className='flex flex-col items-start mt-[30px]'>
  <div className='flex flex-col items-start ml-1.5'>
  <span className='text-[30px] font-bold text-gray-700'>
    {`${userData.data.firstname} ${userData.data.lastname}`}
  </span>
  <span className='text-gray-600 text-[20px] font-bold'>
    {userData.data.headline || ""}
  </span>
  <span className='text-[20px] text-gray-700 font-bold'>
    {userData.data.location || ""}
  </span>
</div>


  <button className="
    !bg-blue-400 
    w-[90%] sm:w-[300px] md:w-[350px]   
    h-[45px]                           
    !rounded-full border-4 border-blue-400 text-white 
    hover:!bg-blue-600 active:!bg-blue-600
    my-2 mx-auto                       
    flex justify-center items-center gap-2 
    transition-all duration-200
  "
  onClick={()=>setEdit(true)}>
  Edit Profile <IoPencil />
</button>
</div>
</div>


{uploadPost && <div className='w-full h-full bg-black absolute z-[100] top-0 left-0 opacity-60'></div>}

{uploadPost && <div className='w-[90%] max-w-[500px] h-[600px] max-h-[90vh] overflow-y-auto bg-white shadow-lg top-[60px] rounded-lg fixed z-[200] p-[20px] flex flex-col items-start justify-start gap-[10px]'>
   <RxCross1 className='absolute top-[16px] right-[16px] w-[20px] h-[20px] cursor-pointer text-gray-800' onClick={handlePost}/>
  <div className='flex justify-start items-center gap-[10px] mt-[20px]'>
    <div className='relative inline-block cursor-pointer'>
      <img src={userData.data.profileImage || dp} alt="" className='w-[50px] h-[50px] object-cover rounded-full' />
    </div>
    <div className='text-[24px] font-bold text-gray-700'>
      {`${userData.data.firstname} ${userData.data.lastname}`}
    </div>
  </div>

  {/* textarea section */}
  <textarea
  value={description}
  className={`w-full ${frontendImage ? "!h-[300px]" : "h-[600px]"} !max-h-[800px] border border-gray-300 rounded-md p-[10px] resize-none overflow-y-auto focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-gray-400 placeholder:font-normal`}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="What do you want to talk about?"
></textarea>


     {frontendImage && (
  <div className='w-full h-[300px] overflow-hidden relative rounded-md'>
    <img src={frontendImage} alt="Preview" className='w-full h-full object-cover' />
    <RxCross1
      className='absolute top-2 right-2 w-5 h-5 text-white bg-black/60 rounded-full p-1 cursor-pointer hover:bg-black'
      onClick={handleRemoveImage}
    />
  </div>
)}

   <input type="file" ref={image} hidden onChange={handleImage}/>
   <div className='w-full flex items-center justify-between '>
    <FaImage className='w-[40px] h-[40px] text-gray-500' onClick={()=>image.current.click()}/>
    <button className='w-[90px] md:w-[60px] h-[60px] px-5 py-2 !bg-blue-500 text-white rounded-md hover:!bg-blue-700 transition-colors duration-150 flex justify-center items-center' disabled={posting} onClick={handleUploadPost}>{posting?"Posting...":"Post"}</button>
  </div>
</div>}


 {/* Middle content */}
  <div className='w-full lg:w-[50%]  min-h-[200px] bg-[#f0efe7] shadow-lg flex flex-col !gap-[30px]'>
    <div className='w-full h-[90px] bg-white shadow-lg rounded-lg flex items-center justify-start gap-8'>
      <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer '>
         <img src={userData.data.profileImage || dp} alt="" className='w-full h-full object-cover object-center'/>
      </div>
      <button className='w-[80%] h-[60px] border-2 !rounded-full border-gray-500 flex items-center justify-start hover:!bg-gray-200 transition-colors duration-200 !cursor-text' onClick={()=>setUploadPost(true)}>Start a post</button>  
    </div>

    <div className="flex flex-col gap-6">
      {
        postData && postData.map((post, index)=>(
          <Post  key={post?._id} id={post?._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt}/>
        ))
      }
    </div>
  </div>

  {/* Right sidebar */}
  <div className='w-full lg:w-[25%] shadow-lg min-h-[120px] bg-white shadow-lg hidden lg:flex flex-col'>
    <div className='text-[30px] text-gray-600 font-semibold flex items-start mt-2 ml-2'>Suggested users:</div>
    <div className='flex flex-col gap-4'>
      {suggestedUser.length>0 && 
      <div>
        {suggestedUser.map((su,index)=>(
         <div
  key={su._id || index}
  className="flex items-center justify-between mt-2 mb-2 px-2 hover:bg-gray-100"
>
  {/* Left Section: Profile + Name + Headline */}
  <div className="flex items-start gap-3">
    {/* Profile Image */}
    <div className="w-[40px] h-[40px] rounded-full overflow-hidden ml-2 flex-shrink-0" onClick={()=>handlegetProfile(su.username)}>
      <img
        src={su.profileImage || dp}
        alt=""
        className="w-full h-full object-cover"
      />
    </div>

    {/* Name + Headline */}
    <div className="flex flex-col min-w-0">
      {/* Name */}
      <div className="text-[17px] font-semibold text-gray-800 leading-tight break-words">
        {`${su.firstname} ${su.lastname}`}
      </div>

      {/* Headline */}
      <div className="text-[14px] text-gray-500 font-normal leading-snug truncate">
        {su.headline}
      </div>
    </div>
  </div>

  {/* Right Section: Connection Button */}
  <div className="mr-3 ml-3 flex-shrink-0">
    <ConnectionButton userId={su._id} />
  </div>
</div>



        ))}
      </div>
      }

       {suggestedUser.length==0 && 
      <div>
         No suggested User
      </div>
      }


    </div>
  </div>

  
</div>

  )
}

export default Home