import { supabase } from "../DbConfig/DbConn.ts";
import getUserAuthenticationDetails from "../middleware/CheckingUserType.ts";
import { DeactivateUser, makeUserLockout } from "../Repository/UserRepo.ts";


export async function DeactivateAccount(req:Request,user_id:string) 
{
  
    const roles:string[]=['A','U']
        
    const userParams=await getUserAuthenticationDetails(req,roles);   
    
    const data=await DeactivateUser(user_id);
    
    
}
    