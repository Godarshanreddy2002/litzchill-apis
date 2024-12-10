
import {otpVerication} from "../Repository/AuthRepo.ts";
// import { UserProfile } from "../model/UserTable.ts";
import {getUser, makeUserLockout, RegisterUser} from "../Repository/UserRepo.ts";
import { STATUSCODE, USERMODULE } from "../utils/constant.ts";
import { ErrorResponse, returnAccessToken } from "../utils/Response.ts";
import {isOtpAvailable, isPhoneNumberAvailable} from "../utils/ValidateFields.ts";

export default async function verifyOtp(req: Request) {

        console.error("Verify OTP API started");
        const body = await req.json();
        const phoneNo:string=body.phoneNo;
        const Otp:string=body.Otp;

        const validPhone=isPhoneNumberAvailable(phoneNo);
        
        if(validPhone instanceof Response)
        {
            return validPhone;
        }
        const validOtp=isOtpAvailable(Otp);
        console.log("Phone is valid")
        if(validOtp instanceof Response)
            {
                
                return validOtp;
            }

        console.log("Otp valid")
        const user = await getUser(phoneNo)
        if(user){
            console.log("User verify succesfully ",(user));
        }
       
        //first check if user exists with mobile
        //invoke verify-otp 
        //any error, check user exists, if exists increment login count,
        // no error, if user exits, make it to default value login count .0 send session
        //no user create userr, in response send session
        const {data,error}=await otpVerication(phoneNo,Otp)
 
        if(error || !data){
            console.log("User failed count  : ",user.failed_login_count);
            if(user){
                
                if(user.failed_login_count<3)
                {
                    
                  user.account_status='A';

                console.log("User Account Status : ",user.account_status);
                console.log("User failed count after increment : ",user.failed_login_count);
                console.log("User lockout time : ",user.lockout_time);
                const data = makeUserLockout(user.user_id,null,user.failed_login_count+1,user.account_status);
                if(!data||error){
                    console.log("Data is not coming",data);
                }
                console.log("After updating lockout count: ",JSON.stringify(data));
                }
                //TODO increment failed login countr and set lockout time and return error response
            
                if(user.failed_login_count>=2)
                    {
                        const currentLocoutTime = new Date();
                        currentLocoutTime.setHours(currentLocoutTime.getHours() + 1);
                        user.account_status = "S";
                        const data = makeUserLockout(user.user_id,currentLocoutTime.toISOString(),0,user.account_status,);
                        return ErrorResponse(`${USERMODULE.LOCK_USER} try after ${currentLocoutTime}`,STATUSCODE.CONFLICT)
                    }
                    return ErrorResponse(USERMODULE.INVALID_OTP, STATUSCODE.CONFLICT);
            }    
            
        }
 
        if(user){
            //TODO reset failed login count and lockout time return success response with session
            const setUser = makeUserLockout(user.user_Id,null,0,user.account_status,);
            const userId = data.user?.id;
                const access_token = data.session?.access_token;
                if(userId&&access_token)
                {
                    return returnAccessToken(USERMODULE.USER_VERIFIED,userId,access_token);  
                }
                
            return ErrorResponse(USERMODULE.INTERNAL_SERVER_ERROR,STATUSCODE.INTERNAL_SERVER_ERROR)      

        }

        if(!user){
            //TODO crete user 
            const userId = data.user?.id;
            const access_token = data.session?.access_token;
            if(userId&&access_token)
            {
                const {data:register,error:registerError}=await RegisterUser(phoneNo,userId)
                if(registerError)
                {
                    return ErrorResponse(USERMODULE.INTERNAL_SERVER_ERROR,STATUSCODE.INTERNAL_SERVER_ERROR)
                }
                return returnAccessToken(USERMODULE.SENT_OTP_SUCCESS,userId,access_token)
            }
            return ErrorResponse(USERMODULE.INTERNAL_SERVER_ERROR,STATUSCODE.INTERNAL_SERVER_ERROR)
            
        }   
}
