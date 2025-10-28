import {Router} from "express"
import { signUp, login, logout } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

let authRouter=Router();

authRouter.route("/signup").post(signUp)
authRouter.route("/login").post(login)

//secured path
authRouter.route("/logout").post(verifyJWT,logout)

export default authRouter
