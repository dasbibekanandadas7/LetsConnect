import mongoose from "mongoose";
import { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema=new Schema({
    firstname:{
       type: String,
       required: true
    },
    lastname:{
       type: String,
       required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    username:{
       type: String,
       required: true,
       unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"]
    },
    profileImage:{
        type: String,
        default:""
    },
    coverImage:{
        type: String,
        default:""
    },
    headline:{ //about field (focused on company name or tech stack)
        type: String,
        default: ""
    },
    skills:[
        {
            type: String
        }
    ],
    education:[
        {
            college:{
                type: String
            },
            degree:{
                type: String
            },
            fieldOfStudy:{
                type: String
            }
        }
    ],
    gender:{
        type: String,
        enum:["male","female","other"]
    },
    location:{
        type: String,
        default:"India"
    },
    experience:[
        {
            title:{
                type: String
            },
            company:{
                type: String
            },
            description:{
                type: String
            }
        }
    ],
    connection:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    refreshToken:{
        type: String
    }
    
},{timestamps:true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
   this.password=await bcrypt.hash(this.password,10);
   next();
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=function(){
   return jwt.sign(
    {
        _id:this._id,
        email:this.email,
        firstname:this.firstname,
        lastname:this.lastname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
   )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
    {
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
   )
}



const User=mongoose.model("User", userSchema);
export default User;