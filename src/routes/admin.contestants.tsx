import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminLayout, AdminCard, AdminButton, StatusChip } from "@/components/layout/AdminLayout";
import { type ContestantApplication } from "@/lib/data";
import { useAppStore } from "@/lib/portal-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Eye, X, ChevronLeft, ChevronRight, Globe, Link as LinkIcon } from "lucide-react";

const STAGES = ["All","Applied","Approved","Casting","Judgement","Top16","Top10"] as const;

const COUNTRIES = [
  "All", "Adygea", "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica",
  "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Bermuda", "Bhutan", "Bolivia", "Bosnia-Herzegovina",
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde",
  "Catalonia", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Cook Islands",
  "Costa Rica", "Cote D'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "England", "Equatorial Guinea", "Eritrea", "Estonia",
  "Ethiopia", "European Union", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia",
  "Gabon", "Georgia", "Germany", "Ghana", "Gibrlatar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala",
  "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Iceland", "India", "Indonesia", "Iran",
  "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Liechtenstein", "Luxembourg",
  "Lybia", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Island",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco",
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Zealand",
  "Nicaragua", "Niger", "Nigeria", "Niue", "North Korea", "Northern Ireland", "Northern Mariana Islands", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Principality of Sealand", "Puerto Rico", "Qatar", "Republic of the Congo", "Romania", "Russia",
  "Rwanda", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Scotland", "Senegal", "Serbia",
  "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "Spain", "Sri Lanka", "St Vincent", "St. Helena", "St. Kitts and Nevis", "St. Lucia", "Sudan",
  "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
  "The Gambia", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "U.S. Virgin Islands", "Uganda", "Ukraine", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Virgin Islands", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"
];

export const Route = createFileRoute("/admin/contestants")({
  head: () => ({ meta: [{ title: "Manage Contestants — Admin" }] }),
  component: ContestantsAdminPage,
});

function ContestantsAdminPage() {
  const { state } = useAppStore();
  const applications = state.applications;
  const [selectedYear, setSelectedYear] = useState<number | "All">("All");
  const [filterCountry, setFilterCountry] = useState<string>("All");
  const [q, setQ] = useState("");
  const [viewing, setViewing] = useState<ContestantApplication | null>(null);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const list = useMemo(() => {
    return applications.filter(c => {
      if (selectedYear !== "All" && c.contestYear !== selectedYear) return false;
      if (filterCountry !== "All" && c.contestCountry !== filterCountry) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return c.fullName.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.contestantId.toLowerCase().includes(s) || c.country.toLowerCase().includes(s);
    });
  }, [applications, selectedYear, filterCountry, q]);

  return (
    <AdminLayout eyebrow="Module · Contestant Applications" title="Contestants Dashboard">
      <AdminCard>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-surface-2 px-3 py-2 border border-border-subtle min-w-72">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, ID, country or email…" className="bg-transparent outline-none text-sm flex-1" />
            </div>

            {/* Country wise filter */}
            <div className="flex items-center gap-2 border border-border-subtle bg-surface-2 px-3 py-1.5">
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={filterCountry}
                onChange={e => setFilterCountry(e.target.value)}
                className="bg-transparent text-xs outline-none cursor-pointer text-foreground bg-background"
              >
                {COUNTRIES.map(c => <option key={c} value={c} className="bg-background text-foreground">{c === "All" ? "All Countries" : c}</option>)}
              </select>
            </div>

            {/* Year filter dropdown */}
            <div className="flex items-center gap-2 border border-border-subtle bg-surface-2 px-3 py-1.5">
              <span className="text-xs text-muted-foreground">Year:</span>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value === "All" ? "All" : Number(e.target.value))}
                className="bg-transparent text-xs outline-none cursor-pointer text-foreground bg-background"
              >
                <option value="All" className="bg-background text-foreground">All Years</option>
                <option value="2026" className="bg-background text-foreground">2026</option>
                <option value="2025" className="bg-background text-foreground">2025</option>
                <option value="2024" className="bg-background text-foreground">2024</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="text-left editorial-label text-muted-foreground border-b border-border-subtle">
                <th className="py-3 pr-3">Year</th>
                <th className="py-3 pr-3">Contest Country</th>
                <th className="py-3 pr-3">Contestant ID</th>
                <th className="py-3 pr-3">Full Name</th>
                <th className="py-3 pr-3">Age</th>
                <th className="py-3 pr-3">Country</th>
                <th className="py-3 pr-3">Email</th>
                <th className="py-3 pr-3 text-center">Photos</th>
                <th className="py-3 pr-3 text-center">Videos</th>
                <th className="py-3 pr-3">Applied</th>
                <th className="py-3 pr-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map(c => (
                <tr key={c.contestantId} className="border-b border-border-subtle hover:bg-surface-2">
                  <td className="py-4 pr-3">{c.contestYear}</td>
                  <td className="py-4 pr-3">{c.contestCountry}</td>
                  <td className="py-4 pr-3 font-mono text-xs text-muted-foreground">{c.contestantId}</td>
                  <td className="py-4 pr-3">
                    <div className="flex items-center gap-3">
                      <img src={c.photos.portrait} alt="" className="w-9 h-12 object-cover" />
                      <div>{c.fullName}</div>
                    </div>
                  </td>
                  <td className="py-4 pr-3 text-muted-foreground">{c.age} yrs</td>
                  <td className="py-4 pr-3">{c.country}</td>
                  <td className="py-4 pr-3 text-muted-foreground">{c.email}</td>
                  <td className="py-4 pr-3 text-center">{c.numPhotos}</td>
                  <td className="py-4 pr-3 text-center">{c.numVideos}</td>
                  <td className="py-4 pr-3 text-muted-foreground">{c.applicationDate}</td>
                  <td className="py-4 pr-3 text-right">
                    <button onClick={() => setViewing(c)} title="View"
                      className="p-2 border border-border-subtle hover:border-foreground/40 text-foreground/70 hover:text-foreground transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={11} className="py-12 text-center text-muted-foreground">No applications match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Profile Dialog */}
      <Dialog open={!!viewing} onOpenChange={o => !o && setViewing(null)}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto bg-background border-border-subtle p-0">
          {viewing && (
            <ContestantProfile app={viewing} onOpenGallery={(images, index) => setLightbox({ images, index })} />
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button onClick={(e) => { e.stopPropagation(); setLightbox(null); }} className="absolute top-6 right-6 text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, index: (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length }); }}
            className="absolute left-6 text-white/70 hover:text-white p-3"><ChevronLeft className="w-7 h-7" /></button>
          <img src={lightbox.images[lightbox.index]} alt="" className="max-h-[88vh] max-w-[88vw] object-contain" onClick={e => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.images.length }); }}
            className="absolute right-6 text-white/70 hover:text-white p-3"><ChevronRight className="w-7 h-7" /></button>
          <div className="absolute bottom-6 left-0 right-0 text-center text-white/60 editorial-label text-xs">{lightbox.index + 1} / {lightbox.images.length}</div>
        </div>
      )}
    </AdminLayout>
  );
}

function ContestantProfile({ app, onOpenGallery }: { app: ContestantApplication; onOpenGallery: (images: string[], index: number) => void }) {
  const gallery = [app.photos.portrait, app.photos.fullBody, app.photos.sideProfile, app.photos.candid, ...app.photos.additional].filter(Boolean);
  return (
    <div>
      {/* Hero */}
      <div className="relative">
        <div className="aspect-[16/7] overflow-hidden bg-surface-2">
          <img src={app.photos.fullBody || app.photos.portrait} alt={app.fullName} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <div className="editorial-label text-accent mb-2">Contestant · {app.contestantId}</div>
          <DialogHeader>
            <DialogTitle className="font-serif text-4xl">{app.fullName}</DialogTitle>
            <DialogDescription>{app.contestCountry} Edition · Applied {app.applicationDate}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 mt-3">
            <StatusChip status={`Stage · ${app.currentStage}`} tone="accent" />
            <StatusChip status={app.status} tone={app.status === "Approved" ? "success" : "warn"} />
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-8 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <Section title="Applicant Information">
            <Grid items={[
              ["First Name", app.fullName.split(" ")[0]], ["Last Name", app.fullName.split(" ").slice(1).join(" ")],
              ["Age", `${app.age}`], ["Country", app.country], ["Email", app.email], ["Phone", app.phone],
            ]} />
          </Section>

          <Section title="Physical Details">
            <Grid items={[
              ["Height", app.height], ["Weight", app.weight], ["Bust", app.bust],
              ["Waist", app.waist], ["Hips", app.hips], ["Eye Colour", app.eyeColour],
              ["Hair Colour", app.hairColour], ["Shoe Size", app.shoeSize],
            ]} />
          </Section>

          <Section title="Address Information">
            <Grid items={[
              ["Street Address", app.streetAddress || "—"],
              ["City", app.city || "—"],
              ["State / Province", app.stateProvince || "—"],
              ["Zip / Postal Code", app.zipCode || "—"],
            ]} />
          </Section>

          <Section title="Model Experience Description">
            <p className="text-sm leading-relaxed text-foreground/80">{app.experience || "No modeling experience description provided."}</p>
          </Section>

          <Section title="Personal Story Description">
            <p className="text-sm leading-relaxed text-foreground/80">{app.biography || "No biography or personal story provided."}</p>
          </Section>

          <Section title="Social Media & Portfolio Links">
            <div className="space-y-2">
              {app.socialLinks && app.socialLinks.length > 0 ? (
                app.socialLinks.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm justify-between py-1 border-b border-border-subtle/50 last:border-0">
                    <span className="editorial-label text-accent flex items-center gap-1"><LinkIcon className="w-3 h-3" /> {link.platform}</span>
                    <a href={link.url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground underline truncate max-w-xs">{link.url}</a>
                  </div>
                ))
              ) : (
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {app.social.instagram && <span>Instagram: {app.social.instagram}</span>}
                  {app.social.tiktok && <span>· TikTok: {app.social.tiktok}</span>}
                </div>
              )}
            </div>
          </Section>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <Section title="Media · Photographs">
            <div className="grid grid-cols-2 gap-2">
              {gallery.map((src, i) => (
                <button key={i} onClick={() => onOpenGallery(gallery, i)}
                  className="aspect-[3/4] overflow-hidden bg-surface-2 group">
                  <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 editorial-label text-muted-foreground mt-3">
              <span>· Portrait</span><span>· Full Body</span>
              <span>· Side Profile</span><span>· Candid</span>
              <span>· Additional</span>
            </div>
          </Section>

          <Section title="Media · Videos">
            {app.videos && app.videos.intro && app.videos.intro.startsWith("data:video") ? (
              <video controls className="w-full aspect-video border border-border-subtle" src={app.videos.intro} />
            ) : (
              <div className="aspect-video bg-surface-2 border border-border-subtle flex items-center justify-center editorial-label text-muted-foreground text-center px-4">
                Introduction Video · Awaiting upload
              </div>
            )}
          </Section>

          <div className="flex flex-wrap gap-2">
            <AdminButton variant="accent">Approve Application</AdminButton>
            <AdminButton variant="outline">Hold</AdminButton>
            <AdminButton variant="ghost">Reject</AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="editorial-label text-accent mb-3">{title}</div>
      <div className="border border-border-subtle p-5 bg-surface">{children}</div>
    </div>
  );
}

function Grid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
      {items.map(([k, v]) => (
        <div key={k}>
          <div className="editorial-label text-muted-foreground">{k}</div>
          <div>{v}</div>
        </div>
      ))}
    </div>
  );
}
