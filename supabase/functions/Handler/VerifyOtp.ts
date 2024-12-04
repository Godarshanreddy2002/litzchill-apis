import {supabase} from "../DbConfig/DbConn.ts";
// import { UserProfile } from "../model/UserTable.ts";
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
        const user=await getUser(phoneNo);

        const { data, error } = await supabase.auth.verifyOtp({
            phone: phoneNo,
            token: Otp,
            type: "sms",
        });


        if (error) {
            let lockoutTIME;
            if(user)
            {
                let faildLogincount:number=user.failed_login_count+1;
                
                if(faildLogincount>=3){
                    lockoutTIME = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString()
                }
                else if(!user.lockout_time&&user.lockout_time<new Date().toISOString())
                {
                    lockoutTIME=null;
                    faildLogincount=0;
                }
                console.log("Trying to set lock out time")
                const {data,error}=await supabase
                .from('public.users')
                .update({'lockout_time':lockoutTIME,'failed_login_count':faildLogincount})
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
            return new Response(JSON.stringify({ error: error.message }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        else
        {
            const {user:verifiedUser,session:userSession} = data;
            const id = verifiedUser?.id;
        if (id) {
                console.log("Checking if user exists or not for creating new user...");
            const data = await getAuthUser(id);

            if (data) {
                console.log("User with this auth_user_id already exists.");
            } else {
                console.log("User not found, inserting new user...");

                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .insert({
                            "user_id":id,                    
                        "mobile":phoneNo,
                        "account_verified": { email: false, phone: true },
                        
                        }).single();

                if (userError) {
                    console.error("Error inserting user:", userError);
                } else {
                    console.log("User created successfully:", userData);

                    return new Response(
                        JSON.stringify({
                            message: "OTP verified successfully  User account is created",
                                id:verifiedUser.id,bearerToken:userSession?.access_token
                        }),
                        {
                            status: 200,
                            headers: { "Content-Type": "application/json" },
                        },
                    );
                }
            }
        }

        }       
        

        // Return success response with OTP data (which will be sent via SMS)
        const {user:verifiedUser,session:userSession} = data;
        return new Response(
            JSON.stringify({
                message: "OTP verified successfully",
                id:verifiedUser?.id,bearerToken:userSession?.access_token,
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
