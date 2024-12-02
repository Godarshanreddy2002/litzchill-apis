import supabase from "../DbConfig/DbConn.ts"; // Import your Supabase instance



export default async function verifyUser(email: string, password: string) {
  // Query the users table to get the user with the matching email
  const { data, error } = await supabase
    .from('users')
    .select('email, password, status')  
    .eq('email', email)
    .single();

  if (error) {
    throw new Error("User not found");
  } else {
    
   

    if (password==data.password) {
     if (error) {
        throw new Error('User not found in Supabase');
      }        
    } else {
      throw new Error("Incorrect password");
    }
  }
}
