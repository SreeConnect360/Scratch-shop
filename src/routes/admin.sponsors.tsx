import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Pencil, Plus, Trash2, Upload, X, ExternalLink, Check, ChevronDown } from "lucide-react";
import { AdminLayout, AdminCard, AdminButton, StatusChip } from "@/components/layout/AdminLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const Route = createFileRoute("/admin/sponsors")({
  head: () => ({ meta: [{ title: "Sponsors — Admin" }] }),
  component: SponsorsPage,
});

/* ───────── Domain ───────── */
const PRESET_TYPES = [
  "Fashion", "Beauty", "Jewelry", "Food",
  "Lifestyle", "Photography", "Ecommerce", "Luxury Brand",
] as const;

type Sponsor = {
  id: string;
  name: string;
  type: string;
  url: string;
  countries: string[];
  logo?: string;        // dataURL, optional
  logoZoom: number;     // 0.4 – 2
  logoX: number;        // -50 – 50 (%)
  logoY: number;        // -50 – 50 (%)
};

const emptyDraft = (): Sponsor => ({
  id: `s-${Date.now()}`, name: "", type: "", url: "", countries: [], logoZoom: 1, logoX: 0, logoY: 0,
});

/* ───────── Page ───────── */
function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [openCountries, setOpenCountries] = useState<string[]>(["Global"]);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Fetch sponsors
    fetch("/api/sponsors?action=get-sponsors")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSponsors(data);
      })
      .catch(err => console.error("Error fetching sponsors:", err));

    // Fetch open countries
    fetch("/api/sponsors?action=get-open-countries")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.countries)) {
          const list = ["Global", ...data.countries.filter((c: string) => c !== "Global")];
          setOpenCountries(list);
        }
      })
      .catch(err => console.error("Error fetching open countries:", err));
  }, []);

  const openCreate = () => { setEditing(emptyDraft()); setOpen(true); };
  const openEdit = (s: Sponsor) => { setEditing({ ...s }); setOpen(true); };

  const remove = (id: string) => {
    fetch("/api/sponsors?action=delete-sponsor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSponsors(prev => prev.filter(s => s.id !== id));
        }
      })
      .catch(err => console.error("Error deleting sponsor:", err));
  };

  const save = (s: Sponsor) => {
    fetch("/api/sponsors?action=save-sponsor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSponsors(prev => prev.some(p => p.id === s.id)
            ? prev.map(p => p.id === s.id ? s : p)
            : [...prev, s]);
          setOpen(false);
        }
      })
      .catch(err => console.error("Error saving sponsor:", err));
  };

  return (
    <AdminLayout
      eyebrow="Module · Brand Partnerships"
      title="Sponsors"
      actions={
        <AdminButton variant="accent" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1.5 inline" />Add Sponsor
        </AdminButton>
      }
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sponsors.map(s => (
          <SponsorCard key={s.id} s={s} onEdit={() => openEdit(s)} onDelete={() => remove(s.id)} />
        ))}
        <button
          onClick={openCreate}
          className="rounded-lg border border-dashed border-border-subtle hover:border-accent transition-colors flex flex-col items-center justify-center min-h-[320px] text-center px-6"
        >
          <Plus className="w-5 h-5 text-muted-foreground mb-3" />
          <div className="editorial-label">Add New Sponsor</div>
          <div className="text-xs text-muted-foreground mt-2">Logo · Type · Countries</div>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 bg-background border-border-subtle overflow-hidden">
          <DialogHeader className="px-8 pt-7 pb-4 border-b border-border-subtle">
            <div className="editorial-label text-muted-foreground">Brand Partnership</div>
            <DialogTitle className="font-serif text-2xl tracking-tight">
              {sponsors.some(p => editing && p.id === editing.id) ? "Edit Sponsor" : "Add Sponsor"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <SponsorForm
              key={editing.id}
              initial={editing}
              openCountries={openCountries}
              onCancel={() => setOpen(false)}
              onSave={save}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

/* ───────── Card ───────── */
function SponsorCard({ s, onEdit, onDelete }: { s: Sponsor; onEdit: () => void; onDelete: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <AdminCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <StatusChip status={s.type || "Unlabeled"} tone="accent" />
          <div className="flex items-center gap-1">
            <button onClick={onEdit} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
            <button onClick={onDelete} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        <LogoFrame logo={s.logo} zoom={s.logoZoom} x={s.logoX} y={s.logoY} placeholder={s.name} />

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-serif text-xl truncate">{s.name || "Untitled"}</div>
            <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-accent inline-flex items-center gap-1 mt-0.5 truncate max-w-full">
              <ExternalLink className="w-3 h-3 shrink-0" /> <span className="truncate">{s.url || "no url"}</span>
            </a>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {s.countries.length === 0 && <span className="text-[10px] text-muted-foreground">No countries assigned</span>}
          {s.countries.map(c => (
            <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] tracking-wide uppercase border border-border-subtle rounded-sm text-foreground/70">
              {c === "Global" && <Globe className="w-2.5 h-2.5" />}{c}
            </span>
          ))}
        </div>
      </AdminCard>
    </motion.div>
  );
}

/* ───────── 5:3 White Logo Preview Frame ───────── */
function LogoFrame({ logo, zoom, x, y, placeholder }: { logo?: string; zoom: number; x: number; y: number; placeholder?: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-md bg-white border border-border-subtle" style={{ aspectRatio: "5 / 3" }}>
      {logo ? (
        <img
          src={logo}
          alt=""
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
          style={{ transform: `translate(${x}%, ${y}%) scale(${zoom})`, transformOrigin: "center" }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center font-serif italic text-3xl text-neutral-400">
          {placeholder ? placeholder.split(" ").map(w => w[0]).slice(0,2).join("") : "Logo"}
        </div>
      )}
    </div>
  );
}

/* ───────── Form ───────── */
function SponsorForm({ initial, openCountries, onCancel, onSave }: { initial: Sponsor; openCountries: string[]; onCancel: () => void; onSave: (s: Sponsor) => void }) {
  const [draft, setDraft] = useState<Sponsor>(initial);
  const [otherType, setOtherType] = useState(
    !PRESET_TYPES.includes(initial.type as typeof PRESET_TYPES[number]) && initial.type ? initial.type : "",
  );
  const [useOther, setUseOther] = useState(!!otherType);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof Sponsor>(k: K, v: Sponsor[K]) => setDraft(d => ({ ...d, [k]: v }));

  const toggleCountry = (c: string) => {
    setDraft(d => ({
      ...d,
      countries: d.countries.includes(c) ? d.countries.filter(x => x !== c) : [...d.countries, c],
    }));
  };

  const onFile = (f?: File | null) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => update("logo", reader.result as string);
    reader.readAsDataURL(f);
  };

  const canSave = useMemo(() => {
    const t = useOther ? otherType.trim() : draft.type;
    return draft.name.trim() && t && draft.url.trim() && draft.countries.length > 0;
  }, [draft, useOther, otherType]);

  const submit = () => {
    const type = useOther ? otherType.trim() : draft.type;
    onSave({ ...draft, type });
  };

  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-0 max-h-[78vh] overflow-y-auto">
      {/* Left: fields */}
      <div className="p-8 space-y-6 border-r border-border-subtle">
        {/* Type */}
        <Field label="Sponsor Type">
          <Select
            value={useOther ? "__other__" : draft.type}
            onValueChange={(val) => {
              if (val === "__other__") {
                setUseOther(true);
                update("type", "");
              } else {
                setUseOther(false);
                update("type", val);
              }
            }}
          >
            <SelectTrigger className="w-full h-9 text-xs tracking-wide border-border-subtle bg-transparent">
              <SelectValue placeholder="Select sponsor type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border-subtle">
              {PRESET_TYPES.map((t) => (
                <SelectItem key={t} value={t} className="text-xs cursor-pointer">
                  {t}
                </SelectItem>
              ))}
              <SelectItem value="__other__" className="text-xs cursor-pointer">
                Others
              </SelectItem>
            </SelectContent>
          </Select>
          {useOther && (
            <Input
              value={otherType}
              onChange={(e) => setOtherType(e.target.value)}
              placeholder="e.g. Sustainable Fashion"
              className="mt-3"
            />
          )}
        </Field>

        {/* Name */}
        <Field label="Sponsor Name">
          <Input value={draft.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Dior" />
        </Field>

        {/* URL */}
        <Field label="Sponsor URL">
          <Input value={draft.url} onChange={(e) => update("url", e.target.value)} placeholder="https://www.dior.com" />
        </Field>

        {/* Countries */}
        <Field label="Country Assignment" hint="Select one, many, or Global">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-border-subtle bg-transparent px-3 py-2 text-xs shadow-sm ring-offset-background cursor-pointer hover:border-foreground/30 transition-colors"
              >
                <span className={draft.countries.length === 0 ? "text-muted-foreground" : "text-foreground"}>
                  {draft.countries.length === 0
                    ? "Select countries..."
                    : draft.countries.length === 1
                      ? draft.countries[0]
                      : `${draft.countries.length} countries selected`}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0 bg-popover border-border-subtle" align="start">
              <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
                {openCountries.map((c) => {
                  const active = draft.countries.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCountry(c)}
                      className={`flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-xs transition-colors cursor-pointer ${active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}`}
                    >
                      <span className="flex items-center gap-1.5">
                        {c === "Global" && <Globe className="w-3 h-3" />}
                        {c}
                      </span>
                      {active && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
              {draft.countries.length > 0 && (
                <div className="border-t border-border-subtle px-2.5 py-2">
                  <button
                    type="button"
                    onClick={() => update("countries", [])}
                    className="text-[10px] tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          {draft.countries.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {draft.countries.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] tracking-wide uppercase border border-border-subtle rounded-sm text-foreground/70"
                >
                  {c === "Global" && <Globe className="w-2.5 h-2.5" />}
                  {c}
                </span>
              ))}
            </div>
          )}
        </Field>
      </div>

      {/* Right: logo studio */}
      <div className="p-8 space-y-5 bg-surface-1/40">
        <div className="editorial-label text-muted-foreground">Logo Studio · 5:3 Preview</div>

        <LogoFrame logo={draft.logo} zoom={draft.logoZoom} x={draft.logoX} y={draft.logoY} placeholder={draft.name} />

        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs tracking-wide border border-border-subtle rounded-sm hover:border-accent transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> {draft.logo ? "Replace Logo" : "Upload Logo"}
          </button>
          {draft.logo && (
            <button
              type="button"
              onClick={() => update("logo", undefined)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs tracking-wide text-muted-foreground hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          )}
        </div>

        {draft.logo && (
          <div className="space-y-4 pt-2">
            <Slider label="Zoom" min={0.4} max={2} step={0.01} value={draft.logoZoom} onChange={(v) => update("logoZoom", v)} display={`${draft.logoZoom.toFixed(2)}×`} />
            <Slider label="Horizontal" min={-50} max={50} step={1} value={draft.logoX} onChange={(v) => update("logoX", v)} display={`${draft.logoX}%`} />
            <Slider label="Vertical" min={-50} max={50} step={1} value={draft.logoY} onChange={(v) => update("logoY", v)} display={`${draft.logoY}%`} />
            <button
              type="button"
              onClick={() => { update("logoZoom", 1); update("logoX", 0); update("logoY", 0); }}
              className="text-[11px] tracking-wide uppercase text-muted-foreground hover:text-foreground"
            >Reset positioning</button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="lg:col-span-2 flex items-center justify-end gap-3 px-8 py-5 border-t border-border-subtle bg-background">
        <button onClick={onCancel} className="px-4 py-2 text-xs tracking-wide text-muted-foreground hover:text-foreground">Cancel</button>
        <AdminButton variant="accent" onClick={submit} disabled={!canSave}>Save Sponsor</AdminButton>
      </div>
    </div>
  );
}

/* ───────── Small primitives ───────── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <Label className="editorial-label text-foreground/80">{label}</Label>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Slider({ label, min, max, step, value, onChange, display }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void; display: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="editorial-label text-foreground/70">{label}</span>
        <span className="text-[11px] text-muted-foreground tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-foreground"
      />
    </div>
  );
}
