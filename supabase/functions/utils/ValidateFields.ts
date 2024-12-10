

import {  STATUSCODE, USERMODULE } from "./constant.ts";
import { ErrorResponse } from "./Response.ts";


export function isPhoneNumberAvailable(phoneNo:string) 
{
    if(!phoneNo)    
    {
        return ErrorResponse(USERMODULE.PHONENUMBER,STATUSCODE.BAD_REQUEST)
    }
}
export function isOtpAvailable(otp:string) 
{
    if(!otp)    
    {
        
        return ErrorResponse(USERMODULE.OTP,STATUSCODE.BAD_REQUEST)
    }
}
export function isIdAvailable(user_id:string) 
{
    if(!user_id)
    {
       return  ErrorResponse(USERMODULE.USER_ID,STATUSCODE.BAD_REQUEST)
    }
    
}
