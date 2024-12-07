import { DeactivateAccount } from "../Handler/DeactivateAccount.ts";
import FetchUserProfile from "../Handler/FetchUser.ts";
import logoutUser from "../Handler/LogOut.ts";

import updateUserProfile from "../Handler/ProfileUpdate.ts";
import signInWithOtp from "../Handler/SendOtp.ts";
import verifyOtp from "../Handler/VerifyOtp.ts";
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



  
 



 