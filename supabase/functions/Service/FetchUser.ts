
import getUserAuthenticationDetails from "../middleware/CheckingUserType.ts";
import { getUserProfile } from "../Repository/UserRepo.ts";
import { ErrorResponse, SuccessResponse } from "../utils/Response.ts";
import { STATUSCODE, USERMODULE } from "../utils/constant.ts";
import { isIdAvailable } from "../utils/ValidateFields.ts";

export default async function FetchUserProfile(req: Request,user_Id:string) {
  
    try {
      console.log("Fetching user");
      
      const roles:string[]=['A','U','M','V']
        
      const userParams=await getUserAuthenticationDetails(req,roles);        

      isIdAvailable(user_Id)
      

     const {userData,userError}=await getUserProfile(user_Id)
     if(userError){
      return ErrorResponse(`${USERMODULE.INTERNAL_SERVER_ERROR}, ${userError.message}`, STATUSCODE.INTERNAL_SERVER_ERROR);
     }
     if(!userData||userData.length==0){
      return ErrorResponse(USERMODULE.USER_NOT_FOUND,STATUSCODE.NOT_FOUND)
     }
      console.log("UserData is: ",userData)
     return SuccessResponse(USERMODULE.USER_DETAILS,userData)



    } catch (error) {
      
     return ErrorResponse(USERMODULE.INTERNAL_SERVER_ERROR,STATUSCODE.INTERNAL_SERVER_ERROR)
    }
 
 
}
