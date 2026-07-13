import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_shop/orders")({
  beforeLoad: () => {
    throw redirect({
      to: "/account",
      search: { tab: "orders" } as any,
    });
  },
});
