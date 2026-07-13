import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/FashionBattle/angels/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/FashionBattle/contestants/$slug", params: { slug: params.slug } });
  },
});
