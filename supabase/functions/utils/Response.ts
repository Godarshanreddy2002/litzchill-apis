


export function ErrorResponse(message:string,status_code:number):Response 
{
    return new Response(
        JSON.stringify({ error: message }),
        {
            status: status_code,
            headers: { "Content-Type": "application/json" },
        },
    );        
}
export function SuccessResponse(message:string,data?:any):Response 
{
    const body=data?{message,data}:{message}
    return new Response(
        JSON.stringify(body),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        },
    );     
}
export function returnAccessToken(message:string,user_id:string,session_token:string)
{
    return new Response(
        JSON.stringify({ message: message,user_id,session_token }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        },
    );
}
