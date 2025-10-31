import { AppShell } from "@/components";
import envParsed from "@/envParsed";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import React from "react";

const { NODE_ENV } = envParsed();

const TanStackRouterDevtools =
  NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        import("@tanstack/react-router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export const Route = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
      <TanStackRouterDevtools />
    </AppShell>
  ),
});
