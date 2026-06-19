import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminLayout, AdminCard, AdminButton, StatusChip } from "@/components/layout/AdminLayout";
import { ALL_ROLES, type PlatformUser, type Role, PRODUCTS } from "@/lib/data";
import { useAppStore } from "@/lib/portal-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Eye, Pencil, Trash2, Shield, Plus, ArrowUpDown } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Manage Users — Admin" }] }),
  component: UsersPage,
});

const ROLE_TONES: Record<Role, "neutral" | "accent" | "success" | "warn" | "danger"> = {
  General: "neutral",
  Contestant: "accent",
  Photographer: "success",
  Admin: "danger",
  Applications: "warn",
  Ratings: "warn",
  "Casting Call": "warn",
  Judgements: "warn",
};

function emptyDraft(): Omit<PlatformUser, "id" | "age" | "avatar" | "registeredAt" | "roles" | "status"> & { password: string; confirm: string } {
  return {
    firstName: "", lastName: "", gender: "Female", dob: "",
    country: "", email: "", phone: "", password: "", confirm: "",
  };
}

const FLAG_COUNTRIES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
  "Ladakh", "Puducherry", "Chandigarh"
];

function UsersPage() {
  const { state, updateUser, deleteUser, setUserRoles, registerUser, updateOrderStatus } = useAppStore();
  const users = state.users;
  const [filter, setFilter] = useState<"All" | Role>("All");
  const [q, setQ] = useState("");

  const [activeViewTab, setActiveViewTab] = useState("Info & Roles");

  const [countryFilter, setCountryFilter] = useState("All");
  const [countrySearchOpen, setCountrySearchOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");

  const [sortBy, setSortBy] = useState<"none" | "registeredAt" | "age">("none");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft());
  const [formCountrySearchOpen, setFormCountrySearchOpen] = useState(false);
  const [formCountryQuery, setFormCountryQuery] = useState("");

  const filteredFormCountries = useMemo(() => {
    return FLAG_COUNTRIES.filter(c =>
      c.toLowerCase().includes(formCountryQuery.toLowerCase())
    );
  }, [formCountryQuery]);

  const handleFormCountryQueryChange = (val: string) => {
    setFormCountryQuery(val);
    const exactMatch = FLAG_COUNTRIES.find(c => c.toLowerCase() === val.trim().toLowerCase());
    if (exactMatch) {
      setDraft(prev => ({ ...prev, country: exactMatch }));
    }
  };

  const handleFormCountryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filteredFormCountries.length > 0) {
      e.preventDefault();
      setDraft(prev => ({ ...prev, country: filteredFormCountries[0] }));
      setFormCountrySearchOpen(false);
      setFormCountryQuery("");
    }
  };

  const [viewing, setViewing] = useState<PlatformUser | null>(null);
  const [editing, setEditing] = useState<PlatformUser | null>(null);
  const [rolesOf, setRolesOf] = useState<PlatformUser | null>(null);

  const filteredCountries = useMemo(() => {
    return ["All", ...FLAG_COUNTRIES].filter(c => 
      c.toLowerCase().includes(countryQuery.toLowerCase())
    );
  }, [countryQuery]);

  const handleCountryQueryChange = (val: string) => {
    setCountryQuery(val);
    const match = FLAG_COUNTRIES.find(c => c.toLowerCase() === val.trim().toLowerCase());
    if (match) {
      setCountryFilter(match);
      setCountrySearchOpen(false);
      setCountryQuery("");
    } else if (val.trim().toLowerCase() === "all") {
      setCountryFilter("All");
      setCountrySearchOpen(false);
      setCountryQuery("");
    }
  };

  const handleSortToggle = (field: "registeredAt" | "age") => {
    if (sortBy === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const list = useMemo(() => {
    let result = users.filter(u => {
      if (filter !== "All" && !u.roles.includes(filter)) return false;
      if (countryFilter !== "All" && u.country.toLowerCase() !== countryFilter.toLowerCase()) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return (
        u.firstName.toLowerCase().includes(s) ||
        u.lastName.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.id.toLowerCase().includes(s)
      );
    });

    if (sortBy !== "none") {
      result = [...result].sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (sortBy === "age") {
          valA = Number(valA);
          valB = Number(valB);
        } else {
          valA = String(valA || "");
          valB = String(valB || "");
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [users, filter, countryFilter, q, sortBy, sortOrder]);

  const handleCreate = () => {
    if (!draft.firstName || !draft.lastName || !draft.email) return;
    registerUser({
      firstName: draft.firstName,
      lastName: draft.lastName,
      email: draft.email,
      phone: draft.phone,
      country: draft.country,
      dob: draft.dob,
    });
    setDraft(emptyDraft());
    setCreateOpen(false);
  };

  const toggleRole = (user: PlatformUser, role: Role, on: boolean) => {
    if (role === "General") return; // locked
    const nextRoles = on ? Array.from(new Set([...user.roles, role])) : user.roles.filter(r => r !== role);
    setUserRoles(user.id, nextRoles as Role[]);
    setRolesOf(prev => prev && prev.id === user.id ? { ...prev, roles: nextRoles as Role[] } : prev);
  };

  const saveEdit = () => {
    if (!editing) return;
    updateUser(editing.id, editing);
    setEditing(null);
  };

  const remove = (u: PlatformUser) => {
    if (!confirm(`Delete ${u.firstName} ${u.lastName}?`)) return;
    deleteUser(u.id);
  };

  return (
    <AdminLayout
      eyebrow="Module · User & Role Management"
      title="Manage Users"
      actions={
        <AdminButton variant="accent" onClick={() => setCreateOpen(true)}>
          <Plus className="w-3.5 h-3.5" /> Add User
        </AdminButton>
      }
    >
      <AdminCard>
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 z-20">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Box */}
            <div className="flex items-center gap-2 bg-surface-2 px-3 py-2 border border-border-subtle min-w-72">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={q} onChange={e => setQ(e.target.value)}
                placeholder="Search by name, email or ID…"
                className="bg-transparent outline-none text-sm flex-1"
              />
            </div>

            {/* Custom Searchable Country Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setCountrySearchOpen(!countrySearchOpen);
                  setSortDropdownOpen(false);
                }}
                className="flex items-center justify-between gap-2 bg-surface border border-border-subtle px-3 py-2 text-sm rounded hover:bg-surface-2 transition-colors min-w-44 text-left"
              >
                <span className="truncate">State: {countryFilter}</span>
                <span className="text-muted-foreground text-[10px]">▼</span>
              </button>

              {countrySearchOpen && (
                <div className="absolute left-0 mt-1 z-30 bg-background border border-border-subtle shadow-2xl p-3 rounded w-52 max-h-72 overflow-y-auto animate-in fade-in duration-200">
                  <div className="sticky top-0 bg-background pb-2 mb-2 border-b border-border-subtle">
                    <input
                      type="text"
                      value={countryQuery}
                      onChange={e => handleCountryQueryChange(e.target.value)}
                      placeholder="Type state name..."
                      className="w-full bg-surface border border-border-subtle px-2 py-1 text-xs rounded outline-none focus:border-accent text-foreground"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-0.5">
                    {filteredCountries.map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setCountryFilter(c);
                          setCountrySearchOpen(false);
                          setCountryQuery("");
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded hover:bg-accent/10 hover:text-accent transition-colors ${
                          countryFilter === c ? "text-accent font-semibold bg-accent/5" : "text-muted-foreground"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                    {filteredCountries.length === 0 && (
                      <div className="text-center text-[10px] text-muted-foreground py-2 italic">
                        No match
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setSortDropdownOpen(!sortDropdownOpen);
                  setCountrySearchOpen(false);
                }}
                className="flex items-center justify-between gap-2 bg-surface border border-border-subtle px-3 py-2 text-sm rounded hover:bg-surface-2 transition-colors min-w-44 text-left font-mono font-semibold"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  Sort: {
                    sortBy === "none" 
                      ? "None" 
                      : sortBy === "registeredAt" 
                      ? `Registered ${sortOrder === "asc" ? "↑" : "↓"}` 
                      : `Age ${sortOrder === "asc" ? "↑" : "↓"}`
                  }
                </span>
                <span className="text-muted-foreground text-[10px]">▼</span>
              </button>

              {sortDropdownOpen && (
                <div className="absolute left-0 mt-1 z-30 bg-background border border-border-subtle shadow-2xl p-2 rounded w-48 animate-in fade-in duration-200">
                  <div className="space-y-0.5">
                    <button
                      onClick={() => {
                        setSortBy("none");
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 text-xs rounded hover:bg-accent/10 hover:text-accent transition-colors ${
                        sortBy === "none" ? "text-accent font-semibold bg-accent/5" : "text-muted-foreground"
                      }`}
                    >
                      None
                    </button>
                    <button
                      onClick={() => {
                        handleSortToggle("registeredAt");
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 text-xs rounded hover:bg-accent/10 hover:text-accent transition-colors flex items-center justify-between ${
                        sortBy === "registeredAt" ? "text-accent font-semibold bg-accent/5" : "text-muted-foreground"
                      }`}
                    >
                      <span>Sort Registered</span>
                      {sortBy === "registeredAt" && <span>{sortOrder === "asc" ? "↑" : "↓"}</span>}
                    </button>
                    <button
                      onClick={() => {
                        handleSortToggle("age");
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 text-xs rounded hover:bg-accent/10 hover:text-accent transition-colors flex items-center justify-between ${
                        sortBy === "age" ? "text-accent font-semibold bg-accent/5" : "text-muted-foreground"
                      }`}
                    >
                      <span>Sort Age</span>
                      {sortBy === "age" && <span>{sortOrder === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 editorial-label text-muted-foreground">
            {(["All", ...ALL_ROLES.filter(r => r !== "General")] as const).map(r => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`px-3 py-1 border ${filter === r ? "border-accent text-accent" : "border-border-subtle hover:text-foreground"}`}
              >
                {r} <span className="opacity-50">({r === "All" ? users.length : users.filter(u => u.roles.includes(r as Role)).length})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1100px]">
            <thead>
              <tr className="text-left editorial-label text-muted-foreground border-b border-border-subtle">
                <th className="py-3 pr-3">User ID</th>
                <th className="py-3 pr-3">User</th>
                <th className="py-3 pr-3">Age</th>
                <th className="py-3 pr-3">State</th>
                <th className="py-3 pr-3">Registered</th>
                <th className="py-3 pr-3">Roles</th>
                <th className="py-3 pr-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(u => (
                <tr key={u.id} className="border-b border-border-subtle hover:bg-surface-2">
                  <td className="py-4 pr-3 font-mono text-xs text-muted-foreground">{u.id}</td>
                  <td className="py-4 pr-3">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover bg-surface-3" />
                      <div>
                        <div>{u.firstName} {u.lastName}</div>
                        <div className="editorial-label text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-3 text-muted-foreground">{u.age} yrs</td>
                  <td className="py-4 pr-3">{u.country}</td>
                  <td className="py-4 pr-3 text-muted-foreground">{u.registeredAt}</td>
                  <td className="py-4 pr-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map(r => <StatusChip key={r} status={r} tone={ROLE_TONES[r]} />)}
                    </div>
                  </td>
                  <td className="py-4 pr-3">
                    <div className="flex items-center justify-end gap-1">
                      <IconBtn title="View" onClick={() => setViewing(u)}><Eye className="w-3.5 h-3.5" /></IconBtn>
                      <IconBtn title="Edit" onClick={() => setEditing({ ...u })}><Pencil className="w-3.5 h-3.5" /></IconBtn>
                      <IconBtn title="Manage Roles" onClick={() => setRolesOf(u)}><Shield className="w-3.5 h-3.5" /></IconBtn>
                      <IconBtn title="Delete" onClick={() => remove(u)} danger><Trash2 className="w-3.5 h-3.5" /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={10} className="py-12 text-center text-muted-foreground">No users match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Create User */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl bg-background border-border-subtle">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Create New User</DialogTitle>
            <DialogDescription>Manually onboard an account into the ReeVibes platform.</DialogDescription>
          </DialogHeader>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="First Name"><Input value={draft.firstName} onChange={e => setDraft({ ...draft, firstName: e.target.value })} /></Field>
            <Field label="Last Name"><Input value={draft.lastName} onChange={e => setDraft({ ...draft, lastName: e.target.value })} /></Field>
            <Field label="Email"><Input type="email" value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} /></Field>
            <Field label="Phone Number"><Input value={draft.phone} onChange={e => setDraft({ ...draft, phone: e.target.value })} /></Field>
            <Field label="Password"><Input type="password" value={draft.password} onChange={e => setDraft({ ...draft, password: e.target.value })} /></Field>
            <Field label="Confirm Password"><Input type="password" value={draft.confirm} onChange={e => setDraft({ ...draft, confirm: e.target.value })} /></Field>
            <Field label="Gender">
              <select value={draft.gender} onChange={e => setDraft({ ...draft, gender: e.target.value as PlatformUser["gender"] })}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                <option>Female</option><option>Male</option><option>Other</option>
              </select>
            </Field>
            <Field label="Date of Birth"><Input type="date" value={draft.dob} onChange={e => setDraft({ ...draft, dob: e.target.value })} /></Field>
            <Field label="State" className="sm:col-span-2 relative">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFormCountrySearchOpen(!formCountrySearchOpen)}
                  className="flex items-center justify-between gap-2 bg-transparent border border-input h-9 px-3 py-2 text-sm rounded-md hover:bg-surface-2 transition-colors w-full text-left text-foreground"
                >
                  <span className="truncate">{draft.country || "Select State..."}</span>
                  <span className="text-muted-foreground text-[10px]">▼</span>
                </button>

                {formCountrySearchOpen && (
                  <div className="absolute left-0 right-0 mt-1 z-50 bg-background border border-border-subtle shadow-2xl p-3 rounded w-full max-h-60 overflow-y-auto animate-in duration-200">
                    <div className="sticky top-0 bg-background pb-2 mb-2 border-b border-border-subtle">
                      <input
                        type="text"
                        value={formCountryQuery}
                        onChange={e => handleFormCountryQueryChange(e.target.value)}
                        onKeyDown={handleFormCountryKeyDown}
                        placeholder="Type state name..."
                        className="w-full bg-surface border border-border-subtle px-2.5 py-1.5 text-sm rounded outline-none focus:border-accent text-foreground"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-0.5">
                      {filteredFormCountries.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setDraft(prev => ({ ...prev, country: c }));
                            setFormCountrySearchOpen(false);
                            setFormCountryQuery("");
                          }}
                          className={`w-full text-left px-2.5 py-1.5 text-sm rounded hover:bg-accent/10 hover:text-accent transition-colors ${
                            draft.country === c ? "text-accent font-semibold bg-accent/5" : "text-muted-foreground"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                      {filteredFormCountries.length === 0 && (
                        <div className="text-center text-xs text-muted-foreground py-2 italic">
                          No match
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Field>
          </div>
          <DialogFooter>
            <AdminButton variant="outline" onClick={() => setCreateOpen(false)}>Cancel</AdminButton>
            <AdminButton variant="accent" onClick={handleCreate}>Create User</AdminButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View */}
      <Dialog open={!!viewing} onOpenChange={o => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl bg-background border-border-subtle overflow-y-auto max-h-[90vh]">
          {viewing && (() => {
            const userAddresses = state.addresses[viewing.id] || [];
            const wishlistIds = state.wishlist[viewing.id] || [];
            const userOrders = state.orders[viewing.id] || [];
            const cartItems = state.cart.filter(() => viewing.id === state.user?.id); // mock cart connection for currently logged in
            
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">{viewing.firstName} {viewing.lastName}</DialogTitle>
                  <DialogDescription>{viewing.id} · Onboarded Account</DialogDescription>
                </DialogHeader>

                {/* Sub tabs in Admin Dialog */}
                <div className="flex border-b border-border-subtle gap-4 text-xs uppercase font-semibold pb-1.5 mb-4">
                  {["Info & Roles", "Addresses", "Cart & Wishlist", "Orders"].map((tabLabel, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        // We can use a simple temp state or element state. Let's toggle via local state using a window level or component state.
                        // To keep it simple and compile-safe, let's use a dataset attribute or local component state if we define it at the top of UsersPage.
                        // Let's store activeViewTab in state at top of UsersPage.
                        setActiveViewTab(tabLabel);
                      }}
                      className={`pb-1 border-b-2 transition-colors ${
                        activeViewTab === tabLabel ? "border-accent text-accent font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tabLabel}
                    </button>
                  ))}
                </div>

                {activeViewTab === "Info & Roles" && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <img src={viewing.avatar} className="w-20 h-20 rounded-full object-cover bg-surface-3" />
                      <div className="text-sm space-y-1">
                        <div><span className="editorial-label text-muted-foreground">Email · </span>{viewing.email}</div>
                        <div><span className="editorial-label text-muted-foreground">Phone · </span>{viewing.phone}</div>
                        <div><span className="editorial-label text-muted-foreground">State · </span>{viewing.country}</div>
                        <div><span className="editorial-label text-muted-foreground">DOB · </span>{viewing.dob} ({viewing.age})</div>
                        <div><span className="editorial-label text-muted-foreground">Registered · </span>{viewing.registeredAt}</div>
                      </div>
                    </div>
                    <div>
                      <div className="editorial-label text-muted-foreground mb-2">Current Roles</div>
                      <div className="flex flex-wrap gap-1">{viewing.roles.map(r => <StatusChip key={r} status={r} tone={ROLE_TONES[r]} />)}</div>
                    </div>
                  </div>
                )}

                {activeViewTab === "Addresses" && (
                  <div className="space-y-3">
                    <div className="editorial-label text-muted-foreground mb-2">Saved Addresses</div>
                    {userAddresses.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No addresses saved.</p>
                    ) : (
                      userAddresses.map((addr, idx) => (
                        <div key={idx} className="p-3 border border-border-subtle bg-surface text-xs rounded-sm">
                          {addr}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeViewTab === "Cart & Wishlist" && (
                  <div className="space-y-6">
                    <div>
                      <div className="editorial-label text-muted-foreground mb-2">Wishlist Items ({wishlistIds.length})</div>
                      {wishlistIds.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">Wishlist is empty.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {PRODUCTS.filter(p => wishlistIds.includes(p.id)).map(p => (
                            <div key={p.id} className="p-2 border border-border-subtle text-xs bg-surface flex items-center gap-2">
                              <img src={p.image} className="w-8 h-10 object-cover shrink-0" />
                              <span className="truncate">{p.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="editorial-label text-muted-foreground mb-2">Current Cart Items</div>
                      {cartItems.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">Cart is empty.</p>
                      ) : (
                        <div className="space-y-2">
                          {cartItems.map((item, idx) => (
                            <div key={idx} className="p-2 border border-border-subtle text-xs bg-surface flex justify-between items-center">
                              <span>{item.name} x {item.qty}</span>
                              <span className="font-semibold">{item.price}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeViewTab === "Orders" && (
                  <div className="space-y-4">
                    <div className="editorial-label text-muted-foreground mb-2">Past Orders ({userOrders.length})</div>
                    {userOrders.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No orders placed.</p>
                    ) : (
                      userOrders.map((order) => (
                        <div key={order.id} className="p-4 border border-border-subtle bg-surface text-xs space-y-3">
                          <div className="flex justify-between items-center font-semibold border-b border-border-subtle pb-1.5">
                            <span className="font-mono text-accent">{order.id} ({order.date})</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] uppercase text-muted-foreground">Status:</span>
                              <select
                                value={order.status}
                                onChange={e => {
                                  updateOrderStatus(viewing.id, order.id, e.target.value);
                                  alert(`Updated ${order.id} status to ${e.target.value}`);
                                }}
                                className="bg-background border border-border-subtle text-xs px-1 py-0.5 rounded outline-none text-foreground"
                              >
                                <option>Processing</option>
                                <option>Shipped</option>
                                <option>Delivered</option>
                                <option>Cancelled</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {order.items.map(item => (
                              <div key={item.productId} className="flex justify-between text-muted-foreground">
                                <span>{item.name} x {item.qty}</span>
                                <span>{item.price}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between font-bold border-t border-border-subtle/50 pt-1.5">
                            <span>Total</span>
                            <span>₹{order.total.toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editing} onOpenChange={o => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl bg-background border-border-subtle">
          {editing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">Edit User</DialogTitle>
                <DialogDescription>{editing.id}</DialogDescription>
              </DialogHeader>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="First Name"><Input value={editing.firstName} onChange={e => setEditing({ ...editing, firstName: e.target.value })} /></Field>
                <Field label="Last Name"><Input value={editing.lastName} onChange={e => setEditing({ ...editing, lastName: e.target.value })} /></Field>
                <Field label="Email"><Input value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} /></Field>
                <Field label="Phone"><Input value={editing.phone} onChange={e => setEditing({ ...editing, phone: e.target.value })} /></Field>
                <Field label="State"><Input value={editing.country} onChange={e => setEditing({ ...editing, country: e.target.value })} /></Field>
                <Field label="DOB"><Input type="date" value={editing.dob} onChange={e => setEditing({ ...editing, dob: e.target.value })} /></Field>
                <Field label="Status">
                  <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as PlatformUser["status"] })}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                    <option>Active</option><option>Invited</option><option>Suspended</option>
                  </select>
                </Field>
              </div>
              <DialogFooter>
                <AdminButton variant="outline" onClick={() => setEditing(null)}>Cancel</AdminButton>
                <AdminButton variant="accent" onClick={saveEdit}>Save Changes</AdminButton>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Roles */}
      <Dialog open={!!rolesOf} onOpenChange={o => !o && setRolesOf(null)}>
        <DialogContent className="max-w-lg bg-background border-border-subtle">
          {rolesOf && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">Manage Roles</DialogTitle>
                <DialogDescription>{rolesOf.firstName} {rolesOf.lastName} · {rolesOf.id}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <RoleGroup title="Default Roles" roles={["General","Contestant","Photographer","Admin"]} user={rolesOf} onToggle={toggleRole} />
                <RoleGroup title="Contest Workflow Roles" roles={["Applications","Ratings","Casting Call","Judgements"]} user={rolesOf} onToggle={toggleRole} />
                <div className="text-xs text-muted-foreground border-t border-border-subtle pt-3">
                  <strong>General</strong> is auto-assigned to every account. <strong>Contestant</strong> is auto-assigned when a user submits a contest application. All other roles unlock the matching admin module immediately.
                </div>
              </div>
              <DialogFooter>
                <AdminButton variant="accent" onClick={() => setRolesOf(null)}>Done</AdminButton>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="editorial-label text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function IconBtn({ children, onClick, title, danger }: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-2 border border-border-subtle hover:border-foreground/40 transition-colors ${danger ? "text-rose-400 hover:text-rose-300" : "text-foreground/70 hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}

function RoleGroup({ title, roles, user, onToggle }: { title: string; roles: Role[]; user: PlatformUser; onToggle: (u: PlatformUser, r: Role, on: boolean) => void }) {
  const { state } = useAppStore();
  const hasApplied = state.applications.some(app => app.userId === user.id);

  return (
    <div>
      <div className="editorial-label text-muted-foreground mb-2">{title}</div>
      <div className="grid grid-cols-2 gap-2">
        {roles.map(r => {
          const isContestant = r === "Contestant";
          const checked = r === "General" ? true : isContestant ? hasApplied : user.roles.includes(r);
          const locked = r === "General" || isContestant;
          const label = r === "General" ? "Auto" : isContestant ? (hasApplied ? "Applied" : "No App") : "";

          return (
            <label key={r} className={`flex items-center gap-3 px-3 py-2 border ${checked ? "border-accent/60 bg-accent/5" : "border-border-subtle"} ${locked ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:border-foreground/40"}`}>
              <Checkbox checked={checked} disabled={locked} onCheckedChange={v => onToggle(user, r, !!v)} />
              <span className="text-sm">{r}</span>
              {label && <span className="ml-auto editorial-label text-muted-foreground">{label}</span>}
            </label>
          );
        })}
      </div>
    </div>
  );
}
