
// constant user types in user table
export const user_type = {
    ADMIN: "A",
    VIEWER: "V",
    MEMER: "M",
    USER: "U",
};

// constant for user table name
export const TABLE = {
    USERTABLE: "users",
};

export const USERMODULE={
    PHONENUMBER:"Phone number is required",
    OTP:"OTP is required",
    USER_ID:"User Id required",
    SENT_OTP_SUCCESS:"OTP sent successfully",
    ACCOUNT_DEACTIVATED:"your account is sspendeded/Deactivated",
    METHOD_NOT_SUPPORTED:"Method not supported",
    INTERNAL_SERVER_ERROR:"something went wrong",
    USER_VERIFIED:"OTP is verified successfully",
    ROUT_NOT_FOUND:"Route not found"


}
export const HTTPMETHOD={
    GET:"GET",
    POST:"POST",
    PUT:"PUT",
    DELETE:"DELETE",
    PATCH:"PATCH"
}
 
export const STATUSCODE = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    METHODS_NOT_ALLOWED:405
}