

import { DeactivateAccount } from "../Service/DeactivateAccount.ts";
import FetchUserProfile from "../Service/FetchUser.ts";
import logoutUser from "../Service/LogOut.ts";
import updateUserProfile from "../Service/ProfileUpdate.ts";
import signInWithOtp from "../Service/SendOtp.ts";
import verifyOtp from "../Service/VerifyOtp.ts";
import { HTTPMETHOD } from "../utils/constant.ts";

import { userModuleRoute } from "./RoutePathAndHandler.ts";


//mapping all the routes in one place
export const UserModuleRoutes={
   
    [HTTPMETHOD.POST]:{
        [userModuleRoute.SendOtpPath]:signInWithOtp,
        [userModuleRoute.VerifyOtp]:verifyOtp,
        [userModuleRoute.UserLogOut]:logoutUser
        
        
    },
    [HTTPMETHOD.PATCH]:
    {
        [userModuleRoute.UpdateUser]:updateUserProfile,
        [userModuleRoute.DeactivateUser]:DeactivateAccount,
    },
    [HTTPMETHOD.GET]:
    {
    [userModuleRoute.FetchUser]:FetchUserProfile,
    },
        
   
 
}



  
 



 