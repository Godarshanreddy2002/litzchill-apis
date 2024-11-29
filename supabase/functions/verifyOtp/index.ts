import {createClient} from "npm:@supabase/supabase-js"

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

    // Return success response with OTP data (which will be sent via SMS)
    return new Response(JSON.stringify({ message: "OTP veriied successfully", data: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Return 405 for unsupported methods
  return new Response("Unsupported request", { status: 405 });

});
