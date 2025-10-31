import mongoose,{Schema} from "mongoose";

const notificationSchema=new Schema({
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type:{
        type:String,
        enum:["like","comment","connectionAccepted"]
    },
    relatedUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
     relatedPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
},{timestamps:true})

const Notification=mongoose.model("Notification", notificationSchema)
export default Notification