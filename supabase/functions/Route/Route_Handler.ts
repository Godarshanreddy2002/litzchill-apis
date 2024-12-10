import { STATUSCODE, USERMODULE } from "../utils/constant.ts";
import { ErrorResponse } from "../utils/Response.ts";

 
 
 
//performing routing
export async function routeHandler(req:Request,routes:Record<string,any>){
 
  //extracting method and path from url
  const method = req.method;
  const url = new URL(req.url);
  const path = url.pathname;
  console.log(`Request received in route handler - Method: ${method}, Path: ${path}`);

  //finding all method routes path into single array
  const allRoutes = Object.values(routes).flatMap((methodRoutes) =>
      Object.keys(methodRoutes)
    );
    console.log("allroutes",allRoutes);
    console.log("paths",path);

    //finding all matching routes based on method
    const allMatchedMethodRoutes=routes[method];

    //checking our path is present into path key array
    console.log("include",allRoutes.includes(path));
    if(allRoutes.includes(path)){
      console.log("if executed");
      //we are calling correct method for that path or not
        if (!allMatchedMethodRoutes || !allMatchedMethodRoutes?.[path]) {
               console.error(`Method '${method}' not allowed for route '${path}'`);
               return ErrorResponse(USERMODULE.METHOD_NOT_SUPPORTED,STATUSCODE.METHODS_NOT_ALLOWED)
          }
         
      }

      //checking for static routes if present then calling handler
      if (allMatchedMethodRoutes[path]) {
          return await allMatchedMethodRoutes[path](req);
      }

        //checking for dyanamic route matching
      for (const routePattern in allMatchedMethodRoutes) {
          const param = extractParameter(routePattern, path);
          if (param) {
            const {id}=param;
              //calling handler if path is correct
            return await allMatchedMethodRoutes[routePattern](req, id);
          }
       }
       const trimmedPath = path.split('/').slice(0, -1).join('/')+'/:id';
       console.log("trimmed path",trimmedPath);
        if(allRoutes.includes(trimmedPath)){
         return ErrorResponse(USERMODULE.METHOD_NOT_SUPPORTED,STATUSCODE.METHODS_NOT_ALLOWED)
        }  
     
      return ErrorResponse(USERMODULE.ROUT_NOT_FOUND,STATUSCODE.NOT_FOUND)
}



// Extracts parameters from a path based on a route pattern
export function extractParameter(routePattern: string, path: string) {

    const routePath = routePattern.split("/");
    const actualPath = path.split("/");

    // Return null if path lengths do not match
      if (routePath.length !== actualPath.length) {
       console.log("Route pattern and actual path lengths not match.");
       return null;
      }

      const params: Record<string, string> = {};

    // Extract parameters from path
     for (let i = 0; i < routePath.length; i++) {
         if (routePath[i].startsWith(":")) {
            const paramName = routePath[i].slice(1);//removing : from route path
            params[paramName] = actualPath[i];
            console.log(`Extracted parameter: ${paramName} = ${actualPath[i]}`);
          }
          else if (routePath[i] !== actualPath[i]) {
                console.log(`Mismatch at position ${i}: expected ${routePath[i]} but found ${actualPath[i]}`);
                return null;
          }
      }

      console.log("Extracted Parameters:", params);
      return params;

}


