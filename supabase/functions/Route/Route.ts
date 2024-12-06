import logoutUser from "../Handler/LogOut.ts";
import updateUserProfile from "../Handler/ProfileUpdate.ts";
import signInWithOtp from "../Handler/SendOtp.ts";
import verifyOtp from "../Handler/VerifyOtp.ts";

type RouteHandler = (req: Request) => Promise<Response>;
type Router = Record<string, Record<string, RouteHandler>>;
 
//mapping all the routes in one place
export const AllRouters:Router={
    "/userModule/sendOtp":{
        POST:signInWithOtp
    },
    "/userModule/userUpdate/:id":{
       PATCH:updateUserProfile
    },
    "/userModule/verifyOtp":{
        POST:verifyOtp
    },
   "/userModule/logout":{
        POST:logoutUser
    },
   
 
}

  
 



 