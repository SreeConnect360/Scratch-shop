import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_shop/shop")({
  beforeLoad: () => {
    throw redirect({ to: "/categories" });
  },
});
