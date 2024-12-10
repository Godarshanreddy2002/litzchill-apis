import { supabase } from "../DbConfig/DbConn.ts";
import { STATUSCODE, USERMODULE } from "../utils/constant.ts";
import { ErrorResponse } from "../utils/Response.ts";

export default async function getUserAuthenticationDetails(
    req: Request, roles: string[]
): Promise<{ response?: Response | null, params?: Record<string, string> | null }> {
    const user = req.headers.get("Authorization");
    console.log("Authorization header: ", user);
    
    if (!user) {
        console.log("Authorization header is missing. User is not authenticated.");
        return { response: ErrorResponse(USERMODULE.UNAUTHERIZED_USER, STATUSCODE.FORBIDDEN) };
    }

    const jwt = user.replace("Bearer ", "");
    console.log("JWT extracted: ", jwt);

    const { data: userData, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !userData) {
        console.log("Authentication failed: User session expired or invalid JWT.");
        return { response: ErrorResponse(USERMODULE.UNAUTHERIZED_USER, STATUSCODE.FORBIDDEN) };
    }

    const id = userData.user.id;
    console.log("Authenticated user ID: ", id);

    const { data, error } = await supabase
        .from("users")
        .select('account_status, lockout_time, user_type')
        .eq("user_id", id)
        .in("account_status", ['A', 'S'])
        .single();

    if (error) {
        console.log("Database error: ", error);
        return { response: ErrorResponse(`${error}`, STATUSCODE.INTERNAL_SERVER_ERROR) };
    }

    if (!data) {
        console.log("User not found in the database.");
        return { response: ErrorResponse(USERMODULE.USER_NOT_FOUND, STATUSCODE.NOT_FOUND) };
    }

    console.log("User data retrieved: ", data);

    if (data.account_status == 'S') {
        console.log(`Account deactivated. Lockout time: ${data.lockout_time}`);
        return { response: ErrorResponse(USERMODULE.ACCOUNT_DEACTIVATED+" already" , STATUSCODE.FORBIDDEN) };
    }

    if (!roles.includes(data.user_type)) {
        console.log(`User type '${data.user_type}' is not allowed. Role restriction in place.`);
        return { response: ErrorResponse(USERMODULE.RESTRICTED_USER, STATUSCODE.FORBIDDEN) };
    }

    const params = {
        user_id: id,
        account_status: data.account_status,
        user_type: data.user_type,
        token: jwt
    };
    console.log(params)

    console.log("Valid user. Returning user authentication details.");
    return { params: params };
}
