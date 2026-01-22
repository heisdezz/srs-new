// import { type RouteConfig, index } from "@react-router/dev/routes";

// export default [index("routes/home.tsx")] satisfies RouteConfig;

import { type RouteConfig } from "@react-router/dev/routes";
import { nextRoutes, appRouterStyle } from "rr-next-routes/react-router";
// for remix use this instead
// import {nextRoutes, appRouterStyle} from "rr-next-routes/remix";

const routes = nextRoutes({
  print: "info",
  routeFileNames: ["page", "index"],
  layoutFileName: "route",
  folderName: "routes",
});

export default routes satisfies RouteConfig;
