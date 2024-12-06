
import { supabase } from "../DbConfig/DbConn.ts";
import { getUser } from "../Repository/UserRepo.ts";
import { verify_user } from "../Repository/UserRepo.ts";
import { ErrorResponse, SuccessResponse } from "../utils/Response.ts";
import { isPhoneNumberAvailable } from "../utils/ValidateFields.ts";
// 
export default async function signInWithOtp(req: Request) {
  
  const method = req.method;
  
  if (method === "POST") {
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
        return ErrorResponse(`${error}`,500)
      }
      return SuccessResponse("Otp Successfully sent");
      
    } 
    const user=await getUser(phoneNo)    
    if (user && user.failed_login_count<3) {      
      const {  error } = await supabase.auth.signInWithOtp({
        phone: phoneNo,
      });
      if (error) {
        return ErrorResponse(`${error}`,500);
      }
      else{
        return SuccessResponse(`OTP successfully sent to ${phoneNo}`)
      }
    }
  }
  else{
   return ErrorResponse("Method not supported",405)
  }
  return ErrorResponse("something went wrong",500) 
}

