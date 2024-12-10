import { supabase } from "../DbConfig/DbConn.ts";

import getUserAuthenticationDetails from "../middleware/CheckingUserType.ts";
import { USERMODULE } from "../utils/constant.ts";
import { STATUSCODE } from "../utils/constant.ts";
import { ErrorResponse, SuccessResponse } from "../utils/Response.ts";

export default async function logoutUser(req: Request) {
    const roles:string[]=['U','A','M','V']
        
    const {response,params}=await getUserAuthenticationDetails(req,roles);
    if(response)   {
        return response;
    }
    if(!params){
        ErrorResponse(USERMODULE.INTERNAL_SERVER_ERROR,STATUSCODE.INTERNAL_SERVER_ERROR)
    }
    
    const token = params?.token;
    console.log(token);
    const { error } = await supabase.auth.admin.signOut(token as string);
    if (error) {
        console.log("not able to log out");
        return ErrorResponse(`${error}`, STATUSCODE.INTERNAL_SERVER_ERROR);
    } else {
        return SuccessResponse(USERMODULE.USER_LOGOUT_SUCCESS);
    }
}
