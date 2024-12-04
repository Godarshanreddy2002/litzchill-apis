
import signInWithOtp from "../Handler/SendOtp.ts";
import verifyOtp from "../Handler/VerifyOtp.ts";
import updateUserProfile from "../Handler/ProfileUpdate.ts";
import logoutUser from "../Handler/LogOut.ts";




Deno.serve(async (req: Request) => {
  // Get the method (GET, POST, etc.) and path of the request
  const  url  = new URL(req.url)
  const path=url.pathname.split('/');
  const endUrl=path[path.length-1];
  // Check the type of request based on the URL or method
  if (endUrl === 'sendOtp') {
    const data= signInWithOtp(req);
    console.log("sign in")
    // return new Response(JSON.stringify(data));

    return data;

  } else if (endUrl === 'verifyOtp' ) {
    console.log("verify")
    // Logic for verifying OTP
    const data=await verifyOtp(req);
    return data;   
//user/:id {a:dd,}   

  } else if (endUrl === 'userUpdate' ) {
    const data=await updateUserProfile(req)
    return data;

  }
  else if(endUrl==='logout')
  {
    const data=await logoutUser(req);
    return data;
  }
   else {
    // Default response for unsupported routes or methods
    return new Response(JSON.stringify({ error: 'Route not found or method not allowed' }), { status: 404 });
  }
});
