import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as useParams, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { P as PublicLayout } from "./PublicLayout-DsBdhFEV.mjs";
import { F as FadeUp, e as ease } from "./Reveal-DABDixyV.mjs";
import { l as useAppStore } from "./router-BFsnZUKW.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { V as Check, T as Trash2, P as Plus, ag as Image, O as Upload, ah as Film } from "../_libs/lucide-react.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const STEPS = ["Identity & Physical", "Address & Experience", "Your Story", "Social Links", "Media Uploads", "Review & Submit"];
const SOCIAL_PLATFORMS = ["Instagram", "Facebook", "Twitter/X", "Pinterest", "Portfolio", "Other"];
function ScopedApply() {
  const {
    contestId
  } = useParams({
    from: "/apply/$contestId"
  });
  const {
    state,
    submitApplication
  } = useAppStore();
  const contest = state.contests.find((c) => c.id === contestId);
  const navigate = useNavigate();
  const [form, setForm] = reactExports.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "24",
    height: "174 cm",
    weight: "62 kg",
    bust: "92 cm",
    waist: "66 cm",
    hips: "98 cm",
    eyeColour: "Hazel",
    shoeSize: "EU 39",
    hairColour: "Brunette",
    streetAddress: "12 Rue de la Paix",
    city: "Paris",
    stateProvince: "Île-de-France",
    zipCode: "75002",
    country: contest?.country ?? "",
    experience: "I have 3 years of freelance modeling experience, including editorial print and runway modeling.",
    bio: "I am passionate about modeling and fashion, and I want to share my journey to inspire others."
  });
  const [socialLinks, setSocialLinks] = reactExports.useState([{
    id: "1",
    platform: "Instagram",
    url: "https://instagram.com/model_anais"
  }, {
    id: "2",
    platform: "Portfolio",
    url: "https://portfolio.anais.com"
  }]);
  const [photos, setPhotos] = reactExports.useState([]);
  const [video, setVideo] = reactExports.useState(null);
  const [step, setStep] = reactExports.useState(0);
  const [showConfirm, setShowConfirm] = reactExports.useState(false);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const total = STEPS.length;
  const pct = (step + 1) / total * 100;
  reactExports.useEffect(() => {
    const user = state.user;
    if (!user) {
      sessionStorage.setItem("apply:redirectContestId", contestId);
      navigate({
        to: "/FashionBattle/login"
      });
    } else {
      let calculatedAge = "24";
      if (user.dob) {
        const birthYear = new Date(user.dob).getFullYear();
        if (!isNaN(birthYear)) {
          calculatedAge = String(2026 - birthYear);
        }
      }
      setForm((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || prev.phone,
        country: contest?.country || user.country || prev.country,
        age: calculatedAge
      }));
    }
  }, [state.user, contestId, navigate, contest]);
  if (!contest || !contest.published) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[60vh] flex items-center justify-center text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-label text-accent", children: "Unavailable" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-serif text-4xl", children: "Applications closed for this contest." })
    ] }) }) });
  }
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      alert("You can upload a maximum of 5 photos.");
      return;
    }
    const invalidFile = files.find((f) => f.size > 30 * 1024 * 1024);
    if (invalidFile) {
      alert("Each photo must be smaller than 30 MB.");
      return;
    }
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };
  const removePhoto = (index) => {
    setPhotos((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  };
  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      alert("Video file is too large.");
      return;
    }
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoElement.src);
      if (videoElement.duration > 60) {
        alert("The video duration cannot exceed 1 minute.");
      } else {
        setVideo({
          file,
          name: file.name
        });
      }
    };
    videoElement.src = URL.createObjectURL(file);
  };
  const addSocialLink = () => {
    setSocialLinks((prev) => [...prev, {
      id: String(Date.now()),
      platform: "Instagram",
      url: ""
    }]);
  };
  const removeSocialLink = (id) => {
    setSocialLinks((prev) => prev.filter((l) => l.id !== id));
  };
  const updateSocialLink = (id, patch) => {
    setSocialLinks((prev) => prev.map((l) => l.id === id ? {
      ...l,
      ...patch
    } : l));
  };
  const executeSubmit = async () => {
    setIsSubmitting(true);
    try {
      const base64Photos = [];
      for (const p of photos) {
        const reader = new FileReader();
        const promise = new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
        });
        reader.readAsDataURL(p.file);
        base64Photos.push(await promise);
      }
      let base64Video = "";
      if (video) {
        const reader = new FileReader();
        const promise = new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
        });
        reader.readAsDataURL(video.file);
        base64Video = await promise;
      }
      submitApplication({
        fullName: `${form.firstName} ${form.lastName}`,
        email: form.email,
        country: form.country,
        phone: form.phone,
        dob: state.user?.dob || "",
        age: Number(form.age) || 24,
        height: form.height,
        weight: form.weight,
        bust: form.bust,
        waist: form.waist,
        hips: form.hips,
        eyeColour: form.eyeColour,
        shoeSize: form.shoeSize,
        hairColour: form.hairColour,
        streetAddress: form.streetAddress,
        city: form.city,
        stateProvince: form.stateProvince,
        zipCode: form.zipCode,
        experience: form.experience,
        biography: form.bio,
        socialLinks: socialLinks.map((l) => ({
          platform: l.platform === "Other" ? l.customPlatform || "Other" : l.platform,
          url: l.url
        })),
        photos: {
          portrait: base64Photos[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=400&q=80",
          fullBody: base64Photos[1] || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&h=400&q=80",
          sideProfile: base64Photos[2] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=400&q=80",
          candid: base64Photos[3] || "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=300&h=400&q=80",
          additional: base64Photos.slice(4)
        },
        videos: {
          intro: base64Video || "",
          additional: []
        },
        numPhotos: photos.length || 4,
        numVideos: video ? 1 : 0
      });
      setShowConfirm(false);
      navigate({
        to: "/FashionBattle/account/applications"
      });
    } catch (e) {
      console.error(e);
      alert("Error submitting application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-6 lg:px-16 pt-24 pb-10 border-b border-border-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "editorial-eyebrow text-accent", children: [
        "Apply · ",
        contest.country,
        " ",
        contest.year
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-5xl lg:text-7xl", children: "Become part of the story." }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-6 lg:px-16 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-6 mb-10 overflow-x-auto", children: STEPS.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-7 h-7 rounded-full border flex items-center justify-center text-xs ${i <= step ? "bg-accent border-accent text-white" : "border-foreground/30 text-muted-foreground"}`, children: i < step ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }) : i + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `editorial-label ${i === step ? "text-foreground" : "text-muted-foreground"}`, children: s }),
        i < total - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hairline-v h-4 ml-3" })
      ] }, s)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-surface-3 relative mb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { animate: {
        width: `${pct}%`
      }, transition: {
        duration: 0.6,
        ease
      }, className: "absolute inset-y-0 left-0 bg-accent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl", children: STEPS[step] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground text-sm max-w-xs", children: "Every detail matters. Please fill in the details accurately for our casting review." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7 lg:col-start-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
            opacity: 0,
            y: 12
          }, animate: {
            opacity: 1,
            y: 0
          }, exit: {
            opacity: 0,
            y: -12
          }, transition: {
            duration: 0.4,
            ease
          }, className: "space-y-7", children: [
            step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "editorial-label text-accent", children: "Section 1: Applicant Information" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "First Name", value: form.firstName, disabled: true, className: "opacity-70" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Last Name", value: form.lastName, disabled: true, className: "opacity-70" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email Address", type: "email", value: form.email, disabled: true, className: "opacity-70" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone Number", value: form.phone, onChange: (e) => setForm({
                ...form,
                phone: e.target.value
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "editorial-label text-accent pt-4 border-t border-border-subtle", children: "Section 2: Physical Details" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Age", type: "number", value: form.age, onChange: (e) => setForm({
                  ...form,
                  age: e.target.value
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Height", value: form.height, onChange: (e) => setForm({
                  ...form,
                  height: e.target.value
                }), placeholder: "175 cm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Weight", value: form.weight, onChange: (e) => setForm({
                  ...form,
                  weight: e.target.value
                }), placeholder: "60 kg" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Bust", value: form.bust, onChange: (e) => setForm({
                  ...form,
                  bust: e.target.value
                }), placeholder: "90 cm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Waist", value: form.waist, onChange: (e) => setForm({
                  ...form,
                  waist: e.target.value
                }), placeholder: "64 cm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Hips", value: form.hips, onChange: (e) => setForm({
                  ...form,
                  hips: e.target.value
                }), placeholder: "94 cm" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Eye Color", value: form.eyeColour, onChange: (e) => setForm({
                  ...form,
                  eyeColour: e.target.value
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Shoe Size", value: form.shoeSize, onChange: (e) => setForm({
                  ...form,
                  shoeSize: e.target.value
                }), placeholder: "EU 39" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Hair Color", value: form.hairColour, onChange: (e) => setForm({
                  ...form,
                  hairColour: e.target.value
                }) })
              ] })
            ] }),
            step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "editorial-label text-accent", children: "Section 3: Address Information" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Street Address", value: form.streetAddress, onChange: (e) => setForm({
                ...form,
                streetAddress: e.target.value
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "City", value: form.city, onChange: (e) => setForm({
                  ...form,
                  city: e.target.value
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "State / Province", value: form.stateProvince, onChange: (e) => setForm({
                  ...form,
                  stateProvince: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Zip / Postal Code", value: form.zipCode, onChange: (e) => setForm({
                  ...form,
                  zipCode: e.target.value
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Country", value: form.country, disabled: true, className: "opacity-70" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "editorial-label text-accent pt-4 border-t border-border-subtle", children: "Section 4: Model Experience" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: "Describe your modeling experience" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 4, value: form.experience, onChange: (e) => setForm({
                  ...form,
                  experience: e.target.value
                }), className: "mt-2 w-full bg-transparent border-b border-foreground/30 py-3 outline-none focus:border-accent transition-colors resize-none text-foreground bg-background" })
              ] })
            ] }),
            step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "editorial-label text-accent", children: "Section 5: Tell Us Your Story" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: "Share your biography and personal story" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 8, value: form.bio, onChange: (e) => setForm({
                  ...form,
                  bio: e.target.value
                }), className: "mt-2 w-full bg-transparent border-b border-foreground/30 py-3 outline-none focus:border-accent transition-colors resize-none text-foreground bg-background" })
              ] })
            ] }),
            step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "editorial-label text-accent", children: "Section 6: Social Media & Portfolio Links" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: socialLinks.map((link, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-[10px] text-muted-foreground", children: "Platform" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: link.platform, onChange: (e) => updateSocialLink(link.id, {
                      platform: e.target.value
                    }), className: "mt-2 w-full bg-transparent border-b border-foreground/30 py-3 outline-none focus:border-accent text-sm", children: SOCIAL_PLATFORMS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p, className: "bg-background text-foreground", children: p }, p)) })
                  ] }),
                  link.platform === "Other" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Custom Platform Name", value: link.customPlatform || "", onChange: (e) => updateSocialLink(link.id, {
                    customPlatform: e.target.value
                  }), placeholder: "e.g. TikTok" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Profile or Portfolio URL", value: link.url, onChange: (e) => updateSocialLink(link.id, {
                    url: e.target.value
                  }), placeholder: "https://" })
                ] }),
                link.platform === "Other" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Profile or Portfolio URL", value: link.url, onChange: (e) => updateSocialLink(link.id, {
                  url: e.target.value
                }), placeholder: "https://" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeSocialLink(link.id), className: "p-3 border border-border-subtle hover:text-accent hover:border-accent/40 transition-colors mb-[1px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }) })
              ] }, link.id)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: addSocialLink, className: "mt-4 inline-flex items-center gap-2 border border-dashed border-border-subtle px-4 py-2 text-xs uppercase tracking-wider hover:border-accent hover:text-accent transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                " Add Another Link"
              ] })
            ] }),
            step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "editorial-label text-accent", children: "Section 7: Media Uploads" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "editorial-label text-muted-foreground flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-3.5 h-3.5 text-accent" }),
                    " Photos (",
                    photos.length,
                    " / 5)"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Max 30MB each" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-5 gap-2", children: [
                  photos.map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] border border-border-subtle group overflow-hidden", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.preview, alt: "", className: "w-full h-full object-cover" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removePhoto(idx), className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
                  ] }, idx)),
                  photos.length < 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "border border-dashed border-foreground/20 hover:border-accent aspect-[3/4] flex flex-col items-center justify-center text-center cursor-pointer transition-colors", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-5 h-5 text-muted-foreground mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-wider", children: "Upload" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", multiple: true, onChange: handlePhotoUpload, className: "hidden" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4 border-t border-border-subtle", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "editorial-label text-muted-foreground flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-3.5 h-3.5 text-accent" }),
                    " Video (1 Required)"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Max 1 minute duration" })
                ] }),
                video ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-4 flex items-center justify-between bg-surface", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-5 h-5 text-accent" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono max-w-xs truncate", children: video.name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setVideo(null), className: "p-1 text-muted-foreground hover:text-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "border border-dashed border-foreground/20 hover:border-accent p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-surface/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-6 h-6 text-muted-foreground mb-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label", children: "Upload Introduction Video" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-2", children: "MP4/MOV · Max 1 minute duration" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "video/*", onChange: handleVideoUpload, className: "hidden" })
                ] })
              ] })
            ] }),
            step === 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "editorial-label text-accent", children: "Section 8: Application Review" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-6 bg-surface space-y-6 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase text-muted-foreground tracking-wider font-semibold", children: "Applicant" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 font-serif text-base", children: [
                      form.firstName,
                      " ",
                      form.lastName
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: form.email }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: form.phone })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase text-muted-foreground tracking-wider font-semibold", children: "Physical Details" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs mt-1 text-muted-foreground", children: [
                      "Height: ",
                      form.height,
                      " | Weight: ",
                      form.weight
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                      "Measurements: ",
                      form.bust,
                      " - ",
                      form.waist,
                      " - ",
                      form.hips
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                      "Hair: ",
                      form.hairColour,
                      " | Eyes: ",
                      form.eyeColour
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border-subtle/50 pt-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase text-muted-foreground tracking-wider font-semibold", children: "Address Details" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
                    form.streetAddress,
                    ", ",
                    form.city
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                    form.stateProvince,
                    ", ",
                    form.zipCode,
                    " - ",
                    form.country
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border-subtle/50 pt-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase text-muted-foreground tracking-wider font-semibold", children: "Modeling Experience" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: form.experience })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border-subtle/50 pt-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase text-muted-foreground tracking-wider font-semibold", children: "Personal Story" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed truncate", children: form.bio })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border-subtle/50 pt-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase text-muted-foreground tracking-wider font-semibold", children: [
                    "Social Links (",
                    socialLinks.length,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: socialLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] bg-surface-2 px-2 py-0.5 border border-border-subtle rounded font-mono", children: [
                    l.platform,
                    ": ",
                    l.url || "Customized"
                  ] }, l.id)) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border-subtle/50 pt-4 flex gap-4 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-emerald-400" }),
                    " ",
                    photos.length,
                    " Photos Attached"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-emerald-400" }),
                    " ",
                    video ? "1 Video Attached" : "No Video"
                  ] })
                ] })
              ] })
            ] })
          ] }, step) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setStep((s) => Math.max(0, s - 1)), disabled: step === 0, className: "editorial-label text-muted-foreground hover:text-foreground disabled:opacity-30", children: "← Back" }),
            step < total - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setStep((s) => s + 1), className: "bg-foreground text-background px-8 py-3.5 editorial-label hover:bg-accent hover:text-white transition-colors", children: "Continue →" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowConfirm(true), className: "bg-accent text-white px-8 py-3.5 editorial-label hover:bg-foreground hover:text-background transition-colors", children: "Submit Application" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      scale: 0.95,
      opacity: 0
    }, animate: {
      scale: 1,
      opacity: 1
    }, exit: {
      scale: 0.95,
      opacity: 0
    }, className: "bg-background border border-border-subtle p-8 max-w-md w-full mx-4 shadow-2xl space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl", children: "Confirm Submission" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Are you sure you want to submit your application? Once submitted, your details will be sent directly to the contest managers." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowConfirm(false), disabled: isSubmitting, className: "px-5 py-2.5 border border-border-subtle text-[10px] uppercase tracking-wider hover:bg-surface-2 transition-colors disabled:opacity-50", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: executeSubmit, disabled: isSubmitting, className: "px-5 py-2.5 bg-accent text-white text-[10px] uppercase tracking-wider hover:bg-accent/90 transition-colors flex items-center gap-1.5 disabled:opacity-50", children: isSubmitting ? "Submitting..." : "Yes, Submit" })
      ] })
    ] }) }) })
  ] });
}
function Field({
  label,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-[10px] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ...props, className: "mt-2 w-full bg-transparent border-b border-foreground/30 py-2.5 outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/50 text-sm text-foreground bg-background" })
  ] });
}
export {
  ScopedApply as component
};
