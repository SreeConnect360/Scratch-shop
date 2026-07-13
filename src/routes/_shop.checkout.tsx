import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_shop/checkout")({
  beforeLoad: () => {
    throw redirect({
      to: "/cart",
      search: { buyNow: "true" } as any,
    });
  },
});
