import { supabase } from "../DbConfig/DbConn.ts";
import { handleAllErrors } from "../ErrorHandler/HandlingError.ts";

export default async function logoutUser(req:Request) 
{
   
            const { error } = await supabase.auth.signOut()
            if(error)
            {
                console.log("not able to log out")
                return handleAllErrors({status_code:500,error_message:"Internal server error",error_time:new Date()})
            }
            else{
                return new Response(
                    JSON.stringify({message:"User LogOut successfully"}),
                    {
                        status:200,
                        headers: { "Content-Type": "application/json" },
                    }                       
                )
            }
       

}