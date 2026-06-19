import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminCard, StatusChip, AdminButton } from "@/components/layout/AdminLayout";
import { useAppStore } from "@/lib/portal-state";
import { useState, useEffect, useMemo } from "react";
import { CheckCircle2, AlertCircle, Globe } from "lucide-react";

export const Route = createFileRoute("/admin/photographers")({
  head: () => ({ meta: [{ title: "Photographers — Admin" }] }),
  component: PhotographersAdmin,
});

type PhotographerRecord = {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  assignedCountries: string[];
  avatar?: string;
  email?: string;
  phone?: string;
  createdDate: string;
  updatedDate: string;
};

function PhotographersAdmin() {
  const { state } = useAppStore();
  const [photographers, setPhotographers] = useState<PhotographerRecord[]>([]);
  const [editingCountriesId, setEditingCountriesId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const contestCountries = useMemo(() => {
    const countries = state.contests.map(c => c.country);
    return Array.from(new Set(countries)).filter(Boolean).sort();
  }, [state.contests]);

  const editingPhotographer = useMemo(() => {
    return photographers.find(p => p.id === editingCountriesId) || null;
  }, [photographers, editingCountriesId]);

  const filteredCountries = useMemo(() => {
    return contestCountries.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [contestCountries, searchQuery]);

  // Reset search query when editing id changes
  useEffect(() => {
    setSearchQuery("");
  }, [editingCountriesId]);

  // Sync / Load photographers from local storage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("reevibes:photographers");
      if (raw) {
        setPhotographers(JSON.parse(raw));
      } else {
        // Seed initial photographers from state.users
        const seedList: PhotographerRecord[] = state.users
          .filter(u => u.roles.includes("Photographer"))
          .map(u => ({
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            status: "Active",
            assignedCountries: [u.country],
            avatar: u.avatar,
            email: u.email,
            phone: u.phone,
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString(),
          }));
        window.localStorage.setItem("reevibes:photographers", JSON.stringify(seedList));
        setPhotographers(seedList);
      }
    } catch (e) {
      console.error(e);
    }
  }, [state.users]);

  const saveList = (newList: PhotographerRecord[]) => {
    setPhotographers(newList);
    try {
      window.localStorage.setItem("reevibes:photographers", JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStatus = (id: string) => {
    const next = photographers.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: p.status === "Active" ? "Inactive" as const : "Active" as const,
          updatedDate: new Date().toISOString()
        };
      }
      return p;
    });
    saveList(next);
  };

  const handleCountryToggle = (id: string, country: string) => {
    const next = photographers.map(p => {
      if (p.id === id) {
        const list = p.assignedCountries.includes(country)
          ? p.assignedCountries.filter(c => c !== country)
          : [...p.assignedCountries, country];
        return {
          ...p,
          assignedCountries: list,
          updatedDate: new Date().toISOString()
        };
      }
      return p;
    });
    saveList(next);
  };

  const handleResetCountries = (id: string) => {
    const next = photographers.map(p => {
      if (p.id === id) {
        return {
          ...p,
          assignedCountries: [],
          updatedDate: new Date().toISOString()
        };
      }
      return p;
    });
    saveList(next);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!editingPhotographer) return;

    // Auto-select match: check if typed letters match any contest country exactly (case-insensitive)
    const exactMatch = contestCountries.find(c => c.toLowerCase() === val.trim().toLowerCase());
    if (exactMatch && !editingPhotographer.assignedCountries.includes(exactMatch)) {
      handleCountryToggle(editingPhotographer.id, exactMatch);
    }
  };

  return (
    <AdminLayout
      eyebrow="Module · Creative Network"
      title="Photographers"
    >
      <AdminCard>
        <div className="editorial-label text-muted-foreground mb-6">
          Auto-synced from <strong className="text-foreground">Manage Users</strong> · Set active statuses and assign countries for the editorial gallery.
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-left editorial-label text-muted-foreground border-b border-border-subtle">
                <th className="py-3 pr-3">Photographer</th>
                <th className="py-3 pr-3">Email / Phone</th>
                <th className="py-3 pr-3">Assigned Countries</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 pr-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {photographers.map(p => (
                <tr key={p.id} className="border-b border-border-subtle hover:bg-surface-2 transition-colors">
                  <td className="py-4 pr-3">
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} alt="" className="w-10 h-10 rounded-full object-cover bg-surface-3" />
                      <div>
                        <div className="font-semibold text-foreground">{p.name}</div>
                        <div className="editorial-label text-muted-foreground text-[10px] font-mono">{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-3">
                    <div className="text-xs text-muted-foreground">{p.email || "—"}</div>
                    <div className="text-[10px] text-muted-foreground/60 font-mono mt-0.5">{p.phone || "—"}</div>
                  </td>
                  <td className="py-4 pr-3">
                    <div className="flex flex-wrap gap-1.5 max-w-[320px]">
                      {p.assignedCountries.length === 0 ? (
                        <span className="text-xs text-rose-400 italic">No countries assigned</span>
                      ) : (
                        p.assignedCountries.map(c => (
                          <span key={c} className="bg-surface border border-border-subtle px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded text-muted-foreground">
                            {c}
                          </span>
                        ))
                      )}
                      <button
                        onClick={() => setEditingCountriesId(p.id)}
                        className="text-[10px] uppercase font-mono text-accent hover:underline ml-1 self-center"
                      >
                        [Edit]
                      </button>
                    </div>
                  </td>
                  <td className="py-4 pr-3">
                    <StatusChip
                      status={p.status}
                      tone={p.status === "Active" ? "success" : "danger"}
                    />
                  </td>
                  <td className="py-4 pr-3 text-right">
                    <AdminButton
                      variant={p.status === "Active" ? "outline" : "default"}
                      onClick={() => toggleStatus(p.id)}
                      className="text-[10px] px-3.5 py-1.5"
                    >
                      {p.status === "Active" ? "Deactivate" : "Activate"}
                    </AdminButton>
                  </td>
                </tr>
              ))}
              {photographers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No photographers yet. Assign the Photographer role from Manage Users.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Edit Countries Modal Overlay */}
      {editingPhotographer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border-subtle w-full max-w-md rounded shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
              <div className="flex items-center gap-3">
                <img src={editingPhotographer.avatar} alt="" className="w-10 h-10 rounded-full object-cover bg-surface-3" />
                <div>
                  <h3 className="font-serif text-lg font-bold leading-none">{editingPhotographer.name}</h3>
                  <span className="text-[10px] text-muted-foreground font-mono mt-1 block">Assign Countries</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => handleResetCountries(editingPhotographer.id)}
                  className="text-xs text-rose-500 hover:text-rose-400 font-bold uppercase tracking-wider transition-colors"
                >
                  Reset
                </button>
                <span className="text-zinc-600">|</span>
                <button 
                  onClick={() => setEditingCountriesId(null)}
                  className="text-xs text-muted-foreground hover:text-foreground font-mono"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Search Input Box */}
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filteredCountries.length > 0) {
                    handleCountryToggle(editingPhotographer.id, filteredCountries[0]);
                    setSearchQuery("");
                  }
                }}
                placeholder="Type country name to search & select..."
                className="w-full bg-surface border border-border-subtle px-3 py-2 text-sm rounded outline-none focus:border-accent text-foreground font-sans placeholder:text-muted-foreground/50"
                autoFocus
              />
            </div>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredCountries.map(c => {
                const checked = editingPhotographer.assignedCountries.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => handleCountryToggle(editingPhotographer.id, c)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                      checked 
                        ? "bg-accent/15 border-accent text-accent" 
                        : "bg-surface hover:bg-surface-2 border-border-subtle text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="text-sm font-semibold">{c}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      checked ? "border-accent bg-accent" : "border-zinc-400 dark:border-zinc-600"
                    }`}>
                      {checked && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
              {filteredCountries.length === 0 && (
                <div className="text-center py-6 text-xs text-muted-foreground italic">
                  No matching countries found.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border-subtle">
              <button
                onClick={() => setEditingCountriesId(null)}
                className="bg-accent hover:bg-accent/90 text-white font-semibold text-xs uppercase tracking-wider px-6 py-2.5 rounded transition-colors shadow-md w-full"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
