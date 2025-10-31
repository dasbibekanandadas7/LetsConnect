import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { userDataContext } from '../context/UserContext'
import dp from '../assets/dp.webp'
import { FaPlus } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import EditProfile from '../components/EditProfile';
import Post from '../components/Post';
import ConnectionButton from '../components/ConnectionButton';
import { useParams } from 'react-router-dom';

function Profile() {
  const { username } = useParams();
    const{edit,setEdit, userData, setUserData, postData, setPostData, userProfileData, setUserProfileData,handlegetProfile}=useContext(userDataContext)
    const {serverurl}=useContext(authDataContext)
    console.log("POST::",userProfileData )
    
    const[profilePost, setProfilePost]=useState([])   

   useEffect(() => {
     if (username) {
    handlegetProfile(username);
  }
}, [username]);

   useEffect(() => {
  if (postData.length > 0 && userProfileData?.data?._id) {
    const filteredPosts = postData.filter(
      (post) => post?.author?._id === userProfileData.data._id
    );
    setProfilePost(filteredPosts);
  }
}, [postData, userProfileData]);


   console.log("profilePost:: ",profilePost)
   if (!userProfileData?.data?._id) {
  return (
    <div className="flex items-center justify-center h-screen text-lg font-semibold">
      Loading Profile...
    </div>
  );
}


  return (
    <div className='w-full min-h-screen bg-[#f0efe7] flex flex-col items-center px-2 sm:px-4 md:px-6'>
    <Nav className='mb-2'/>8
    {edit && <EditProfile/>}

    <div className="w-screen min-h-[55vh] max-w-[1000px] mt-[80px] mx-auto bg-white rounded-lg shadow-sm flex flex-col gap-[10px]">
  {/* Cover Image Section */}
  <div className="relative w-full">
    <div className="w-full h-[250px] bg-gray-300 rounded-lg overflow-hidden relative">
      <img
        src={userProfileData.data?.coverImage || dp}
        alt="cover"
        className="w-full h-full object-contain object-center bg-gray-200"
      />
      <FaCamera
        className="absolute top-3 right-3 w-[32px] h-[32px] text-white cursor-pointer z-20 drop-shadow"
        onClick={() => setEdit(true)}
      />
    </div>

    {/* Profile Image */}
    <div
      className="absolute -bottom-10 left-8 flex items-center cursor-pointer"
      onClick={() => setEdit(true)}
    >
      <div className="relative w-[100px] h-[100px]">
        <img
          src={userProfileData.data?.profileImage || dp}
          alt="profile"
          className="w-full h-full object-cover rounded-full border-[4px] border-white shadow-md"
        />
        <div className="w-[24px] h-[24px] bg-[#18b5ef] rounded-full flex justify-center items-center absolute bottom-0 right-0">
          <FaPlus className="text-white text-[12px]" />
        </div>
      </div>
    </div>
  </div>

  {/* User Info */}
  <div className="flex flex-col items-start mt-[60px] ml-[30px]">
    <h2 className="text-[22px] sm:text-[28px] font-bold text-gray-900 leading-tight">
      {userProfileData.data.firstname} {userProfileData.data.lastname}
    </h2>
    <div className="text-[22px] font-semibold text-black mt-1">
      {userProfileData.data.headline}
    </div>
    <div className="text-[22px] font-semibold text-black mt-1">
      {userProfileData.data.location}
    </div>
    
    <div className="text-[22px] font-semibold text-black mt-1">
      {`${userProfileData.data.connection.length} connections`}
    </div>

  </div>

  {/* ✅ Full-width Button */}

   {userProfileData.data._id==userData.data._id && <div className="w-full mt-8 px-4 sm:px-6">
    <button
      className="
        w-full
        h-[50px]
        bg-blue-500
        !rounded-full
        !border-2 !border-blue-500
        text-blue-700 font-semibold text-[18px]
        hover:!bg-gray-100 active:bg-blue-700
        flex justify-center items-center gap-2
        transition-all duration-200
      "
      onClick={()=>setEdit(true)}
    >
      Edit Profile <IoPencil />
    </button>
  </div>
  }
  {userProfileData.data._id!=userData.data._id && <div className=' flex items-start ml-[20px] mb-1'> <ConnectionButton userId={userProfileData.data._id}/></div>
  }
    </div>

    <div className='w-full h-[100px] flex items-center p-[20px] text-[22px] text-black-500 font-semibold bg-white mt-2 shadow-2xl'>
       {`Posts(${profilePost.length})`}
    </div>
    
    {/* All Posts */}
    <div className="w-full  max-w-[1000px] mx-auto flex flex-col gap-6 px-4 sm:px-6 mt-4">
      {profilePost.map((post) => (
        <Post
          key={post?._id}
          id={post?._id}
          description={post.description}
          author={post.author}
          image={post.image}
          like={post.like}
          comment={post.comment}
          createdAt={post.createdAt}
        />
      ))}
    </div>
   
   {/* Skills     */}
   
  {userProfileData.data.skills.length > 0 && (
  <div className="w-full flex flex-col bg-white shadow-lg rounded-lg mt-2 mb-4 p-4">
    {/* Skills Row */}
    <div className="flex items-center gap-4 flex-wrap">
      <div className="text-[20px] font-semibold text-gray-800 whitespace-nowrap">
        Skills:
      </div>

      <div className="flex flex-wrap gap-3">
        {userProfileData.data.skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full shadow-sm text-[16px] font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>

    {/* Add Button */}
    {userProfileData.data._id==userData.data._id && <div className="mt-4 flex justify-start">
      <button className="w-[20%] h-[40px] !rounded-full !border-2 !border-[#2dc0ff] text-[#1da2d7] font-semibold hover:!bg-[#e6f7ff] transition" onClick={()=>setEdit(true)}>
        Add
      </button>
    </div>}
  </div>
  )}


  {/* Education */}

   {userProfileData.data.education.length>0 &&
  <div className="w-full flex flex-col items-start bg-white shadow-lg rounded-lg mt-2 mb-4 p-6">
  {/* Title */}
  <div className="text-[22px] font-semibold text-gray-800 mb-4">
    Education:
  </div>

  {/* Education Details */}
  <div className="flex flex-col gap-6 items-start text-left">
    {userProfileData.data.education.map((edu, index) => (
      <div
        key={index}
        className="flex flex-col gap-2 border-b border-gray-200 pb-4"
      >
        <div className="text-[18px] text-gray-800">
          <span className="font-semibold">College:</span> {edu.college}
        </div>
        <div className="text-[18px] text-gray-800">
          <span className="font-semibold">Degree:</span> {edu.degree}
        </div>
        <div className="text-[18px] text-gray-800">
          <span className="font-semibold">Field of Study:</span> {edu.fieldOfStudy}
        </div>
      </div>
    ))}
  </div>
   {userProfileData.data._id==userData.data._id &&
  <div className="mt-6">
    <button
      className="w-[20%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#1da2d7] font-semibold hover:bg-[#e6f7ff] transition"
      onClick={() => setEdit(true)}
    >
      Add
    </button>
  </div>}
</div>
   }
    

     {userProfileData.data.experience.length>0 &&
  <div className="w-full flex flex-col items-start bg-white shadow-lg rounded-lg mt-2 mb-4 p-6">
  {/* Title */}
  <div className="text-[22px] font-semibold text-gray-800 mb-4">
    Experience:
  </div>

  {/* Experience Details */}
  <div className="flex flex-col gap-6 items-start text-left">
    {userProfileData.data.experience.map((exp, index) => (
      <div
        key={index}
        className="flex flex-col gap-2 border-b border-gray-200 pb-4"
      >
        <div className="text-[18px] text-gray-800">
          <span className="font-semibold">Title:</span> {exp.title}
        </div>
        <div className="text-[18px] text-gray-800">
          <span className="font-semibold">Company:</span> {exp.company}
        </div>
        <div className="text-[18px] text-gray-800">
          <span className="font-semibold">Description:</span> {exp.description}
        </div>
      </div>
    ))}
  </div>

  {/* Add Button */}
  {userProfileData.data._id==userData.data._id && <div className="mt-6">
    <button
      className="w-[20%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#1da2d7] font-semibold hover:bg-[#e6f7ff] transition"
      onClick={() => setEdit(true)}
    >
      Add
    </button>
  </div>}
</div>
   }


   </div>
  )
}

export default Profile