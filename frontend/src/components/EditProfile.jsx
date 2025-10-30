import React, { useState } from 'react'
import { useContext } from 'react';
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from '../context/UserContext';
import dp from '../assets/dp.webp'
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import { authDataContext } from '../context/AuthContext';
import { useRef } from 'react';
import axios from 'axios';

function EditProfile() {
 const{userData, setUserData, edit, setEdit}=useContext(userDataContext)
 const{serverurl}=useContext(authDataContext)

 console.log("userData in edit: ",userData)

 const[firstname,setFirstName]=useState(userData.data.firstname || "")
 const[lastname,setLastName]=useState(userData.data.lastname || "")
 const[username,setUserName]=useState(userData.data.username || "")
 const[headline,setHeadline]=useState(userData.data.headline || "")
 const[location,setLocation]=useState(userData.data.location || "")
 const[gender,setGender]=useState(userData.data.gender || "")
 const[skills, setSkills]=useState(userData.data.skills || [])
 const[education , setEducation]=useState(userData.data.education || [])
 const[experience, setExperience]=useState(userData.data.experience || [])

 const[saving,setSaving]=useState(false);
 
 const [newSkills, setNewSkills]=useState("")
 const[newEducation, setNewEducation]=useState({
  college:"",
  degree:"",
  fieldOfStudy:""
 })
 const[newExperience, setNewExperience]=useState({
    title:"",
    company:"",
    description:""
 })

const[frontendProfileImage , setFrontendProfileImage]=useState(userData.data.profileImage || dp)
const[backendProfileImage , setBackendProfileImage]=useState(null)

const[frontendCoverImage , setFrontendCoverImage]=useState(userData.data.coverImage || null)
const[backendCoverImage , setBackendCoverImage]=useState(null)

 const profileImage=useRef()
 const coverImage=useRef()

 function addSkill(e){
    e.preventDefault();
    if(newSkills && !skills.includes(newSkills)){
        setSkills([...skills,newSkills])
    }
    setNewSkills("")
 }
 
 function removeSkill(skill){
  if(skills.includes(skill)){
    setSkills(skills.filter((s)=>s!==skill))
  }
 }

 function addEducation(e){
    e.preventDefault();
    if(newEducation.college && newEducation.degree && newEducation.fieldOfStudy){
        setEducation([...education,newEducation])
    }
    setNewEducation({
       college:"",
       degree:"",
       fieldOfStudy:""
    })
 }

 function removeEducation(edu){
    if(education.includes(edu)){
      setEducation(education.filter((e)=>e!==edu))
    }
 }

 function addExperience(e){
    e.preventDefault();
    if(newExperience.title && newExperience.company && newExperience.description){
      setExperience([...experience, newExperience])
    }
    setNewExperience({
      title:"",
    company:"",
    description:""
    })
 }
 function removeExperience(expert){
    if(experience.includes(expert)){
      setExperience(experience.filter((e)=>e!==expert))
    }

 }


 function handleProfileImage(e){
  const file=e.target.files[0];
  setBackendProfileImage(file);
  setFrontendProfileImage(URL.createObjectURL(file))
 } 

 function handleCoverImage(e){
  const file=e.target.files[0];
  setBackendCoverImage(file);
  setFrontendCoverImage(URL.createObjectURL(file))
 } 

const handleSaveProfile=async()=>{
  setSaving(true)

  try {
    let formdata=new FormData()
    formdata.append("firstname",firstname)
    formdata.append("lastname",lastname)
    formdata.append("username",username)
    formdata.append("headline",headline)
    formdata.append("location",location)
    formdata.append("skills",JSON.stringify(skills))
    formdata.append("education",JSON.stringify(education))
    formdata.append("experience",JSON.stringify(experience))

    if(backendProfileImage){
      formdata.append("profileImage", backendProfileImage);
    }
    if(backendCoverImage){
      formdata.append("coverImage", backendCoverImage);
    }
    for (let [key, value] of formdata.entries()) {
    console.log(key, value);
    }

    let result=await axios.patch(serverurl+"/api/v1/user/updateprofile", formdata, {withCredentials:true})
    console.log("after upload update: ",result.data)
    setUserData(result.data)
    setSaving(false);
    setEdit(false);   
  } catch (error) {
    console.log("Handle saveProfile Error::", error);
    setSaving(false);
  }
}
  return (
    <div className='fixed inset-0 z-[100] flex justify-center items-center
  md:justify-center md:items-center'>

       <input type="file" accept='image/*' hidden ref={profileImage} onChange={handleProfileImage}/>
       <input type="file" accept='image/*' hidden ref={coverImage} onChange={handleCoverImage}/>

       <div className='w-full h-full bg-black opacity-[0.5] absolute top-0 left-0'></div>
         <div className='w-[90%] max-w-[500px] h-[600px] bg-white relative overflow-auto z-[200] shadow-lg rounded-lg p-[10px] overflow-auto' >
         <div className='absolute top-[20px] right-[20px] cursor-pointer' onClick={()=>setEdit(false)}><RxCross1 className='w-[25px] cursor-pointer h-[25px] text-gray-800 font-bold ' /></div>
         <div className='w-full h-[150px] bg-gray-500 rounded-lg mt-[40px] overflow-hidden' onClick={()=>coverImage.current.click()}>
           <img src={frontendCoverImage} alt="" className='w-full'/>
           <FiCamera className='absolute right-[20px] top-[60px] w-[25px] h-[25px] text-white cursor-pointer' />
         </div>
          <div className='w-[80px] h-[80px] rounded-full overflow-hidden absolute top-[150px] ml-[20px]' onClick={()=>profileImage.current.click()}>
                 <img src={frontendProfileImage} alt="" className='w-full h-full object-cover' />
             </div>
             <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[200px] left-[90px] rounded-full flex justify-center items-center cursor-pointer' onClick={()=>profileImage.current.click()}>
          <FiPlus className='text-white' />
        </div>
         <div className='w-full flex flex-col items-center justify-center gap-[20px] mt-8'>
            <input type="text" placeholder='firstname' value={firstname} onChange={(e)=>setFirstName(e.target.value)} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg placeholder-gray-400'/>
            <input type="text" placeholder='lastname'  value={lastname} onChange={(e)=>setLastName(e.target.value)} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg placeholder-gray-400'/>
            <input type="text" placeholder='username'  value={username} onChange={(e)=>setUserName(e.target.value)}  className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg placeholder-gray-400'/>
            <input type="text" placeholder='headline'  value={headline} onChange={(e)=>setHeadline(e.target.value)} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg placeholder-gray-400'/>
            <input type="text" placeholder='location'  value={location} onChange={(e)=>setLocation(e.target.value)}className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg placeholder-gray-400'/>
            <input type="text" placeholder='gender (Male/Female/Others)'  value={gender} onChange={(e)=>setGender(e.target.value)} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg placeholder-gray-400'/>
        
           <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
            <h3 className='text-[19px] font-semibold text-left'>Skills: </h3>
            {skills && <div className="w-full flex flex-col gap-[10px]">
              {
                skills.map((skill,index)=>(
                    <div key={index} className='w-full h-[40px] border border-gray-600 bg-gray-200 flex items-center px-[10px] rounded-md flex justify-between items-center'><span>{skill}</span> <RxCross1 className='w-[20px] cursor-pointer h-[20px] text-gray-800 font-bold ' onClick={()=>removeSkill(skill)} /></div>
                ))
              }
            </div>}

            <div className='flex flex-col gap-[10px] items-start'>
              <input type="text" placeholder='add new skill' value={newSkills} onChange={(e)=>setNewSkills(e.target.value)} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg  placeholder-gray-400'/>
              <button className='w-[20%] h-[40px] rounded-full border-2 !border-[#2dc0ff] text-[#1da2d7]' onClick={addSkill}>Add</button>
            </div>
           </div>



          {/* Education */}
           <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
            <h3 className='text-[19px] font-semibold text-left'>Education: </h3>
            {education && <div className="w-full flex flex-col gap-[10px]">
              {
                education.map((educate,index)=>(
                    <div key={index} className='w-full border border-gray-600 bg-gray-200 px-[10px] py-[8px] rounded-md flex justify-between items-start'><div>
                      <div className="flex flex-col text-left gap-[3px]">
                      <div  className="font-semibold">College: {educate.college}</div>
                       <div className="font-semibold">Degree: {educate.degree}</div>
                        <div className="font-semibold">Field of Study: {educate.fieldOfStudy}</div>
                    </div>
                    </div> 
                    <RxCross1 className='w-[20px] cursor-pointer h-[20px] text-gray-800 font-bold ' onClick={()=>removeEducation(educate)}/>
                    </div>
                    
                ))
              }
            </div>}

            <div className='flex flex-col gap-[10px] items-start'>
              <input type="text" placeholder='College' value={newEducation.college} onChange={(e)=>setNewEducation({...newEducation, college:e.target.value})} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg  placeholder-gray-400'/>
              <input type="text" placeholder='Degree' value={newEducation.degree} onChange={(e)=>setNewEducation({...newEducation, degree:e.target.value})} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg  placeholder-gray-400'/>
              <input type="text" placeholder='Field of study' value={newEducation.fieldOfStudy} onChange={(e)=>setNewEducation({...newEducation, fieldOfStudy:e.target.value})} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg  placeholder-gray-400'/>
              <button className='w-[20%] h-[40px] rounded-full border-2 !border-[#2dc0ff] text-[#1da2d7]' onClick={addEducation}>Add</button>
            </div>
           </div>


            {/* Experience */}
           <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
            <h3 className='text-[19px] font-semibold text-left'>Experience: </h3>
            {experience && <div className="w-full flex flex-col gap-[10px]">
              {
                experience.map((expert,index)=>(
                    <div key={index} className='w-full border border-gray-600 bg-gray-200 px-[10px] py-[8px] rounded-md flex justify-between items-start'><div>
                       <div className="flex flex-col text-left gap-[3px]">
                      <div className="font-semibold">Title: {expert.title}</div>
                       <div className="font-semibold">Company: {expert.company}</div>
                        <div className="font-semibold"> Description: {expert.description}</div>
                    </div> 
                    </div>
                    <RxCross1 className='w-[20px] cursor-pointer h-[20px] text-gray-800 font-bold mt-[5px]' onClick={()=>removeExperience(expert)}/>
                    </div>
                    
                ))
              }
            </div>}

            <div className='flex flex-col gap-[10px] items-start'>
              <input type="text" placeholder='Title' value={newExperience.title} onChange={(e)=>setNewExperience({...newExperience, title:e.target.value})} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg  placeholder-gray-400'/>
              <input type="text" placeholder='Company' value={newExperience.company} onChange={(e)=>setNewExperience({...newExperience, company:e.target.value})} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg  placeholder-gray-400'/>
              <input type="text" placeholder='Description' value={newExperience.description} onChange={(e)=>setNewExperience({...newExperience, description:e.target.value})} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg  placeholder-gray-400'/>
              <button className='w-[20%] h-[40px] rounded-full border-2 !border-[#2dc0ff] text-[#1da2d7]' onClick={addExperience}>Add</button>
            </div>
           </div>

           <button className='w-full h-[50px] rounded-full  bg-[#5b78e2]! mt-10 text-black disabled={saving}' onClick={handleSaveProfile}>{saving?"Saving...":"Save Profile"}</button>

         </div>

       </div>
       <div>
         
       </div>
    </div>
  )
}

export default EditProfile