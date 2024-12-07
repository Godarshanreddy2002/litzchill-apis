import { handleAllErrors } from "../ErrorHandler/HandlingError.ts";
import { supabase } from "../DbConfig/DbConn.ts";

export default async function FetchUserProfile(req: Request,userId:string) {
  
    try {
      
    

      if (!userId) {
        return handleAllErrors({
          status_code: 400,
          error_message: "userId is required",
          error_time: new Date(),
        });
      }

      // Fetch the user from the database using Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single(); // .single() ensures only one result is returned

      if (error) {
        return handleAllErrors({
          status_code: 500,
          error_message: error.message,
          error_time: new Date(),
        });
      }

      // Return the fetched user data
      if (data) {
        return new Response(JSON.stringify(data), { status: 200 });
      } else {
        return handleAllErrors({
          status_code: 404,
          error_message: "User not found",
          error_time: new Date(),
        });
      }

    } catch (error) {
      // General error handling for unexpected issues
      return handleAllErrors({
        status_code: 500,
        error_message: "Internal server Error",
        error_time: new Date(),
      });
    }
 
 
}
