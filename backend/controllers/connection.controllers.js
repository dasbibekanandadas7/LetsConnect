import { asyncHandler } from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiresponse.js"
import { apiError } from "../utils/apierror.js"
import User from "../models/user.models.js"

const sendConnection=asyncHandler(async(req,res)=>{
   const{id}=req.params.id
   const sender=req.user?._id

   const user=await User.findById(sender);
   if(!user){
    throw new apiError(401, "User not found")
   }

   if(id.toString()===sender.toString()){
    throw new apiError(400, "Can't send request to self")
   }
})

export {
    sendConnection
}