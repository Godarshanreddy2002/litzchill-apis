

import { UserModuleRoutes } from "../Route/Route.ts";
import { routeHandler } from "../Route/Route_Handler.ts";



Deno.serve(async (req: Request) => {
  
return await routeHandler(req,UserModuleRoutes)

});






