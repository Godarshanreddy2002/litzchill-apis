import { createClient } from "npm:@supabase/supabase-js";
import { UserProfile } from "../model/UserTable.ts";
// import { AuthUser } from "npm:@supabase/supabase-js";

const url = 'https://rpsfsggtydflqjkduzgt.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwc2ZzZ2d0eWRmbHFqa2R1emd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNzE2ODYsImV4cCI6MjA0Nzc0NzY4Nn0.wdRGjSJBef_UexqTmpok3-cRxHO6I86jbDMYmvbzZC0';

const supabase = createClient(url, key);

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const userToken = req.headers.get('Authorization');
    if (!userToken) {
      return new Response('Unauthorized', { status: 401 });
    }

    const jwt = userToken.replace('Bearer ', '');
    const { data: userData, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !userData) {
      return new Response('Unauthorized', { status: 401 });
    }

    const requestBody = await req.json();
    const userInfo: UserProfile = requestBody;
    userInfo.auth_user_id = userData.user.id;
    console.log(userInfo.auth_user_id);
    
    userInfo.user_type='V';

    // Validate the mobile number format (using regex for simplicity)
    const mobileRegex = /^\+?[0-9]{10,15}$/;
    if (userInfo.mobile && !mobileRegex.test(userInfo.mobile)) {
      return new Response('Invalid mobile number', { status: 400 });
    }

    // Check if a user with the same mobile number already exists
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('mobile')
      .eq('mobile', userInfo.mobile)
      .limit(1);  // Use limit(1) to avoid returning multiple rows

    if (userError) {
      return new Response(`Error checking user: ${userError.message}`, { status: 400 });
    }

    if (existingUser && existingUser.length > 0) {
      return new Response('User already exists. Go to Update Option.', { status: 400 });
    }

    // Insert the new user into the database
    const { data, error } = await supabase
      .from('users')
      .insert(userInfo)
      .select();

    if (error) {
      return new Response(`Error inserting user: ${error.message}`, { status: 400 });
    }

    // Return the inserted user data in the response
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response('Internal Server Error', { status: 500 });
  }
});
