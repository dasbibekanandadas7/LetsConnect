import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import { apiError } from "../utils/apierror.js";
import { apiResponse } from "../utils/apiresponse.js";
import {upload} from '../middleware/multer.middleware.js'
import {uploadOnCloudinary} from "../utils/cloudinary.js"

 const getCurrentUser=asyncHandler(async(req,res)=>{
 const user=await User.findById(req.user?._id).select("-password -refreshToken")
  if(!user){
      throw new apiError(401, "User not found")
  }
  return res.status(200)
  .json(new apiResponse(200, user, "User found successfully"))
 
})

const updateProfile=asyncHandler(async(req,res)=>{
const {firstname, lastname, username, headline, gender, location}=req.body;
let skills=req.body.skills?JSON.parse(req.body.skills):[];
let education=req.body.education?JSON.parse(req.body.education):[];
let experience=req.body.experience?JSON.parse(req.body.experience):[];

const user=await User.findById(req.user?._id).select("-password -refreshToken")
console.log(user);
let profileImage = user.profileImage;
let coverImage = user.coverImage;


if(req.files?.profileImage?.[0]?.path){
    const profileResult = await uploadOnCloudinary(req.files?.profileImage?.[0]?.path);
    console.log(profileResult)
    profileImage = profileResult.secure_url; // <-- only the string
}

if(req.files?.coverImage?.[0]?.path){
    const coverResult = await uploadOnCloudinary(req.files?.coverImage?.[0]?.path);
    coverImage = coverResult.secure_url; // <-- only the string
}



const newuser=await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        firstname,
        lastname,
        username,
        headline,
        location,
        gender,
        skills,
        education,
        experience,
        profileImage,
        coverImage,
      }
    },{
        new:true
    }
).select("-password -refreshToken")

if(!newuser){
    throw new apiError(501, "Update Unsucessful")
}

return res.status(200)
.json(new apiResponse(200, newuser,"Profile updated successfully"))
})

const getProfile=asyncHandler(async(req,res)=>{
    try {
        const {username}=req.params;
        const user=await User.findOne({username}).select("-password -refreshToken")
        if(!user){
            throw new apiError(401, "User not found")
        }

        return res.status(200)
        .json(new apiResponse(200,user,"User found successfully"))
    } catch (error) {
        throw new apiError(400,"getProfile Error")
        console.log("getProfile of a user",error);
    }
})

const search=asyncHandler(async(req, res)=>{
    try {
        const {query}=req.query
        if(!query){
            throw new apiError(401, "add some query")
        }
        let users=await User.find({
            $or:[
                {firstname:{
                    $regex:query,
                    $options:"i"
                }},
                {lastname:{
                    $regex:query,
                    $options:"i"
                }},
                {username:{
                    $regex:query,
                    $options:"i"
                }},
                {skills:{
                    $in:[query]
                }}
            ]
        })

        return res.status(200)
        .json(new apiResponse(200, users, "Query result successful"))
    } catch (error) {
        console.log("search error")
         throw new apiError(401, "query unsucessful")
    }
})

const getSuggestedUser=asyncHandler(async(req,res)=>{
   try {
    const currentUser=await User.findById(req.user._id).select("connection")
    const suggestedUser=await User.find({
        _id: { 
        $ne: req.user._id, 
        $nin: currentUser.connection  
      }
    }).select("-password -refreshToken")
    return res.status(200)
        .json(new apiResponse(200, suggestedUser, "Suggested User"))
   } catch (error) {
       console.log(error)
       throw new apiError(401, `Suggested user not found:${error}`)
   }
})

export{ 
    getCurrentUser,
    updateProfile,
    getProfile  ,
    search,
    getSuggestedUser
}



