import mongoose,{Schema} from "mongoose";

const postSchema=new Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true

    },
    description:{
        type: String,
        default: ""
    },
    image:{
        type: String,
        default:""
    },
    like:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
        }
    ],
    comment:[
        {
            content: {
                type: String
            },
            user:{
                    type: mongoose.Schema.Types.ObjectId,
                     ref: "User",   
            }
             
        }
    ]
},{
    timestamps:true
})

const Post=mongoose.model("Post", postSchema)

export default Post;