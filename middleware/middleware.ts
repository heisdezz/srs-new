import type { Route } from "../app/+types/page";

let bad_routes = ["home/fire"];
export let middleware: Route.unstable_MiddlewareFunction = async (
  { context, params, request },
  next,
) => {
  console.log("middleware running");
  return await next();
};
