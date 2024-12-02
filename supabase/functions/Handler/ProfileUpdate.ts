import supabase from "../DbConfig/DbConn.ts";
import { UserProfile } from "../model/UserTable.ts";

export default async function updateUserProfile(req: Request) {
    try {
        if (req.method !== "PUT") {
            return new Response("Method Not Allowed", { status: 405 });
        }

        const user = req.headers.get("Authorization");
        if (!user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const jwt = user.replace("Bearer ", "");
        const { data: userData, error: authError } = await supabase.auth
            .getUser(jwt);
        if (authError || !userData) {
            return new Response("Unauthorized", { status: 401 });
        }

        const user_id = userData.user.id;
        console.log(user_id);

        const requestBody = await req.json();
        const updateUser: UserProfile = requestBody;
        if(!updateUser.first_name||!updateUser.last_name||!updateUser.dob||!updateUser.username||updateUser.gender)
        {
            throw new Error("Missing Required field")
        }
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("auth_user_id", user_id).single();
        if (error) {
            console.log("error in database");
        }
        if (data) {
            updateUser.account_status = data.account_status;
            if (updateUser.account_status == "S") {
                return new Response(
                    JSON.stringify("User Account is deactivated/Suspended"),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }
        }

        const { data: userUData, error: userUError } = await supabase
            .from("users")
            .update({ updateUser, updated_at: new Date().toISOString() })
            .eq("auth_user_id", user_id)
            .eq("account_status", "A");

        if (userUError) {
            return new Response(
                `Error updating profile: ${userUError.message}`,
                { status: 400 },
            );
        }

        return new Response(
            JSON.stringify("User data is successfully updated"),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            },
        );
    } catch (err) {
        console.error(err);
        return new Response("Internal Server Error", { status: 500 });
    }
}
