import {createClient} from "npm:@supabase/supabase-js"
const url='https://rpsfsggtydflqjkduzgt.supabase.co'
const key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwc2ZzZ2d0eWRmbHFqa2R1emd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNzE2ODYsImV4cCI6MjA0Nzc0NzY4Nn0.wdRGjSJBef_UexqTmpok3-cRxHO6I86jbDMYmvbzZC0'

const supabase=createClient(url,key);

Deno.serve(async (req) => {
  try {
    
    if (req.method !== 'PUT') {
      return new Response('Method Not Allowed', { status: 405 });
    }

   
    const user = req.headers.get('Authorization');
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    
    const jwt = user.replace('Bearer ', '');
    const { data: userData, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !userData) {
      return new Response('Unauthorized', { status: 401 });
    }

    const  user_id = userData.user.id;
    console.log(user_id)

    
    const requestBody = await req.json();
    const { mobile, first_name, last_name, username, bio } = requestBody;

    // Validate the mobile number format (simple regex for demonstration)
    // const mobileRegex = /^\+?[0-9]{13}$/;
    // if (mobile && !mobileRegex.test(mobile)) {
    //   return new Response('Invalid mobile number', { status: 400 });
    // }

   
    const { data, error } = await supabase
      .from('users')
      .update({
        mobile,
        first_name,
        last_name,
        username,
        bio,
        updated_at: new Date(),
      })
      .eq('auth_user_id', user_id); 

    
    if (error) {
      return new Response(`Error updating profile: ${error.message}`, { status: 400 });
    }

    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response('Internal Server Error', { status: 500 });
  }
});