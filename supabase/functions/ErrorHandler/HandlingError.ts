import { ErrorResponse } from "./I_Error.ts";
export function handleAllErrors(error: ErrorResponse) {
    return new Response(
        JSON.stringify({
            status_code: error.status_code,
            error_message: error.error_message,
            error_time: error.error_time,
        }),
        {
            status: error.status_code,
            headers: { "Content-Type": "application/json" }
        }
    );
}