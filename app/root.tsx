import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { middleware } from "middleware/middleware";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CookieTs from "cookie-ts";

import appCss from "./app.css?url";
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  // {
  //   rel: "stylesheet",
  //   href: appCss,
  // },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    // crossOrigin: true,
  },
  {
    href: "https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Lobster+Two:wght@400;700&display=swap",
    rel: "stylesheet",
  },
];
export const loader = async (props: LoaderFunctionArgs) => {
  const cookie = props.request.headers.get("cookie");
  const parsed = CookieTs.parse(cookie);
  console.log(parsed);
  return { theme: parsed["theme"] || "srs" };
};
const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // PocketBase returns 404 when record not found
        if (error?.status === 404) return false;

        // Optional: stop after 2 retries
        return failureCount < 2;
      },
    },
  },
});
export function Layout({ children }: { children: React.ReactNode }) {
  const props = useLoaderData<typeof loader>();
  return (
    <html lang="en" data-theme={props.theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
        {/*{children}*/}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

export const unstable_middleware = [middleware];
