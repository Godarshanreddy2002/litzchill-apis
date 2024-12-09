import { supabase } from "../DbConfig/DbConn.ts";
import getUserAuthenticationDetails from "../middleware/CheckingUserType.ts";
import { USERMODULE } from "../utils/constant.ts";
import { STATUSCODE } from "../utils/constant.ts";
import { ErrorResponse, SuccessResponse } from "../utils/Response.ts";

export default async function logoutUser(req: Request) {
    const roles:string[]=['U']
        
    const userParams=await getUserAuthenticationDetails(req,roles);        
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.log("not able to log out");
        return ErrorResponse(`${error}`, STATUSCODE.INTERNAL_SERVER_ERROR);
    } else {
        return SuccessResponse(USERMODULE.USER_LOGOUT_SUCCESS);
    }
}
