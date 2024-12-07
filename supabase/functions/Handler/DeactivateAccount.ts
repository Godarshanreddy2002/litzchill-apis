import { supabase } from "../DbConfig/DbConn.ts";


export async function DeactivateAccount(req:Request,user_id:string) 
{
  
        const user = req.headers.get("Authorization");
        if (!user) {
            console.log("First check")
            return new Response("Unauthorized", { status: 401 });
        }

        const jwt = user.replace("Bearer ", "");
        const { data: userData, error: authError } = await supabase.auth
            .getUser(jwt);
        if (authError || !userData) {
            console.log("user session expired")
            return new Response("Unauthorized", { status: 401 });
        }

        const account_status:string='S';
        const {data,error}=await supabase
        .from('users')
        .update({'account_status':account_status})
        .eq('user_id',user_id);

        if(error)
        {
            return new Response("Data base error",
                {
                    status:505,
                    headers:{"Content-Type": "application/json"}
                }
            )
        }
        else
        {
            return new Response("Account is Deactivated successfully",
                {
                    status:200,
                    headers:{"Content-Type": "application/json"}
                }
            )
        }
    
}
    