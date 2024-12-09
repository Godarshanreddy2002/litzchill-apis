import { supabase } from "../DbConfig/DbConn.ts";

import { STATUSCODE, USERMODULE } from "../utils/constant.ts";
import { ErrorResponse } from "../utils/Response.ts";
 
export default async function 
getUserAuthenticationDetails(req:Request,roles:string[])
{
    const user = req.headers.get("Authorization");
        console.log(user);
        if (!user) {
            console.log("First check")
            return new Response("Unauthorized", { status: 401 });
        }
 
        const jwt = user.replace("Bearer ", "");
        const { data: userData, error: authError } = await supabase.auth
            .getUser(jwt);
        if (authError || !userData) {
            console.log("user session expired")
            return new Response("Unauthorized", { status: 401 });
        }
 
        const id=userData.user.id;
        const { data, error } = await supabase
            .from("users")
            .select('account_status,lockout_time,user_type')
            .eq("user_id", id)
            .in("account_status",['A','S'])
            .single();
 
            if(error)
            {
                return ErrorResponse(`${error}`,STATUSCODE.INTERNAL_SERVER_ERROR)
            }
            if(!data)
            {
                return ErrorResponse(USERMODULE.USER_NOT_FOUND,STATUSCODE.NOT_FOUND)
            }
            if(data.account_status=='S')
            {
                return ErrorResponse(USERMODULE.ACCOUNT_DEACTIVATED+`Try after ${data.lockout_time}`,STATUSCODE.FORBIDDEN)
            }
            if(!roles.includes(data.user_type))
            {
                return ErrorResponse(USERMODULE.RESTRICTED_USER,STATUSCODE.FORBIDDEN)
            }
 
            const params={
                user_id:id,
                account_status:data.account_status,
                user_type:data.user_type,
            }
            console.log("Valid user ");
            return params
           
}