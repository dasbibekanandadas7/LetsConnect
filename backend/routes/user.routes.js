import express from "express"
import {getCurrentUser} from "../controllers/user.controllers.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
import {upload} from '../middleware/multer.middleware.js';
import {updateProfile} from "../controllers/user.controllers.js"

const userRouter=express.Router()

userRouter.route("/currentuser").get(verifyJWT, getCurrentUser)
userRouter.route("/updateprofile").patch(verifyJWT,
    upload.fields([
        {
            name:"profileImage",
            maxCount:1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),updateProfile)

export default userRouter;