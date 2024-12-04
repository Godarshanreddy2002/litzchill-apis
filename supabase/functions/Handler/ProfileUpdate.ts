import { supabase } from "../DbConfig/DbConn.ts";
import { handleAllErrors } from "../ErrorHandler/HandlingError.ts";
import { UserProfile } from "../model/UserTable.ts";

export default async function updateUserProfile(req: Request) {
    try {
        if (req.method !== "PATCH") {
            return new Response("Method Not Allowed", { status: 405 });
        }
        console.log("started update");

        // const user = req.headers.get("Authorization");
        // if (!user) {
        //     console.log("First check")
        //     return new Response("Unauthorized", { status: 401 });
        // }

        // const jwt = user.replace("Bearer ", "");
        // const { data: userData, error: authError } = await supabase.auth
        //     .getUser(jwt);
        // if (authError || !userData) {
        //     console.log("user session expired")
        //     return new Response("Unauthorized", { status: 401 });
        // }
        // console.log(userData);
        // const user_id = userData.user.id;
        // console.log(user_id);

        const updateUser: UserProfile = await req.json();
        const user_id = updateUser.user_id;

        if (!user_id) {
            return handleAllErrors({
                status_code: 400,
                error_message: "missing field",
                error_time: new Date(),
            });
        } else {
            console.log("checking user");
            const { data,error } = await supabase.auth.getUser();

            if (error) {
                console.log("database error at checking auth.users");
                return new Response(`Error fetching user data: ${error.message}`, { status: 500 });
            } else if (data) {
                console.log("access token");
                console.log(data.user);
            } else {
                console.log("session expired");
                return new Response(
                    JSON.stringify({ error: "User session is expired" }),
                    {
                        status: 440,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }
        }

        // if(!updateUser.first_name||!updateUser.last_name||!updateUser.dob||!updateUser.username||updateUser.gender)
        // {
        //     throw new Error("Missing Required field")
        // }
        if (!updateUser.first_name) {
            throw new Error("Missing Required first name");
        } else if (!updateUser.last_name) {
            throw new Error("Missing Required last name");
        } else if (!updateUser.username) {
            throw new Error("Missing Required user name");
        } else if (!updateUser.gender) {
            throw new Error("Missing Required Gender");
        } else if (!updateUser.dob) {
            throw new Error("missing Date of birth");
        }

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("user_id", user_id).single();
        if (error) {
            console.log("error in database");
        }
        if (data) {
            updateUser.account_status = data.account_status;
            if (updateUser.account_status == "S") {
                return new Response(
                    JSON.stringify("User Account is deactivated/Suspended"),
                    {
                        status: 403,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }
        }
        updateUser.updated_at = new Date().toISOString();
        const { data: userUData, error: userUError } = await supabase
            .from("users")
            .update(updateUser)
            .eq("user_id", user_id)
            .eq("account_status", "A");

        if (userUError) {
            return new Response(
                `Error updating profile: ${userUError.message}`,
                { status: 400 },
            );
        }

        return new Response(
            JSON.stringify({ message: "User data is successfully updated" }),
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
