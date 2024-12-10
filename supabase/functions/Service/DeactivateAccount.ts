
import getUserAuthenticationDetails from "../middleware/CheckingUserType.ts";
import { DeactivateUser } from "../Repository/UserRepo.ts";


export async function DeactivateAccount(req:Request,user_id:string) 
{
  console.log("start of deactivate");
    const roles:string[]=['A','U']
        
    const result=await getUserAuthenticationDetails(req,roles);   
    if(result.response &&!result.params){
        return result.response;
 }
    
    const data=await DeactivateUser(user_id);
    if(data instanceof Response)
    {
        return data;
    }
    
}
    