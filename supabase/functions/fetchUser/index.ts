
import { handleAllErrors } from "../ErrorHandler/HandlingError.ts"
import { supabase } from "../DbConfig/DbConn.ts"

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  console.log("method is : "+req.method)
  if (req.method === 'GET') {
    console.log("home")
      
      const url = new URL(req.url);
      // Assuming the userId is passed as a query parameter
      const path=url.pathname.split('/').pop();
      console.log(path)
      const userId=path;
      console.log("start of fetching"+userId);
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
      console.log("End of fetching")
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

    }
   else {
    return handleAllErrors({
      status_code: 405,
      error_message: "Method Not Allowed",
      error_time: new Date(),
    });

  }
})

