import { supabase } from "../DbConfig/DbConn.ts";
// import { UserProfile } from "../model/UserTable.ts";
import {getUser, makeUserLockout, verify_user} from "../Repository/UserRepo.ts";
import { STATUSCODE, USERMODULE } from "../utils/constant.ts";
import { ErrorResponse, returnAccessToken } from "../utils/Response.ts";
import {isOtpAvailable, isPhoneNumberAvailable} from "../utils/ValidateFields.ts";

export default async function verifyOtp(req: Request) {

        console.log("Verify OTP API started");
        const { Otp, phoneNo } = await req.json();

        const validPhone=isPhoneNumberAvailable(phoneNo);
        
        if(validPhone instanceof Response)
        {
            return validPhone;
        }
        const validOtp=isOtpAvailable(Otp);
        if(validOtp instanceof Response)
            {
                return validPhone;
            }
        const verifyUser = await verify_user(phoneNo);
        if (verifyUser == null) {
            const { data, error } = await supabase.auth.verifyOtp({
                phone: phoneNo,
                token: Otp,
                type: "sms",
            });
            if (error) {
                return ErrorResponse(`${error}`, STATUSCODE.INTERNAL_SERVER_ERROR);
            } else {
                const userId = data.user?.id || "";
                const access_token = data.session?.access_token || "";
                return returnAccessToken(USERMODULE.USER_VERIFIED,userId,access_token);
            }
        }
        const user = await getUser(phoneNo);

        const { data, error } = await supabase.auth.verifyOtp({
            phone: phoneNo,
            token: Otp,
            type: "sms",
        });

        if (error) {
            if (user.faild_login_count == 2) {
                const currentLocoutTime = new Date();
                currentLocoutTime.setHours(currentLocoutTime.getHours() + 1);
                user.account_status = "S";
                const data = makeUserLockout(user.user_Id,currentLocoutTime.toISOString(),0,user.account_status,);
                    
                
            } else {
                const fC: number = user.faild_login_count;

                const data = makeUserLockout(user.user_Id, user.lockout_time,fC + 1,user.account_status);
            }

            return ErrorResponse(USERMODULE.INVALID_OTP, STATUSCODE.CONFLICT);
        } else {
            const userId = data.user?.id || "";
            const access_token = data.session?.access_token || "";
            return returnAccessToken(USERMODULE.VERIFY_OTP_SUCCESS, userId, access_token);
        }
    
}
