import {createClient} from "npm:@supabase/supabase-js"
import signInWithOtp from "../Handler/SendOtp.ts";
import verifyOtp from "../Handler/VerifyOtp.ts";
import updateUserProfile from "../Handler/ProfileUpdate.ts";

const url='https://rpsfsggtydflqjkduzgt.supabase.co'
const key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwc2ZzZ2d0eWRmbHFqa2R1emd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNzE2ODYsImV4cCI6MjA0Nzc0NzY4Nn0.wdRGjSJBef_UexqTmpok3-cRxHO6I86jbDMYmvbzZC0'

const supabase=createClient(url,key);


Deno.serve(async (req: Request) => {
  // Get the method (GET, POST, etc.) and path of the request
  const { method, url } = req;

  // Parse the incoming request body, assuming it's in JSON format
  let body: any = null;
  try {
    body = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON format' }), { status: 400 });
  }

  // Check the type of request based on the URL or method
  if (url === '/sendOtp') {
    const data= signInWithOtp(req);
    // return new Response(JSON.stringify(data));

    return data;

  } else if (url === '/verifyOtp' ) {
    // Logic for verifying OTP
    const data=await verifyOtp(req);
    return data;   
   

  } else if (url === '/userUpdate' ) {
    const data=await updateUserProfile(req)
    return data;

  } else {
    // Default response for unsupported routes or methods
    return new Response(JSON.stringify({ error: 'Route not found or method not allowed' }), { status: 404 });
  }
});
