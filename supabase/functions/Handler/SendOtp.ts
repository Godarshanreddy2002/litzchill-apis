import {createClient} from "npm:@supabase/supabase-js"
const url='https://rpsfsggtydflqjkduzgt.supabase.co'
const key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwc2ZzZ2d0eWRmbHFqa2R1emd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNzE2ODYsImV4cCI6MjA0Nzc0NzY4Nn0.wdRGjSJBef_UexqTmpok3-cRxHO6I86jbDMYmvbzZC0'

const supabase=createClient(url,key);
import { getUser } from "../Repository/LoginVerifyRepo.ts";

export default async function signInWithOtp(req: Request) {
  if (req.method === "POST") {
    console.log("Start of signin");

    const { phoneNo } = await req.json();

    if (!phoneNo) {
      console.log("phone number is required");
      return new Response(
        JSON.stringify({ error: "Phone number is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    console.log("I am trying to fetch data from public.users data through phone number");
    const user = await getUser(phoneNo);

    if (user == null) {
      console.log("If user is null then user is new user");
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phoneNo,
      });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
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
    } else if (user && user.lockout_time < new Date().toISOString()) {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phoneNo,
      });
      if (user.failed_login_count == 3) {
        const { data, error } = await supabase
          .from("public.user")
          .update({ "failed_login_count": 0 })
          .eq("mobile", phoneNo).single();
        if (error)
        {
          console.log("After completing lockout time faild to update faild_login_count as 0");
        } 
        else
        {
          console.log("After lockout time successfully updated faild_login_count as 0");
        }
      }

      if (error) {
        console.log(" Error in sending otp")
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      console.log("Otp is sent successfully to your mobile number")
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

  return new Response("Unsupported request", { status: 405 });
}
