import { asyncHandler } from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiresponse.js"
import { apiError } from "../utils/apierror.js"
import User from "../models/user.models.js"
import Connection from "../models/connection.models.js"
import { connect } from "mongoose"
import {io,userSocketMap} from "../app.js"


const sendConnection=asyncHandler(async(req,res)=>{
   const {id} =req.params //id of the receiver
   const sender=req.user?._id

   const user=await User.findById(sender);
   if(!user){
    throw new apiError(401, "User not found")
   }

   if(id.toString()===sender.toString()){
    throw new apiError(400, "Can't send request to self")
   }

   if(user.connection.includes(id)){
    throw new apiError(400, "You are already connected")
   }

   const existingConnection=await Connection.findOne({
    sender,
    receiver: id,
    status: "pending"
   })
   if(existingConnection){
    throw new apiError(401, "connection request already exist")
   }

   let newRequest=await Connection.create({
    sender,
    receiver: id
   })

   const receiverSocketId=userSocketMap.get(id);
   const senderSocketId=userSocketMap.get(sender)

   if(receiverSocketId){
      io.to(receiverSocketId).emit("statusUpdate",{updatedUserId: sender, newStatus:"received"})
   }

   if(senderSocketId){
      io.to(senderSocketId).emit("statusUpdate",{updatedUserId: id, newStatus:"pending"})
   }

   return res.status(200)
   .json(new apiResponse(200, newRequest, "Connection request sent sucessfully"))

})

const acceptConnection=asyncHandler(async(req,res)=>{
   const {connectionId}=req.params
   const connection=await Connection.findById(connectionId)

   if(!connection){
    throw new apiError(400, "connection doesn't exist")
   }

   if(connection.status!="pending"){
    throw new apiError(500, "Connection is not pending") 
   }

   connection.status="accepted"
   await connection.save()

   await User.findByIdAndUpdate(req.user?._id,{
    $addToSet:{
        connection:connection.sender?._id
    }
   })
   
   await User.findByIdAndUpdate(connection.sender._id,{
    $addToSet:{
        connection:req.user?._id
    }
   })

   const receiverSocketId=userSocketMap.get(connection.receiver._id.toString())
   const senderSocketId=userSocketMap.get(connection.sender._id.toString())

   if(receiverSocketId){
      io.to(receiverSocketId).emit("statusUpdate",{updatedUserId: connection.sender._id, newStatus:"disconnect"})
   }

   if(senderSocketId){
      io.to(senderSocketId).emit("statusUpdate",{updatedUserId:req.user._id, newStatus:"disconnect"})
   }

   return res.status(200)
   .json(new apiResponse(200, connection, "Connection accepted"))
   

})

const rejectConnection=asyncHandler(async(req,res)=>{
   const {connectionId}=req.params
   const connection=await Connection.findById(connectionId)

   if(!connection){
    throw new apiError(400, "connection doesn't exist")
   }

   if(connection.status!="pending"){
    throw new apiError(500, "Connection is in process") 
   }

   connection.status="rejected"
   return res.status(200)
   .json(new apiResponse(200, connection, "Connection rejected"))  

})

const getConnectionStatus=asyncHandler(async(req,res)=>{
    const targetUserId=req.params.id
    const currentUserId=req.user?._id
    
    try {
        const currentUser=await User.findById(currentUserId)
    if(currentUser.connection.includes(targetUserId)){
        return res.status(200).json(new apiResponse(200,{status:"disconnect"},"Connetion status: connected"))
    }

   const pendingRequest=await Connection.findOne({
    $or:[
        {sender: currentUserId, receiver: targetUserId},
        {sender: targetUserId, receiver: currentUserId}
    ],
    status:"pending"
   })
   
   if(pendingRequest){
    if(pendingRequest.sender.toString()===currentUserId.toString()){
         return res.status(200).json(new apiResponse(200,{status:"pending"},"Pending status"))
    }
    else{
        return res.status(200).json(new apiResponse(200,{status:"received", requiestId:pendingRequest._id},"Recerived status"))
    }
   }
   else{
    return res.status(200).json(new apiResponse(200,{status:"connect"},"Connect"))
   }
    } catch (error) {
        throw new apiError(401, "getConnectionStatus error")
    }
})

const removeConnection=asyncHandler(async(req,res)=>{
    try {
        const myId=req.user._id
        const otherUserId=req.params.id

        await User.findByIdAndUpdate(myId,
            {
                $pull:{
                    connection:otherUserId
                }
            }
        )

        await User.findByIdAndUpdate(otherUserId,
            {
                $pull:{
                    connection:myId
                }
            }
        )

   const receiverSocketId=userSocketMap.get(otherUserId)
   const senderSocketId=userSocketMap.get(myId)

   if(receiverSocketId){
      io.to(receiverSocketId).emit("statusUpdate",{updatedUserId: myId, newStatus:"connect"})
   }

   if(senderSocketId){
      io.to(senderSocketId).emit("statusUpdate",{updatedUserId:otherUserId, newStatus:"connect"})
   }

        return res.status(200).json(new apiResponse(200, {},"Connection removed Successfully"))
    } catch (error) {
        throw new apiError(500, "remove Connection Error")
    }
})

const getConnectionRequests=asyncHandler(async(req,res)=>{
    try {
        const userId=req.user._id
        const requests=await Connection.find({receiver:userId, status:"pending"}).populate(
            "sender","firstname lastname email username profileImage headline"
        )

        return res.status(200)
        .json(new apiResponse(200, requests, "All Requests"))
    } catch (error) {
        throw new apiError(500, "Server Error")
    }
})

const getUserConnections=asyncHandler(async(req,res)=>{
    try {
        const userId=req.user._id
        const user=await User.findById(userId).populate(
            "connection",
            "firstname lastname username profileImage headline connection"
        )
        return res.status(200)
        .json(new apiResponse(200, user, "all Connections"))
    } catch (error) {
        throw new apiError(500, "Failed to fetch all Connections")
    }
})

export {
    sendConnection,
    acceptConnection,
    rejectConnection,
    getConnectionStatus,
    removeConnection,
    getConnectionRequests,
    getUserConnections
}