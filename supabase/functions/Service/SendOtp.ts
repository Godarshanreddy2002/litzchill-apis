
import { sendOtp } from "../Repository/AuthRepo.ts";
import { getUser, verify_user } from "../Repository/UserRepo.ts";

import { STATUSCODE, USERMODULE } from "../utils/constant.ts";
import { ErrorResponse, SuccessResponse } from "../utils/Response.ts";
import { isPhoneNumberAvailable } from "../utils/ValidateFields.ts";
/**
 * This function can accept the request to generate otp and return to corresponding response
 * @param req 
 * @returns 
 */
export default async function signInWithOtp(req: Request) {
  console.log("Start of signin");

  const { phoneNo } = await req.json();
  // This method checks the phone number is available or not
  const phoneNoIsnotThere = isPhoneNumberAvailable(phoneNo);

  if (phoneNoIsnotThere instanceof Response) {
    return phoneNoIsnotThere;
  }

  const user = await verify_user(phoneNo); //getting user with phone number

  if (user) {
    console.log("user loc out time",user.lockout_time)
   
    const currentTime=new Date().toISOString();
    console.log("current time",currentTime)
    console.log("CUrrent time,",currentTime)
    console.log(!user.lockout_time&&user.lockout_time>currentTime);
    if(user.lockout_time&&user.lockout_time>currentTime)
    {
      return ErrorResponse(`${USERMODULE.ACCOUNT_DEACTIVATED} Try after ${user.lockout_time}`,STATUSCODE.FORBIDDEN)
    }
    const { data, error } = await sendOtp(phoneNo);

    if (error) {
      return ErrorResponse(`${error}`, STATUSCODE.INTERNAL_SERVER_ERROR);
    }
    return SuccessResponse(USERMODULE.SENT_OTP_SUCCESS);
  }

  if (!user) {
    const { data, error } = await sendOtp(phoneNo);
    if (error) {
      return ErrorResponse(`${error}`, STATUSCODE.INTERNAL_SERVER_ERROR);
    } else {
      return SuccessResponse(USERMODULE.SENT_OTP_SUCCESS);
    }
  }
}
