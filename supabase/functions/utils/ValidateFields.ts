
import { ErrorResponse } from "./Response.ts";


export function isPhoneNumberAvailable(phoneNo:string) 
{
    if(!phoneNo)    
    {
        return ErrorResponse("missing Phone Number",400)
    }
}
export function isOtpAvailable(otp:string) 
{
    if(!otp)    
    {
        return ErrorResponse("missing Phone Number",400)
    }
}
export function isIdAvailable(user_id:string) 
{
    if(!user_id)
    {
       return  ErrorResponse("missing user_Id",400)
    }
    
}
