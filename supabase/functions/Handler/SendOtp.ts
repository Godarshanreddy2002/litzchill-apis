
import { supabase } from "../DbConfig/DbConn.ts";
import { getUser } from "../Repository/UserRepo.ts";
import { verify_user } from "../Repository/UserRepo.ts";
import { STATUSCODE, USERMODULE } from "../utils/constant.ts";
import { ErrorResponse, SuccessResponse } from "../utils/Response.ts";
import { isPhoneNumberAvailable } from "../utils/ValidateFields.ts";
// 
export default async function signInWithOtp(req: Request) {
  
  const method = req.method;
  
 
    console.log("Start of signin");

    const { phoneNo } = await req.json();
    // This method checks the phone number is available or not
   isPhoneNumberAvailable(phoneNo);
    
    const verifyUser = await verify_user(phoneNo);//getting user with phone number
   

    if (verifyUser == null) {      
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNo,
      });

      if (error) {
        return ErrorResponse(`${error}`,STATUSCODE.INTERNAL_SERVER_ERROR)
      }
      return SuccessResponse(USERMODULE.SENT_OTP_SUCCESS);
      
    } 
    const user=await getUser(phoneNo)   

    if (user) {      
      const {  error } = await supabase.auth.signInWithOtp({
        phone: phoneNo,
      });
      if (error) {
        return ErrorResponse(`${error}`,STATUSCODE.INTERNAL_SERVER_ERROR);
      }
      else{
        return SuccessResponse(USERMODULE.SENT_OTP_SUCCESS)
      }
    }
  
}

