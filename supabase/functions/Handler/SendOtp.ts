
import { supabase } from "../DbConfig/DbConn.ts";
import { handleAllErrors } from "../ErrorHandler/HandlingError.ts";
import { getUser } from "../Repository/LoginVerifyRepo.ts";

export default async function signInWithOtp(req: Request) {
  const method = req.method;
  console.log(method);
  if (method === "POST") {
    console.log("Start of signin");

    const { phoneNo } = await req.json();

    if (!phoneNo) {
      console.log("phone number is required");
      return handleAllErrors({
        status_code: 400,
        error_message: "Missing phone number",
        error_time: new Date(),
      });
    }
    console.log(
      "I am trying to fetch data from public.users data through phone number",
    );
    const user = await getUser(phoneNo);
    console.log("checked user exited or not");
    console.log(user)

    if (user == null) {
      console.log("If user is null then user is new user");
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phoneNo,
      });

      if (error) {
        console.log("Internal server error in sending otp");
        return handleAllErrors({
          status_code: 400,
          error_message: `${error.message}`,
          error_time: new Date(),
        });
      }

      return new Response(
        JSON.stringify({
          message: "OTP sent successfully to your mobile number",
          data: data,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } else if (user && user.lockout_time < new Date().toISOString()||user.lockout_time==null) {
      console.log("user already exist");
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phoneNo,
      });
      if (user.failed_login_count == 3) {
        const { data, error } = await supabase
          .from("public.user")
          .update({ "failed_login_count": 0 })
          .eq("mobile", phoneNo).single();
        if (error) {
          console.log(
            "After completing lockout time faild to update faild_login_count as 0",
          );
        } else {
          console.log(
            "After lockout time successfully updated faild_login_count as 0",
          );
        }
      }

      if (error) {
        console.log(" Error in sending otp");
        return handleAllErrors({
          status_code: 400,
          error_message: `${error.message}`,
          error_time: new Date(),
        });
      }
      console.log("Otp is sent successfully to your mobile number");
      return new Response(
        JSON.stringify({
          message: "OTP sent successfully to your mobile number",
          data: data,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }
  else{
    return handleAllErrors({status_code:405,error_message:"method not allowed here",error_time:new Date()})
  }
  return new Response(JSON.stringify({error:"Internal server error"}),
  {
    status:500,headers:{ "Content-Type": "application/json" }
  }
)
}

