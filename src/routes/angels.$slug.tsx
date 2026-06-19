import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/angels/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/contestants/$slug", params: { slug: params.slug } });
  },
});
