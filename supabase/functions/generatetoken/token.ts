import {createClient} from "npm:@supabase/supabase-js"

const url='https://rpsfsggtydflqjkduzgt.supabase.co'
const key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwc2ZzZ2d0eWRmbHFqa2R1emd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNzE2ODYsImV4cCI6MjA0Nzc0NzY4Nn0.wdRGjSJBef_UexqTmpok3-cRxHO6I86jbDMYmvbzZC0'

const supabase=createClient(url,key);

async function sendOtp() {
    console.log("Starting")
    const { data, error } = await supabase.auth.signInWithOtp({
        phone: '+916305917434', // Phone number to send OTP to
      });
      if(error)
      {
        console.log("faild to send otp")
      }
      console.log("Ending")
    
}

async function  verifyOtp() {

    console.log("start of verify")
    const { data, error } = await supabase.auth.verifyOtp({
  phone: '+916305917434',
  token: '593911',
  type: 'sms'

})
console.log(data)
if(error)
{
    console.log("Otp not matched")
}
console.log("End of the verify")
}
//sendOtp();
verifyOtp();
