"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminGuard } from "../components/AdminGuard";
import {
  ApiError,
  createMenuItemRequest,
  deleteMenuItemRequest,
  fetchMenu,
  mediaUrl,
  setSpecialtyRequest,
  updateMenuItemRequest,
  type ApiMenuItem,
} from "../lib/api";
import { clearStaffToken, getStaffToken } from "../lib/auth";
import {
  formatPrice,
  parseCommaList,
  parsePriceInput,
  tagsToApi,
  toApiCategory,
  toUiCategory,
} from "../lib/menu-map";
import { restaurantContent, type MenuCategory } from "../lib/restaurant-data";

type DraftDish = {
  id?: number;
  name: string;
  price: string;
  description: string;
  category: MenuCategory;
  tags: string;
  vegan: boolean;
  choicesJson: string;
  addOnsJson: string;
  imageFile: File | null;
  imageUrl: string | null;
};

const emptyDraft = (): DraftDish => ({
  name: "",
  price: "",
  description: "",
  category: "lunch",
  tags: "",
  vegan: false,
  choicesJson: "[]",
  addOnsJson: "[]",
  imageFile: null,
  imageUrl: null,
});

function itemToDraft(item: ApiMenuItem): DraftDish {
  return {
    id: item.id,
    name: item.name,
    price: String(item.price),
    description: item.description ?? "",
    category: toUiCategory(item.category),
    tags: item.tags.join(", "),
    vegan: item.tags.includes("vegan"),
    choicesJson: JSON.stringify(item.choices ?? [], null, 2),
    addOnsJson: JSON.stringify(item.addOns ?? [], null, 2),
    imageFile: null,
    imageUrl: item.imageUrl,
  };
}

function buildFormData(draft: DraftDish) {
  const form = new FormData();
  form.set("name", draft.name.trim());
  form.set("price", String(parsePriceInput(draft.price)));
  form.set("description", draft.description.trim());
  form.set("category", toApiCategory(draft.category));
  form.set("tags", JSON.stringify(tagsToApi(parseCommaList(draft.tags), draft.vegan)));

  let choices: unknown = [];
  let addOns: unknown = [];
  try {
    choices = JSON.parse(draft.choicesJson || "[]");
  } catch {
    throw new Error("Choices must be valid JSON.");
  }
  try {
    addOns = JSON.parse(draft.addOnsJson || "[]");
  } catch {
    throw new Error("Add-ons must be valid JSON.");
  }
  form.set("choices", JSON.stringify(choices));
  form.set("addOns", JSON.stringify(addOns));
  if (draft.imageFile) form.set("image", draft.imageFile);
  return form;
}

export default function AdminPage() {
  const router = useRouter();
  const [items, setItems] = useState<ApiMenuItem[]>([]);
  const [specialtyIds, setSpecialtyIds] = useState<number[]>([]);
  const [draft, setDraft] = useState<DraftDish>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [filterCategory, setFilterCategory] = useState<MenuCategory | "all">("all");

  const token = () => {
    const value = getStaffToken();
    if (!value) throw new Error("Not signed in.");
    return value;
  };

  const load = useCallback(async () => {
    const [menu, specialty] = await Promise.all([
      fetchMenu(),
      fetchMenu("?specialty=true"),
    ]);
    setItems(menu);
    setSpecialtyIds(specialty.map((item) => item.id));
  }, []);

  useEffect(() => {
    load().catch((error) => {
      setNotice(error instanceof Error ? error.message : "Failed to load menu.");
    });
  }, [load]);

  const visibleItems = useMemo(() => {
    if (filterCategory === "all") return items;
    return items.filter((item) => toUiCategory(item.category) === filterCategory);
  }, [filterCategory, items]);

  function logout() {
    clearStaffToken();
    router.replace("/login");
  }

  function startCreate() {
    setEditingId(null);
    setDraft(emptyDraft());
    setNotice("New dish draft ready.");
  }

  function startEdit(item: ApiMenuItem) {
    setEditingId(item.id);
    setDraft(itemToDraft(item));
    setNotice(`Editing ${item.name}.`);
  }

  async function saveDish(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const form = buildFormData(draft);
      if (editingId == null) {
        await createMenuItemRequest(token(), form);
        setNotice("Dish created.");
      } else {
        await updateMenuItemRequest(token(), editingId, form);
        setNotice("Dish updated.");
      }
      setDraft(emptyDraft());
      setEditingId(null);
      await load();
    } catch (error) {
      setNotice(error instanceof ApiError || error instanceof Error ? error.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function removeDish(id: number, name: string) {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setBusy(true);
    try {
      await deleteMenuItemRequest(token(), id);
      if (editingId === id) {
        setEditingId(null);
        setDraft(emptyDraft());
      }
      setNotice("Dish deleted.");
      await load();
    } catch (error) {
      setNotice(error instanceof ApiError ? error.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  function toggleSpecialty(id: number) {
    setSpecialtyIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }

  async function saveSpecialty() {
    setBusy(true);
    try {
      const updated = await setSpecialtyRequest(token(), specialtyIds);
      setSpecialtyIds(updated.map((item) => item.id));
      setNotice("Today's specialty saved.");
    } catch (error) {
      setNotice(error instanceof ApiError ? error.message : "Specialty save failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminGuard>
      <main className="admin-shell">
        <aside className="admin-sidebar">
          <Link className="admin-brand text-only" href="/">
            <span>
              <strong>SaiGonSister</strong>
              <small>Staff Console</small>
            </span>
          </Link>
          <div className="admin-nav-label">Workspace</div>
          <nav aria-label="Admin sections">
            <a href="#daily">Daily special</a>
            <a href="#dish-editor">Dish editor</a>
            <a href="#dish-list">Menu list</a>
          </nav>
          <button className="forgot-link" onClick={logout} type="button">
            Sign out
          </button>
        </aside>

        <section className="admin-main">
          <header className="admin-header">
            <div>
              <p className="eyebrow">Staff workspace</p>
              <h1>Admin menu editor</h1>
            </div>
            <Link className="admin-view-site" href="/">
              View website
            </Link>
          </header>

          {notice ? <p className="account-notice">{notice}</p> : null}

          <section className="admin-summary" aria-label="Admin summary">
            <article>
              <span>Daily</span>
              <strong>{specialtyIds.length}</strong>
            </article>
            <article>
              <span>Dishes</span>
              <strong>{items.length}</strong>
            </article>
          </section>

          <section className="admin-card" id="daily" aria-labelledby="daily-admin-title">
            <div className="admin-card-heading">
              <div>
                <p className="eyebrow">Homepage</p>
                <h2 id="daily-admin-title">Daily specialty</h2>
                <p>Select one or more menu dishes to feature today. Upload images on the dish editor.</p>
              </div>
              <button disabled={busy} onClick={saveSpecialty} type="button">
                Save specialty
              </button>
            </div>
            <div className="admin-daily-list">
              {items.map((item) => (
                <label className="check-row admin-daily-item" key={item.id}>
                  <input
                    checked={specialtyIds.includes(item.id)}
                    onChange={() => toggleSpecialty(item.id)}
                    type="checkbox"
                  />
                  <span>
                    <strong>{item.name}</strong> ({toUiCategory(item.category)}) · {formatPrice(item.price)}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="admin-card" id="dish-editor" aria-labelledby="dish-editor-title">
            <div className="admin-card-heading">
              <div>
                <p className="eyebrow">Menu dishes</p>
                <h2 id="dish-editor-title">{editingId == null ? "Create dish" : `Edit dish #${editingId}`}</h2>
              </div>
              <button className="icon-command" onClick={startCreate} type="button">
                + Dish
              </button>
            </div>
            <form className="admin-form" onSubmit={saveDish}>
              <div className="two-col">
                <label>
                  Dish name
                  <input
                    onChange={(event) => setDraft((d) => ({ ...d, name: event.target.value }))}
                    required
                    value={draft.name}
                  />
                </label>
                <label>
                  Price
                  <input
                    onChange={(event) => setDraft((d) => ({ ...d, price: event.target.value }))}
                    required
                    value={draft.price}
                  />
                </label>
              </div>
              <div className="two-col">
                <label>
                  Category
                  <select
                    onChange={(event) =>
                      setDraft((d) => ({ ...d, category: event.target.value as MenuCategory }))
                    }
                    value={draft.category}
                  >
                    {restaurantContent.menuTabs.map((tab) => (
                      <option key={tab.id} value={tab.id}>
                        {tab.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Tags (Signature, Chef&apos;s choice, Vegan, or API tags)
                  <input
                    onChange={(event) => setDraft((d) => ({ ...d, tags: event.target.value }))}
                    value={draft.tags}
                  />
                </label>
              </div>
              <label>
                Description
                <textarea
                  onChange={(event) => setDraft((d) => ({ ...d, description: event.target.value }))}
                  rows={3}
                  value={draft.description}
                />
              </label>
              <div className="two-col">
                <label>
                  Choices JSON
                  <textarea
                    onChange={(event) => setDraft((d) => ({ ...d, choicesJson: event.target.value }))}
                    rows={4}
                    value={draft.choicesJson}
                  />
                </label>
                <label>
                  Add-ons JSON
                  <textarea
                    onChange={(event) => setDraft((d) => ({ ...d, addOnsJson: event.target.value }))}
                    rows={4}
                    value={draft.addOnsJson}
                  />
                </label>
              </div>
              <div className="two-col">
                <label className="upload-picker">
                  Upload image
                  <input
                    accept="image/*"
                    onChange={(event) =>
                      setDraft((d) => ({ ...d, imageFile: event.target.files?.[0] ?? null }))
                    }
                    type="file"
                  />
                  <span>{draft.imageFile ? draft.imageFile.name : "Choose from computer"}</span>
                </label>
                <label>
                  Current image
                  <input readOnly value={draft.imageUrl ? mediaUrl(draft.imageUrl) : ""} />
                </label>
              </div>
              <label className="check-row">
                <input
                  checked={draft.vegan}
                  onChange={(event) => setDraft((d) => ({ ...d, vegan: event.target.checked }))}
                  type="checkbox"
                />
                Vegan option available
              </label>
              <button disabled={busy} type="submit">
                {busy ? "Saving..." : editingId == null ? "Create dish" : "Save dish"}
              </button>
            </form>
          </section>

          <section className="admin-card" id="dish-list" aria-labelledby="dish-list-title">
            <div className="admin-card-heading">
              <div>
                <p className="eyebrow">All dishes</p>
                <h2 id="dish-list-title">Menu list</h2>
              </div>
              <label>
                Filter
                <select
                  onChange={(event) =>
                    setFilterCategory(event.target.value as MenuCategory | "all")
                  }
                  value={filterCategory}
                >
                  <option value="all">All</option>
                  {restaurantContent.menuTabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="admin-dish-editor">
              {visibleItems.map((item) => (
                <div className="admin-form admin-dish-line" key={item.id}>
                  <div className="admin-item-bar">
                    <strong>
                      {item.name} · {formatPrice(item.price)}
                    </strong>
                    <div className="login-inline-actions">
                      <button onClick={() => startEdit(item)} type="button">
                        Edit
                      </button>
                      <button
                        aria-label={`Remove ${item.name}`}
                        className="icon-remove"
                        onClick={() => removeDish(item.id, item.name)}
                        type="button"
                      >
                        -
                      </button>
                    </div>
                  </div>
                  <p>{item.description}</p>
                  <p>
                    {toUiCategory(item.category)}
                    {item.imageUrl ? ` · ${mediaUrl(item.imageUrl)}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-card" id="settings" aria-labelledby="settings-title">
            <div className="admin-card-heading">
              <div>
                <p className="eyebrow">Restaurant details</p>
                <h2 id="settings-title">Contact and hours</h2>
                <p>Static site copy for now. Not stored in the API yet.</p>
              </div>
            </div>
            <form className="admin-form two-col">
              <label>
                Location
                <input defaultValue={restaurantContent.contact.location} readOnly />
              </label>
              <label>
                Hours
                <input defaultValue={restaurantContent.contact.hours} readOnly />
              </label>
              <label>
                Email
                <input defaultValue={restaurantContent.contact.email} readOnly type="email" />
              </label>
              <label>
                Phone
                <input defaultValue={restaurantContent.contact.phone} readOnly />
              </label>
            </form>
          </section>
        </section>
      </main>
    </AdminGuard>
  );
}
