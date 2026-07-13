import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_shop/wishlist")({
  beforeLoad: () => {
    throw redirect({
      to: "/account",
      search: { tab: "wishlist" } as any,
    });
  },
});
