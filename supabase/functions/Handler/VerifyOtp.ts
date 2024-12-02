import supabase from "../DbConfig/DbConn.ts";
import { getAuthUser, getUser } from "../Repository/LoginVerifyRepo.ts";

export default async function verifyOtp(req: Request) {
    if (req.method === "POST") {
        console.log("API started");

        const { Otp, phoneNo } = await req.json();

        console.log("Check if phoneNo,otp are provided");
        if (!Otp || !phoneNo) {
            return new Response(
                JSON.stringify({ error: "missing Otp or mobile number" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        const { data, error } = await supabase.auth.verifyOtp({
            phone: phoneNo,
            token: Otp,
            type: "sms",
        });

        if (error) {
            const user=await getUser(phoneNo);
            const faildLogincount:number=user.failed_login_count;
            if(user&&faildLogincount==3)
            {
                console.log("Trying to set lock out time")
                const {data,error}=await supabase
                .from('public.users')
                .update({'lockout_time':new Date(new Date().getTime() + 60 * 60 * 1000).toISOString()})
                .eq('mobile',phoneNo).single();
                if(error)
                {
                    console.log("Something went wrong to set lockout time")
                }
                else
                {
                    console.log("lockout time set 1 hour successfully")
                }

            }
            else if(user&&faildLogincount<3)            
            {
                console.log("trying to incrementing faild login count")
                const {data,error}=await supabase
                .from('public.users')
                .update({'failed_login_count':faildLogincount+1})
                .eq('mobile',phoneNo).single();

                if(error)
                {
                    console.log("faild login count is not incremented")
                }
                else{
                    console.log("Faild login count is incremented")
                }
            }
            else
            {
                console.log("new user")
            }
            
            return new Response(JSON.stringify({ error: error.message }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const id = data.user?.id;
        if (id) {
            console.log("Checking if user exists...");
            const data = await getAuthUser(id);

            if (data) {
                console.log("User with this auth_user_id already exists.");
            } else {
                console.log("User not found, inserting new user...");

                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .insert({
                        "auth_user_id": id,
                        "mobile":phoneNo,
                        "account_verified": { email: false, phone: true },
                        "lock_time":new Date().toISOString(),
                        
                    });

                if (userError) {
                    console.error("Error inserting user:", userError);
                } else {
                    console.log("User created successfully:", userData);
                    return new Response(
                        JSON.stringify({
                            message: "OTP verified successfully  User account is created",
                            data: data,
                        }),
                        {
                            status: 200,
                            headers: { "Content-Type": "application/json" },
                        },
                    );
                }
            }
        }

        // Return success response with OTP data (which will be sent via SMS)
        return new Response(
            JSON.stringify({
                message: "OTP verified successfully",
                data: data,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    // Return 405 for unsupported methods
    return new Response("Unsupported request", { status: 405 });
}
