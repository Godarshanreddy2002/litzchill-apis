import supabase from "../DbConfig/DbConn.ts";

export async function getAuthUser(id:string) 
{
  const { data, error: checkError } = await supabase
      .from('users')
      .select('auth_user_id')
      .eq('auth_user_id', id)
      .single(); 
      if(checkError)
      {
        console.log("Some thing went wrong at the time of getting Auth.user");
        return;
      }
      else
      {
        return data;
      }
}

export  async  function getUser(phoneNo:string)
{
  const {data,error}=await supabase
  .from('users')
  .select("*")
  .eq('mobile',phoneNo).single();
  if(error)
  {
    return;
  }
  else
  {
    return data;
  }

}





