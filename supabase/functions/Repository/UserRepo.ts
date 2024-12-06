import { supabase } from "../DbConfig/DbConn.ts";

import { UserProfile } from "../model/UserTable.ts";
import { ErrorResponse, SuccessResponse } from "../utils/Response.ts";

/**
 * this method is used to get user profile  based on the user_Id
 *
 * @param id
 * @returns
 */
export async function getUserProfile(id: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", id)
    .single(); // Ensure that only one user is returned

  if (error) {
    return ErrorResponse(`${error}`, 500);
  } else {
    return data;
  }
}

/**
 * This method is used to fetch user mobile number for checking wether the user is new user or not
 *
 * @param phno
 * @returns
 */

export async function verify_user(phno: string) {
  const { data, error } = await supabase
    .from("users")
    .select("mobile")
    .eq("mobile", phno)
    .single();
  if (error) {
    return ErrorResponse(`${error}`, 500);
  } else {
    return data;
  }
}

/**
 * This method is used to get user through phone number
 *
 * @param phoneNo
 * @returns
 */

export async function getUser(phoneNo: string) {
  const { data, error } = await supabase
    .from("users") // Specify the 'users' table and its type
    .select("*")
    .eq("mobile", phoneNo)
    .eq("account_status", "A")
    .lt('faild_login_count',3)
    .or(`lockout_time.lt.${new Date().toISOString()},lockout_time.is.null`)
    .single();

  if (error) {
    return ErrorResponse(`${error}`, 500);
  } else {
    return data;
  }
}

/**
 * This method is used to update user profile and it will return updated user data
 * @param profile
 * @param user_id
 * @returns
 */

export async function updateProfile(profile: UserProfile, user_id: string) {
  const { data, error } = await supabase
    .from("users")
    .update(profile)
    .eq("user_id", user_id)
    .eq("account_status", "A")
    .or(`lockout_time.lt.${new Date().toISOString()},lockout_time.is.null`)
    .select("*")
    .single();

  if (error) {
    return ErrorResponse(`${error}`, 500);
  } else if (data == null) {
    return ErrorResponse("your account is usspendeded/Deactivated", 500);
  } else {
    return data;
  }
}
/**
 * This method is used to update user account status
 *
 * @param user_Id
 * @param lockout_time
 * @param faild_login_count
 * @returns
 */

export async function makeUserLockout(
  user_Id: string,
  lockout_time: string|null,
  faild_login_count: number,
  account_status: string,
) {
  const { data, error } = await supabase
    .from("users")
    .update({
      "lockout_time": lockout_time,
      "faild_login_count": faild_login_count,
      "account_status": account_status,
    })
    .eq("user_id", user_Id).select("*").single();
  if (error) {
    return ErrorResponse(`${error}`, 500);
  } else {
    return data;
  }
}

export async function RegisterUser(user_id: string, phoneNo: string) {
  const { data, error } = await supabase
    .from("users")
    .insert({
      "user_id": user_id,
      "mobile": phoneNo,
      "account_verified": { email: false, phone: true },
    }).single();
    if(error)
    {
      return ErrorResponse(`${error}`,500)
    }    
}
