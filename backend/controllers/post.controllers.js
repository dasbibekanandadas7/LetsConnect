import {asyncHandler} from "../utils/asyncHandler.js"
import { apiError } from "../utils/apierror.js"
import { apiResponse } from "../utils/apiresponse.js"
import Post from "../models/post.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import User from "../models/user.models.js"
import { io } from "../app.js"
import Notification from "../models/notification.models.js"


const createPost=asyncHandler(async(req,res)=>{
    let {description}=req.body;
    let newPost;
    console.log("request file :::",req.file);
    if(req.file){
        const uploadedimage=await uploadOnCloudinary(req.file?.path)

         newPost=await Post.create({
            author:req.user?._id,
            description,
            image:uploadedimage.secure_url
        })
    }
    else{
            newPost=await Post.create({
                author:req.user?._id,
                description
        }) 
    }

    if(!newPost){
       throw new apiError(401, "Post creation Unsuccessful")
    }

        return res.status(200).
        json(new apiResponse(200, newPost, "Post uploaded Successfully"))
    
})

const getPost=asyncHandler(async(req,res)=>{
  const post=await Post.find()
  .populate("author","firstname lastname headline profileImage username")
  .populate("comment.user","firstname lastname profileImage headline")
  .sort({createdAt:-1})

  if(!post){
    throw new apiError(401, "Couldn't find all posts")
  }
  
  return res.status(200)
  .json(new apiResponse(200,post,"Successfully found all the posts"))
})

const like=asyncHandler(async(req,res)=>{
    const postId=req.params.id
   const post=await Post.findById(postId);
   if(!post){
    throw new apiError(401, "Post not found")
   }

   const userId=req.user?._id

    // const alreadyLiked = post.like.some((id) => id.toString() === userId.toString());

   if(post.like.includes(userId)){
    post.like=post.like.filter((id)=>id.toString()!==userId.toString())
   }
   else{
   post.like.push(userId)

   if(post.author.toString() !== userId.toString()){
   let notification=await Notification.create({
    receiver:post.author,
    type:"like",
    relatedUser:userId,
    relatedPost:postId
   })}
   }

    await post.save(); //updated after change

   io.emit("likeUpdated",{postId, likes:post.like})

   return res.status(200)
   .json(new apiResponse(200,post,"Like Successful"))
})

const comment=asyncHandler(async(req,res)=>{
    const postId=req.params.id
    const userId=req.user?._id
    const {content}=req.body;

    const post=await Post.findById(postId)
    if(!post){
        throw new apiError(401, "Post is not found")
    }
    const postComment=await Post.findByIdAndUpdate(
        postId,
        {
           $push:{comment:{content,user:userId}}
        },{
          new: true
        }
    )
    .populate("author", "firstName lastName profileImage headline")
    .populate("comment.user", "firstname lastname profileImage headline")

    if(post.author.toString() !== userId.toString()){
    let notification=await Notification.create({
    receiver:post.author,
    type:"comment",
    relatedUser:userId,
    relatedPost:postId
   })}
    
    io.emit("commentEdit",{postId, comm:post.comment})
    console.log(post)
    
    if(!postComment){
        throw new apiError(401, "Comment unsucessful")
    }
    return res.status(200)
    .json(new apiResponse(200,postComment,"Comment successful"))
})

export {
    createPost,
    getPost,
    like,
    comment
}