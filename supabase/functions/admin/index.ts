import { supabase } from "../DbConfig/DbConn.ts";

Deno.serve(async (req) => {
  if (req.method === "POST") {
    const { phoneNo } = await req.json();

    if (!phoneNo) {
      return new Response("Phone number is required", { status: 400 });
    }

    const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
      phone: phoneNo,
      role: "authenticated",
    });

    if (authError) {
      return new Response(`Error creating user: ${authError.message}`, {
        status: 500,
      });
    }

    const { error: dbError } = await supabase
      .from("users")
      .upsert({
        auth_user_id: newUser.user.id,
        role: "admin",
      });

    if (dbError) {
      return new Response(`Error updating user role: ${dbError.message}`, {
        status: 500,
      });
    }

    return new Response("Admin user created successfully", { status: 200 });
  } else {
    return new Response("Method Not Allowed", { status: 405 });
  }
});
