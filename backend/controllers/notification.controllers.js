import Notification from "../models/notification.models.js"
import { apiError } from "../utils/apierror.js"
import { apiResponse } from "../utils/apiresponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getNotification=asyncHandler(async(req,res)=>{
    try {
        const notification=await Notification.find({receiver:req.user?._id})
        .populate("relatedUser","firstname lastname profileImage")
        .populate("relatedPost","image description")

        return res.status(200)
        .json(new apiResponse(200,notification,"fetched all notifications"))
    } catch (error) {
        console.log(`fetch notification Error:${error}`);
        throw new apiError(401, "Notication fetch unsuccessful")
    }
})

const delteNotification=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params

        const notification=await Notification.findOneAndDelete({
            _id:id,
            receiver:req.user?._id
        })

        return res.status(200)
        .json(new apiResponse(200,{},"deleted notification"))
    } catch (error) {
        console.log(`delete notification Error:${error}`);
        throw new apiError(401, "Notication delete unsuccessful")
    }
})

const clearAllNotification=asyncHandler(async(req,res)=>{
    try {
        await Notification.deleteMany({
            receiver:req.user?._id
        })
        return res.status(200)
        .json(new apiResponse(200,{},"deleted all notification"))
    } catch (error) {
        console.log(`delete all notification Error:${error}`);
        throw new apiError(401, "All Notication delete unsuccessful")
    }
})


export {
  getNotification,
  delteNotification,
  clearAllNotification
}