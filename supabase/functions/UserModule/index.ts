
import signInWithOtp from "../Handler/SendOtp.ts";
import verifyOtp from "../Handler/VerifyOtp.ts";
import updateUserProfile from "../Handler/ProfileUpdate.ts";

import { ErrorResponse } from "../utils/Response.ts";




Deno.serve(async (req: Request) => {
  
  const  url  = new URL(req.url)
  const path=url.pathname.split('/');
  const endUrl=path[path.length-1];
  
  if(req.method=='POST')
  {
    if (endUrl === 'sendOtp') {
      const data= signInWithOtp(req);
      console.log("sign in")
     
  
      return data;
  
    } else if(endUrl=='verifyOtp')
    {
      const data=await verifyOtp(req);
      return data;
    }
  }
 else if(req.method=='PUT')
  {
    if (endUrl === 'userUpdate' ) {
      const data=await updateUserProfile(req)
      return data;
  
    }
  }
 
  return ErrorResponse("Route not found",505);

});







  /*
  if (endUrl === 'sendOtp') {
    const data= signInWithOtp(req);
    console.log("sign in")
    // return new Response(JSON.stringify(data));

    return data;

  } else if(endUrl=='verifyOtp')
  {
    const data=await verifyOtp(req);
    return data;
  }
  
  else if (endUrl === 'userUpdate' ) {
    const data=await updateUserProfile(req)
    return data;

  }
  else if(endUrl==='logout')
  {
    const data=await logoutUser(req);
    return data;
  }
  else if(endUrl=='de_activate')
  {
    const data=await DeactivateAccount(req)
    return data
  }
   else {
    // Default response for unsupported routes or methods
    return new Response(JSON.stringify({ error: 'Route not found or method not allowed' }), { status: 404 });
  }

  
  
});
*/
