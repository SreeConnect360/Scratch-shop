import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/hooks/use-theme";
import { PortalProvider } from "@/lib/portal-state";
import { GoogleOAuthProvider } from "@react-oauth/google";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="editorial-label text-accent">Error 404</p>
        <h1 className="mt-6 font-serif text-7xl">Lost in transit.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're searching for has stepped off the runway.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex items-center justify-center border border-foreground/40 px-8 py-3 editorial-label hover:bg-foreground hover:text-background transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="editorial-label text-accent">Something Interrupted</p>
        <h1 className="mt-6 font-serif text-5xl">The frame didn't load.</h1>
        <p className="mt-4 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-10 border border-foreground/40 px-8 py-3 editorial-label hover:bg-foreground hover:text-background transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" },
      { title: "ReeVibes — Indian Editorial Fashion Platform" },
      {
        name: "description",
        content:
          "ReeVibes is a luxury editorial platform celebrating beauty through Indian fashion contests, runway storytelling and cinematic photography.",
      },
      { name: "author", content: "ReeVibes" },
      { property: "og:title", content: "ReeVibes — Indian Editorial Fashion Platform" },
      {
        property: "og:description",
        content:
          "ReeVibes is a luxury editorial platform celebrating beauty through Indian fashion contests, runway storytelling and cinematic photography.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ReeVibes — Indian Editorial Fashion Platform" },
      {
        name: "twitter:description",
        content:
          "ReeVibes is a luxury editorial platform celebrating beauty through Indian fashion contests, runway storytelling and cinematic photography.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8cd86e9d-e25a-451a-a79f-f4fbd87e82e1/id-preview-283b10d1--15bfd4a3-bd5c-4a0c-8a13-a093490e4357.lovable.app-1779169156629.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8cd86e9d-e25a-451a-a79f-f4fbd87e82e1/id-preview-283b10d1--15bfd4a3-bd5c-4a0c-8a13-a093490e4357.lovable.app-1779169156629.png",
      },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('reevibes-theme') || 'dark';
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(stored);
                  document.documentElement.setAttribute('data-theme', stored);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { Toaster } from "@/components/ui/sonner";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <ThemeProvider>
          <PortalProvider>
            <Outlet />
            <Toaster duration={2000} position="top-right" closeButton />
          </PortalProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
