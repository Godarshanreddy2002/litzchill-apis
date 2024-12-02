import {createClient} from "npm:@supabase/supabase-js"
// import { UserProfile } from "../model/UserTable.ts";
// import AuthAdminApi from "../../../../../AppData/Local/deno/npm/registry.npmjs.org/@supabase/auth-js/2.65.1/dist/module/AuthAdminApi.d.ts";

const url='https://rpsfsggtydflqjkduzgt.supabase.co'
const key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwc2ZzZ2d0eWRmbHFqa2R1emd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNzE2ODYsImV4cCI6MjA0Nzc0NzY4Nn0.wdRGjSJBef_UexqTmpok3-cRxHO6I86jbDMYmvbzZC0'

const supabase=createClient(url,key);

Deno.serve(async (req) => {

  if (req.method === 'POST') {
    console.log("API started");

   
    const { Otp,phoneNo } = await req.json();

    console.log("Check if phoneNo,otp are provided")
    if (!Otp||!phoneNo) {
      return new Response(JSON.stringify({ error: 'missing field' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNo,
      token: Otp,
      type: 'sms'
    })

    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const id=data.user?.id;
    if(id)
    {
      console.log("Checking if user exists...");

// First, check if the auth_user_id already exists in the users table
const { data, error: checkError } = await supabase
  .from('users')
  .select('auth_user_id')
  .eq('auth_user_id', id)
  .single(); // `.single()` returns the first matching record, or null if no match is found

if (checkError) {
  console.error("Error checking for existing user:", checkError);
 
}

if (data) {
  
  console.log("User with this auth_user_id already exists.");
} else {
  
  console.log("User not found, inserting new user...");

  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({ 'auth_user_id': id ,'account_verified':{email:false,phone:true}});

  if (userError) {
    console.error("Error inserting user:", userError);
  } else {
    console.log("User created successfully:", userData);
  }
}
    }
    

    // Return success response with OTP data (which will be sent via SMS)
    return new Response(JSON.stringify({ message: "OTP verified successfully", data: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Return 405 for unsupported methods
  return new Response("Unsupported request", { status: 405 });


});



