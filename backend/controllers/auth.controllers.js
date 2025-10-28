import {asyncHandler} from "../utils/asyncHandler.js"
import {apiResponse} from "../utils/apiresponse.js"
import {apiError} from "../utils/apierror.js"
import User from "../models/user.models.js"

const generateAccessAndRefreshTokens=async(userId)=>{
  try {    
    const user= await User.findById(userId);
    const accessToken= user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();

    user.refreshToken= refreshToken;
    await user.save({validateBeforeSave: false}); 
    
    return {accessToken, refreshToken}; 

  } catch (error) {
    throw new apiError(500, "Something went wrong while generating token")
  }
}

const signUp=asyncHandler(async(req,res)=>{
    console.log(req.body)
   const {firstname, lastname, username, email, password}=req.body
   if(
        [firstname,lastname,username,email,password].some((field)=> field?.trim()==="")
    ){
        throw new apiError(400, "All fields are required");
    }

    const existed_user=await User.findOne({
        $or:[{email},{username}]
    })
    if(existed_user){
        throw new apiError(400,"User already exist!!")
    }

    const user=await User.create({
        firstname,
        lastname,
        username,
        email,
        password
    })

    const createuser=await User.findById(user._id).select(
    "-password -refreshToken"
    )
    if(!createuser){
    throw new apiError(400, "Something went wrong while registering the user");
    }
     
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(createuser?._id);

    const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    res.clearCookie("token");

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200,createuser,"Sign up successful"))
})

const login=asyncHandler(async(req,res)=>{
    const{email, password}=req.body
    if(!email && !password){
         throw new apiError(400, "username or email is required");
    }

    const user= await User.findOne({email});
    if(!user){
        throw new apiError(404, "user doesn't exist");
    }

    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new apiError(401, "Incorrect Password");
    }

    const{accessToken, refreshToken}=await generateAccessAndRefreshTokens(user._id);
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken");

    const options={
         httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 
    }

     return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new apiResponse(200,loggedInUser,"User Logged in successfully"
    )
  )

})


const logout=asyncHandler(async(req, res)=>{
    await User.findByIdAndUpdate(
        req.user?._id,{
            $unset:{
                refreshToken:1
            }
        },{
            new: true
        }
    )

    const options={
         httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }

    return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json( new apiResponse(200,{}, "User Logged out Successfully"))
})



export {
    signUp,
    login,
    logout
}