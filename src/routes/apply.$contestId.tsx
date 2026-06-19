import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check, Trash2, Plus, AlertCircle, Film, Image as ImageIcon } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { FadeUp, ease } from "@/components/motion/Reveal";
import { useAppStore } from "@/lib/portal-state";

export const Route = createFileRoute("/apply/$contestId")({
  head: () => ({ meta: [{ title: "Apply — ReeVibes" }] }),
  component: ScopedApply,
});

const STEPS = [
  "Identity & Physical",
  "Address & Experience",
  "Your Story",
  "Social Links",
  "Media Uploads",
  "Review & Submit"
] as const;

const SOCIAL_PLATFORMS = ["Instagram", "Facebook", "Twitter/X", "Pinterest", "Portfolio", "Other"];

function ScopedApply() {
  const { contestId } = useParams({ from: "/apply/$contestId" });
  const { state, submitApplication } = useAppStore();
  const contest = state.contests.find(c => c.id === contestId);
  const navigate = useNavigate();

  // Form State
  const [form, setForm] = useState({
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

  // Dynamic Social Links
  const [socialLinks, setSocialLinks] = useState<{ id: string; platform: string; customPlatform?: string; url: string }[]>([
    { id: "1", platform: "Instagram", url: "https://instagram.com/model_anais" },
    { id: "2", platform: "Portfolio", url: "https://portfolio.anais.com" }
  ]);

  // Upload States
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [video, setVideo] = useState<{ file: File; name: string } | null>(null);

  // Flow States
  const [step, setStep] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const total = STEPS.length;
  const pct = ((step + 1) / total) * 100;

  useEffect(() => {
    const user = state.user;
    if (!user) {
      sessionStorage.setItem("apply:redirectContestId", contestId);
      navigate({ to: "/login" });
    } else {
      let calculatedAge = "24";
      if (user.dob) {
        const birthYear = new Date(user.dob).getFullYear();
        if (!isNaN(birthYear)) {
          calculatedAge = String(2026 - birthYear);
        }
      }

      setForm(prev => ({
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
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-center">
          <div>
            <p className="editorial-label text-accent">Unavailable</p>
            <h1 className="mt-3 font-serif text-4xl">Applications closed for this contest.</h1>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // File Handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      alert("You can upload a maximum of 5 photos.");
      return;
    }

    const invalidFile = files.find(f => f.size > 30 * 1024 * 1024);
    if (invalidFile) {
      alert("Each photo must be smaller than 30 MB.");
      return;
    }

    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert("Video file is too large.");
      return;
    }

    // Validate video duration
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoElement.src);
      if (videoElement.duration > 60) {
        alert("The video duration cannot exceed 1 minute.");
      } else {
        setVideo({ file, name: file.name });
      }
    };
    videoElement.src = URL.createObjectURL(file);
  };

  // Social link helpers
  const addSocialLink = () => {
    setSocialLinks(prev => [
      ...prev,
      { id: String(Date.now()), platform: "Instagram", url: "" }
    ]);
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(prev => prev.filter(l => l.id !== id));
  };

  const updateSocialLink = (id: string, patch: Partial<(typeof socialLinks)[0]>) => {
    setSocialLinks(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
  };

  // Submission handler
  const executeSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Convert photos to base64
      const base64Photos: string[] = [];
      for (const p of photos) {
        const reader = new FileReader();
        const promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
        });
        reader.readAsDataURL(p.file);
        base64Photos.push(await promise);
      }

      // Convert video to base64
      let base64Video = "";
      if (video) {
        const reader = new FileReader();
        const promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
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
        socialLinks: socialLinks.map(l => ({
          platform: l.platform === "Other" ? (l.customPlatform || "Other") : l.platform,
          url: l.url
        })),
        photos: {
          portrait: base64Photos[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=400&q=80",
          fullBody: base64Photos[1] || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&h=400&q=80",
          sideProfile: base64Photos[2] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=400&q=80",
          candid: base64Photos[3] || "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=300&h=400&q=80",
          additional: base64Photos.slice(4),
        },
        videos: {
          intro: base64Video || "",
          additional: []
        },
        numPhotos: photos.length || 4,
        numVideos: video ? 1 : 0,
      });

      setShowConfirm(false);
      navigate({ to: "/account/applications" });
    } catch (e) {
      console.error(e);
      alert("Error submitting application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <header className="px-6 lg:px-16 pt-24 pb-10 border-b border-border-subtle">
        <FadeUp><p className="editorial-eyebrow text-accent">Apply · {contest.country} {contest.year}</p></FadeUp>
        <FadeUp delay={0.1}><h1 className="mt-4 font-serif text-5xl lg:text-7xl">Become part of the story.</h1></FadeUp>
      </header>

      <section className="px-6 lg:px-16 py-12">
        {/* Step Indicator */}
        <div className="flex items-center gap-6 mb-10 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3 shrink-0">
              <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs ${i <= step ? "bg-accent border-accent text-white" : "border-foreground/30 text-muted-foreground"}`}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`editorial-label ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              {i < total - 1 && <div className="hairline-v h-4 ml-3" />}
            </div>
          ))}
        </div>

        <div className="h-px bg-surface-3 relative mb-12">
          <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease }} className="absolute inset-y-0 left-0 bg-accent" />
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <h2 className="font-serif text-3xl">{STEPS[step]}</h2>
            <p className="mt-3 text-muted-foreground text-sm max-w-xs">
              Every detail matters. Please fill in the details accurately for our casting review.
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease }} className="space-y-7">
                
                {/* STEP 0: Identity & Physical Details */}
                {step === 0 && (
                  <div className="space-y-6">
                    <h3 className="editorial-label text-accent">Section 1: Applicant Information</h3>
                    <div className="grid grid-cols-2 gap-5">
                      <Field label="First Name" value={form.firstName} disabled className="opacity-70" />
                      <Field label="Last Name" value={form.lastName} disabled className="opacity-70" />
                    </div>
                    <Field label="Email Address" type="email" value={form.email} disabled className="opacity-70" />
                    <Field label="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

                    <h3 className="editorial-label text-accent pt-4 border-t border-border-subtle">Section 2: Physical Details</h3>
                    <div className="grid grid-cols-3 gap-5">
                      <Field label="Age" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
                      <Field label="Height" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} placeholder="175 cm" />
                      <Field label="Weight" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="60 kg" />
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                      <Field label="Bust" value={form.bust} onChange={e => setForm({ ...form, bust: e.target.value })} placeholder="90 cm" />
                      <Field label="Waist" value={form.waist} onChange={e => setForm({ ...form, waist: e.target.value })} placeholder="64 cm" />
                      <Field label="Hips" value={form.hips} onChange={e => setForm({ ...form, hips: e.target.value })} placeholder="94 cm" />
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                      <Field label="Eye Color" value={form.eyeColour} onChange={e => setForm({ ...form, eyeColour: e.target.value })} />
                      <Field label="Shoe Size" value={form.shoeSize} onChange={e => setForm({ ...form, shoeSize: e.target.value })} placeholder="EU 39" />
                      <Field label="Hair Color" value={form.hairColour} onChange={e => setForm({ ...form, hairColour: e.target.value })} />
                    </div>
                  </div>
                )}

                {/* STEP 1: Address & Model Experience */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="editorial-label text-accent">Section 3: Address Information</h3>
                    <Field label="Street Address" value={form.streetAddress} onChange={e => setForm({ ...form, streetAddress: e.target.value })} />
                    <div className="grid grid-cols-2 gap-5">
                      <Field label="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                      <Field label="State / Province" value={form.stateProvince} onChange={e => setForm({ ...form, stateProvince: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <Field label="Zip / Postal Code" value={form.zipCode} onChange={e => setForm({ ...form, zipCode: e.target.value })} />
                      <Field label="Country" value={form.country} disabled className="opacity-70" />
                    </div>

                    <h3 className="editorial-label text-accent pt-4 border-t border-border-subtle">Section 4: Model Experience</h3>
                    <label className="block">
                      <span className="editorial-label text-muted-foreground">Describe your modeling experience</span>
                      <textarea rows={4} value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="mt-2 w-full bg-transparent border-b border-foreground/30 py-3 outline-none focus:border-accent transition-colors resize-none text-foreground bg-background" />
                    </label>
                  </div>
                )}

                {/* STEP 2: Story */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="editorial-label text-accent">Section 5: Tell Us Your Story</h3>
                    <label className="block">
                      <span className="editorial-label text-muted-foreground">Share your biography and personal story</span>
                      <textarea rows={8} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="mt-2 w-full bg-transparent border-b border-foreground/30 py-3 outline-none focus:border-accent transition-colors resize-none text-foreground bg-background" />
                    </label>
                  </div>
                )}

                {/* STEP 3: Social Media & Portfolio Links */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="editorial-label text-accent">Section 6: Social Media & Portfolio Links</h3>
                    <div className="space-y-4">
                      {socialLinks.map((link, index) => (
                        <div key={link.id} className="flex gap-3 items-end">
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <label className="block">
                              <span className="editorial-label text-[10px] text-muted-foreground">Platform</span>
                              <select
                                value={link.platform}
                                onChange={e => updateSocialLink(link.id, { platform: e.target.value })}
                                className="mt-2 w-full bg-transparent border-b border-foreground/30 py-3 outline-none focus:border-accent text-sm"
                              >
                                {SOCIAL_PLATFORMS.map(p => <option key={p} value={p} className="bg-background text-foreground">{p}</option>)}
                              </select>
                            </label>

                            {link.platform === "Other" ? (
                              <Field
                                label="Custom Platform Name"
                                value={link.customPlatform || ""}
                                onChange={e => updateSocialLink(link.id, { customPlatform: e.target.value })}
                                placeholder="e.g. TikTok"
                              />
                            ) : (
                              <Field
                                label="Profile or Portfolio URL"
                                value={link.url}
                                onChange={e => updateSocialLink(link.id, { url: e.target.value })}
                                placeholder="https://"
                              />
                            )}
                          </div>

                          {link.platform === "Other" && (
                            <div className="flex-1 block">
                              <Field
                                label="Profile or Portfolio URL"
                                value={link.url}
                                onChange={e => updateSocialLink(link.id, { url: e.target.value })}
                                placeholder="https://"
                              />
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => removeSocialLink(link.id)}
                            className="p-3 border border-border-subtle hover:text-accent hover:border-accent/40 transition-colors mb-[1px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addSocialLink}
                      className="mt-4 inline-flex items-center gap-2 border border-dashed border-border-subtle px-4 py-2 text-xs uppercase tracking-wider hover:border-accent hover:text-accent transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Another Link
                    </button>
                  </div>
                )}

                {/* STEP 4: Media Uploads */}
                {step === 4 && (
                  <div className="space-y-8">
                    <h3 className="editorial-label text-accent">Section 7: Media Uploads</h3>
                    
                    {/* Photo Upload */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="editorial-label text-muted-foreground flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5 text-accent" /> Photos ({photos.length} / 5)</span>
                        <span className="text-[10px] text-muted-foreground">Max 30MB each</span>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-2">
                        {photos.map((p, idx) => (
                          <div key={idx} className="relative aspect-[3/4] border border-border-subtle group overflow-hidden">
                            <img src={p.preview} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {photos.length < 5 && (
                          <label className="border border-dashed border-foreground/20 hover:border-accent aspect-[3/4] flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
                            <Upload className="w-5 h-5 text-muted-foreground mb-2" />
                            <span className="text-[9px] uppercase tracking-wider">Upload</span>
                            <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Video Upload */}
                    <div className="space-y-4 pt-4 border-t border-border-subtle">
                      <div className="flex items-center justify-between">
                        <span className="editorial-label text-muted-foreground flex items-center gap-1.5"><Film className="w-3.5 h-3.5 text-accent" /> Video (1 Required)</span>
                        <span className="text-[10px] text-muted-foreground">Max 1 minute duration</span>
                      </div>

                      {video ? (
                        <div className="border border-border-subtle p-4 flex items-center justify-between bg-surface">
                          <div className="flex items-center gap-3">
                            <Film className="w-5 h-5 text-accent" />
                            <span className="text-xs font-mono max-w-xs truncate">{video.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setVideo(null)}
                            className="p-1 text-muted-foreground hover:text-accent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="border border-dashed border-foreground/20 hover:border-accent p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-surface/50">
                          <Upload className="w-6 h-6 text-muted-foreground mb-3" />
                          <div className="editorial-label">Upload Introduction Video</div>
                          <div className="text-[10px] text-muted-foreground mt-2">MP4/MOV · Max 1 minute duration</div>
                          <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 5: Review & Submit */}
                {step === 5 && (
                  <div className="space-y-6">
                    <h3 className="editorial-label text-accent">Section 8: Application Review</h3>
                    <div className="border border-border-subtle p-6 bg-surface space-y-6 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Applicant</div>
                          <div className="mt-1 font-serif text-base">{form.firstName} {form.lastName}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{form.email}</div>
                          <div className="text-xs text-muted-foreground">{form.phone}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Physical Details</div>
                          <div className="text-xs mt-1 text-muted-foreground">Height: {form.height} | Weight: {form.weight}</div>
                          <div className="text-xs text-muted-foreground">Measurements: {form.bust} - {form.waist} - {form.hips}</div>
                          <div className="text-xs text-muted-foreground">Hair: {form.hairColour} | Eyes: {form.eyeColour}</div>
                        </div>
                      </div>

                      <div className="border-t border-border-subtle/50 pt-4">
                        <div className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Address Details</div>
                        <div className="text-xs text-muted-foreground mt-1">{form.streetAddress}, {form.city}</div>
                        <div className="text-xs text-muted-foreground">{form.stateProvince}, {form.zipCode} - {form.country}</div>
                      </div>

                      <div className="border-t border-border-subtle/50 pt-4">
                        <div className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Modeling Experience</div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{form.experience}</p>
                      </div>

                      <div className="border-t border-border-subtle/50 pt-4">
                        <div className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Personal Story</div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed truncate">{form.bio}</p>
                      </div>

                      <div className="border-t border-border-subtle/50 pt-4">
                        <div className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Social Links ({socialLinks.length})</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {socialLinks.map(l => (
                            <span key={l.id} className="text-[10px] bg-surface-2 px-2 py-0.5 border border-border-subtle rounded font-mono">
                              {l.platform}: {l.url || "Customized"}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-border-subtle/50 pt-4 flex gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> {photos.length} Photos Attached</div>
                        <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> {video ? "1 Video Attached" : "No Video"}</div>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Wizard Navigation Footer */}
            <div className="mt-12 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="editorial-label text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                ← Back
              </button>
              {step < total - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="bg-foreground text-background px-8 py-3.5 editorial-label hover:bg-accent hover:text-white transition-colors"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="bg-accent text-white px-8 py-3.5 editorial-label hover:bg-foreground hover:text-background transition-colors"
                >
                  Submit Application
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Dialog Popup */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background border border-border-subtle p-8 max-w-md w-full mx-4 shadow-2xl space-y-6"
            >
              <h3 className="font-serif text-2xl">Confirm Submission</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to submit your application? Once submitted, your details will be sent directly to the contest managers.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 border border-border-subtle text-[10px] uppercase tracking-wider hover:bg-surface-2 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-accent text-white text-[10px] uppercase tracking-wider hover:bg-accent/90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Yes, Submit"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PublicLayout>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="editorial-label text-[10px] text-muted-foreground">{label}</span>
      <input {...props} className="mt-2 w-full bg-transparent border-b border-foreground/30 py-2.5 outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/50 text-sm text-foreground bg-background" />
    </label>
  );
}
