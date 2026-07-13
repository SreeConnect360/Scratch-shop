import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { l as useAppStore, A as AdminLayout, e as AdminCard, D as Dialog, m as DialogContent, n as DialogHeader, o as DialogTitle, s as DialogDescription, g as StatusChip, i as AdminButton } from "./router-C_drxgJo.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { S as Search, al as Globe, G as Eye, X, b as ChevronLeft, d as ChevronRight, a0 as Link } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "node:fs";
import "node:path";
import "../_libs/xlsx.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
const COUNTRIES = ["All", "Adygea", "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Bermuda", "Bhutan", "Bolivia", "Bosnia-Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Catalonia", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Cote D'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "England", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "European Union", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "Gabon", "Georgia", "Germany", "Ghana", "Gibrlatar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Liechtenstein", "Luxembourg", "Lybia", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Island", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "North Korea", "Northern Ireland", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Principality of Sealand", "Puerto Rico", "Qatar", "Republic of the Congo", "Romania", "Russia", "Rwanda", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Scotland", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Vincent", "St. Helena", "St. Kitts and Nevis", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "The Gambia", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "U.S. Virgin Islands", "Uganda", "Ukraine", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Virgin Islands", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"];
function ContestantsAdminPage() {
  const {
    state
  } = useAppStore();
  const applications = state.applications;
  const [selectedYear, setSelectedYear] = reactExports.useState("All");
  const [filterCountry, setFilterCountry] = reactExports.useState("All");
  const [q, setQ] = reactExports.useState("");
  const [viewing, setViewing] = reactExports.useState(null);
  const [lightbox, setLightbox] = reactExports.useState(null);
  const list = reactExports.useMemo(() => {
    return applications.filter((c) => {
      if (selectedYear !== "All" && c.contestYear !== selectedYear) return false;
      if (filterCountry !== "All" && c.contestCountry !== filterCountry) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return c.fullName.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.contestantId.toLowerCase().includes(s) || c.country.toLowerCase().includes(s);
    });
  }, [applications, selectedYear, filterCountry, q]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { eyebrow: "Module · Contestant Applications", title: "Contestants Dashboard", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center justify-between gap-4 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-surface-2 px-3 py-2 border border-border-subtle min-w-72", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3.5 h-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search by name, ID, country or email…", className: "bg-transparent outline-none text-sm flex-1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border border-border-subtle bg-surface-2 px-3 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3.5 h-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: filterCountry, onChange: (e) => setFilterCountry(e.target.value), className: "bg-transparent text-xs outline-none cursor-pointer text-foreground bg-background", children: COUNTRIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, className: "bg-background text-foreground", children: c === "All" ? "All Countries" : c }, c)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border border-border-subtle bg-surface-2 px-3 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Year:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: selectedYear, onChange: (e) => setSelectedYear(e.target.value === "All" ? "All" : Number(e.target.value)), className: "bg-transparent text-xs outline-none cursor-pointer text-foreground bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "All", className: "bg-background text-foreground", children: "All Years" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2026", className: "bg-background text-foreground", children: "2026" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2025", className: "bg-background text-foreground", children: "2025" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2024", className: "bg-background text-foreground", children: "2024" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[1000px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left editorial-label text-muted-foreground border-b border-border-subtle", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "Year" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "Contest Country" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "Contestant ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "Full Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "Age" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "Country" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3 text-center", children: "Photos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3 text-center", children: "Videos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "Applied" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3 text-right", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          list.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-subtle hover:bg-surface-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3", children: c.contestYear }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3", children: c.contestCountry }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3 font-mono text-xs text-muted-foreground", children: c.contestantId }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.photos.portrait, alt: "", className: "w-9 h-12 object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: c.fullName })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 pr-3 text-muted-foreground", children: [
              c.age,
              " yrs"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3", children: c.country }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3 text-muted-foreground", children: c.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3 text-center", children: c.numPhotos }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3 text-center", children: c.numVideos }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3 text-muted-foreground", children: c.applicationDate }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewing(c), title: "View", className: "p-2 border border-border-subtle hover:border-foreground/40 text-foreground/70 hover:text-foreground transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" }) }) })
          ] }, c.contestantId)),
          list.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 11, className: "py-12 text-center text-muted-foreground", children: "No applications match this filter." }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!viewing, onOpenChange: (o) => !o && setViewing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-5xl max-h-[92vh] overflow-y-auto bg-background border-border-subtle p-0", children: viewing && /* @__PURE__ */ jsxRuntimeExports.jsx(ContestantProfile, { app: viewing, onOpenGallery: (images, index) => setLightbox({
      images,
      index
    }) }) }) }),
    lightbox && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[60] bg-black/95 flex items-center justify-center", onClick: () => setLightbox(null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
        e.stopPropagation();
        setLightbox(null);
      }, className: "absolute top-6 right-6 text-white/80 hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
        e.stopPropagation();
        setLightbox({
          ...lightbox,
          index: (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length
        });
      }, className: "absolute left-6 text-white/70 hover:text-white p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-7 h-7" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: lightbox.images[lightbox.index], alt: "", className: "max-h-[88vh] max-w-[88vw] object-contain", onClick: (e) => e.stopPropagation() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
        e.stopPropagation();
        setLightbox({
          ...lightbox,
          index: (lightbox.index + 1) % lightbox.images.length
        });
      }, className: "absolute right-6 text-white/70 hover:text-white p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-7 h-7" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-6 left-0 right-0 text-center text-white/60 editorial-label text-xs", children: [
        lightbox.index + 1,
        " / ",
        lightbox.images.length
      ] })
    ] })
  ] });
}
function ContestantProfile({
  app,
  onOpenGallery
}) {
  const gallery = [app.photos.portrait, app.photos.fullBody, app.photos.sideProfile, app.photos.candid, ...app.photos.additional].filter(Boolean);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/7] overflow-hidden bg-surface-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: app.photos.fullBody || app.photos.portrait, alt: app.fullName, className: "w-full h-full object-cover" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-6 lg:p-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-accent mb-2", children: [
          "Contestant · ",
          app.contestantId
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-serif text-4xl", children: app.fullName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
            app.contestCountry,
            " Edition · Applied ",
            app.applicationDate
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: `Stage · ${app.currentStage}`, tone: "accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: app.status, tone: app.status === "Approved" ? "success" : "warn" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 lg:px-10 py-8 grid lg:grid-cols-12 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7 space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Applicant Information", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { items: [["First Name", app.fullName.split(" ")[0]], ["Last Name", app.fullName.split(" ").slice(1).join(" ")], ["Age", `${app.age}`], ["Country", app.country], ["Email", app.email], ["Phone", app.phone]] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Physical Details", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { items: [["Height", app.height], ["Weight", app.weight], ["Bust", app.bust], ["Waist", app.waist], ["Hips", app.hips], ["Eye Colour", app.eyeColour], ["Hair Colour", app.hairColour], ["Shoe Size", app.shoeSize]] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Address Information", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { items: [["Street Address", app.streetAddress || "—"], ["City", app.city || "—"], ["State / Province", app.stateProvince || "—"], ["Zip / Postal Code", app.zipCode || "—"]] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Model Experience Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-foreground/80", children: app.experience || "No modeling experience description provided." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Personal Story Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-foreground/80", children: app.biography || "No biography or personal story provided." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Social Media & Portfolio Links", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: app.socialLinks && app.socialLinks.length > 0 ? app.socialLinks.map((link, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm justify-between py-1 border-b border-border-subtle/50 last:border-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "editorial-label text-accent flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "w-3 h-3" }),
            " ",
            link.platform
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: link.url, target: "_blank", rel: "noreferrer", className: "text-xs text-muted-foreground hover:text-foreground underline truncate max-w-xs", children: link.url })
        ] }, idx)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 text-xs text-muted-foreground", children: [
          app.social.instagram && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Instagram: ",
            app.social.instagram
          ] }),
          app.social.tiktok && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "· TikTok: ",
            app.social.tiktok
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5 space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Media · Photographs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: gallery.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onOpenGallery(gallery, i), className: "aspect-[3/4] overflow-hidden bg-surface-2 group", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: "", className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }) }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 editorial-label text-muted-foreground mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "· Portrait" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "· Full Body" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "· Side Profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "· Candid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "· Additional" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Media · Videos", children: app.videos && app.videos.intro && app.videos.intro.startsWith("data:video") ? /* @__PURE__ */ jsxRuntimeExports.jsx("video", { controls: true, className: "w-full aspect-video border border-border-subtle", src: app.videos.intro }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video bg-surface-2 border border-border-subtle flex items-center justify-center editorial-label text-muted-foreground text-center px-4", children: "Introduction Video · Awaiting upload" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "accent", children: "Approve Application" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", children: "Hold" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "ghost", children: "Reject" })
        ] })
      ] })
    ] })
  ] });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-accent mb-3", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border-subtle p-5 bg-surface", children })
  ] });
}
function Grid({
  items
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-6 gap-y-3 text-sm", children: items.map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: k }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: v })
  ] }, k)) });
}
export {
  ContestantsAdminPage as component
};
