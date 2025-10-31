import React, { useEffect } from 'react'
import dp from "../assets/dp.webp"
import { useContext } from 'react'
import { userDataContext } from '../context/UserContext'
import moment from 'moment';
import { useState } from 'react';
import { SlLike } from "react-icons/sl";
import { FaComment } from "react-icons/fa";
import { FaCommentDots } from "react-icons/fa6";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import { AiFillLike } from "react-icons/ai";
import { LuSendHorizontal } from "react-icons/lu";
import {io} from "socket.io-client"
import ConnectionButton from './ConnectionButton';

const socket=io("http://localhost:8000")

function Post({id, author, like, comment, description, image, createdAt}) {
  const{userData}=useContext(userDataContext)
  const[more, setMore]=useState(false) //more == true means the description is in deatils. more==false means the desc is less
  const[likes, setLikes]=useState(like || [])
  const[commentContent , setCommentContent]=useState("")
  const[comments, setComments]=useState(comment || [])
  const[showComment, setShowComment]=useState(false)
  
  const {serverurl}=useContext(authDataContext)
  const{getPost, handlegetProfile}=useContext(userDataContext) 

  const liked=async()=>{
    try {
       const result=await axios.get(serverurl+`/api/v1/post/like/${id}`,{withCredentials:true})
       setLikes(result.data.data.like)
    } catch (error) {
      console.log(error);
    }
  }

   const commented=async(e)=>{
    e.preventDefault();
    try {
       const commentresult=await axios.post(serverurl+`/api/v1/post/comment/${id}`,{content: commentContent},{withCredentials:true})
       console.log("comment result: ",commentresult)
       setComments(commentresult.data.data.comment)
       setCommentContent("")
       setShowComment(true)

    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(()=>{
    socket.on("likeUpdated",({postId, likes})=>{
       if(postId==id){
        setLikes(likes)
       }
    })

    socket.on("commentEdit",({postId, comm})=>{
       if(postId==id){
        setComments(likes)
       }
    })

    return()=>{
     socket.off("likeUpdated")
     socket.off("commentEdit")
    }
    
  },[id])
  
   
  return (
    <div className="w-full min-h-[200px] gap-[10px] bg-white flex flex-col rounded-lg shadow-lg  p-[20px]">
    
    <div className='flex justify-between items-center'>
        <div className='flex justify-center items-start gap-[10px]'>
        <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer '
        onClick={()=>handlegetProfile(author.username)}>
                 <img src={author.profileImage|| dp} alt="" className='w-full h-full object-cover object-center'/>
        </div>

        <div className="flex flex-col items-start text-left">
          <div className='text-[20px] font-semibold text-gray-700'>
           {`${author.firstname} ${author.lastname}`}
          </div>
          <div className='text-[15px] font-medium text-gray-700'>
           {`${author.headline}`}
          </div>
          <div className='text-[15px] text-gray-700'>
          {moment(createdAt).fromNow()}
          </div>
      </div>

      </div>
      {
       userData.data._id!=author._id && <ConnectionButton userId={author._id}/>
      }
      
    </div>


     {/* Post description */}
     <div className='w-full pl-[10px] text-left flex flex-wrap items-start'>
     <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
      more ? "max-h-[1000px]" : "max-h-[100px]"
    }`}>{description}</div>

      <div className='text-blue-600 cursor-pointer hover:underline mt-2 inline-block' onClick={()=>setMore(!more)}>{description.length>100 && (more?"show less":"read more...")} </div>

     {image && <div className='w-full h-[300px] overflow-hidden flex justify-center mt-10'>
      <img src={image} alt="" className='h-full'/>
     </div>}

     </div>


      {/* show number */}
    <div className="flex items-center justify-end gap-6 ml-3 border-b-2 border-black">
  <div className="flex items-center gap-2">
    <SlLike className="text-blue-500"/>
    <span>{likes.length}</span>
  </div>

  <div className="flex items-center gap-2">
    <FaComment className="text-blue-500"/>
    <span>{comments.length}</span>
  </div>
</div>



     {/* can like and comment */}
     <div className="flex justify-start items-center gap-10 ml-3">
  {/* Like section */}

  {!likes.includes(userData.data._id) &&  <div className="flex flex-col items-center">   
  <SlLike className="text-2xl text-gray-700 cursor-pointer" onClick={liked}/>  
    <span className="text-semibold text-gray-600 mt-1">Like</span>
  </div>}

  {likes.includes(userData.data._id) &&  <div className="flex flex-col items-center">   
  <AiFillLike className="text-2xl !text-blue-500 cursor-pointer" onClick={liked}/>  
    <span className="text-semibold !text-blue-500 text-gray-600 mt-1">Liked</span>
  </div>}
  

  {/* Comment section */}
  <div className="flex flex-col items-center" onClick={()=>setShowComment(!showComment)}>
    <FaCommentDots className="text-2xl text-gray-700 cursor-pointer" />
    <span className="text-sm text-gray-600 mt-1">Comment</span>
  </div>
</div>

 {showComment && <div>
   <form className="flex items-center gap-3 w-full mt-4 border border-gray-300 rounded-full px-4 py-2 bg-gray-50 focus-within:shadow-sm" onSubmit={commented}>
  <input
    type="text"
    value={commentContent}
    onChange={(e) => setCommentContent(e.target.value)}
    placeholder="Leave a comment..."
    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
  />

  <button
    type="submit"
    disabled={!commentContent.trim()}
    className="text-blue-500 hover:text-blue-600 transition-all duration-200"
  >
    <LuSendHorizontal className="text-2xl"  />
  </button>
</form>

   
       <div className="flex flex-col gap-4 mt-4">
  {comments.length === 0 && (
    <p className="text-gray-500 text-sm text-center">No comments yet. Be the first to comment!</p>
  )}
  {comments.map((com) => (
    <div
      key={com._id}
      className="flex gap-3 items-start bg-gray-50 hover:bg-gray-100 transition-all duration-200 rounded-lg p-3 border border-gray-200"
    >
      {/* User profile image */}
      <div className="w-[45px] h-[45px] rounded-full overflow-hidden flex-shrink-0">
        <img
          src={com.user?.profileImage || dp}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Comment content */}
      <div className="flex flex-col items-start text-left w-full">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 text-[15px]">
            {`${com.user?.firstname} ${com.user?.lastname}`}
          </span>         
        </div>

        <p className="bg-white text-gray-700 p-2 rounded-lg mt-1 shadow-sm border border-gray-100 w-fit max-w-[90%]">
          {com.content}
        </p>
      </div>
    </div>
  ))}
</div>
  

    </div>} 
    
    </div>
  )
}

export default Post