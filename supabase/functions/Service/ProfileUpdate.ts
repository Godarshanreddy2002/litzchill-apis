
import { UserProfile } from "../model/UserTable.ts";
import getUserAuthenticationDetails from "../middleware/CheckingUserType.ts";
import { updateProfile } from "../Repository/UserRepo.ts";
import { SuccessResponse } from "../utils/Response.ts";
import { USERMODULE } from "../utils/constant.ts";
export default async function updateUserProfile(req: Request,user_id:string) {
    try {
        const roles:string[]=['A','U']
        
        const result=await getUserAuthenticationDetails(req,roles);   
    if(result.response &&!result.params){
        return result.response;
 } 
        const requestBody = await req.json();
        const updateUser: UserProfile = requestBody;   
        
        updateUser.updated_at=new Date().toISOString() 
        

        const data=await updateProfile(updateUser,user_id)
        if(data)
        {
            return SuccessResponse(USERMODULE.USER_UPDATE_SUCCESS)
        }
       
    } catch (err) {
        console.error(err);
    return new Response("Internal Server Error", { status: 500 });
}
}
