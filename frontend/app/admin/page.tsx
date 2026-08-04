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
  fetchRestaurantInfo,
  mediaUrl,
  setSpecialtyRequest,
  updateMenuItemRequest,
  updatePasswordRequest,
  updateRestaurantInfoRequest,
  updateUsernameRequest,
  type ApiChoice,
  type ApiMenuItem,
  type ApiRestaurantInfo,
} from "../lib/api";
import { clearStaffToken, getStaffToken } from "../lib/auth";
import {
  formatPrice,
  parsePriceInput,
  tagsToApi,
  toApiCategory,
  toUiCategory,
} from "../lib/menu-map";
import { restaurantContent, type MenuCategory } from "../lib/restaurant-data";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
type DailyFilterCategory = MenuCategory | "all" | "shown";
const accountUsernameKey = "saigonSisterAdminUsername";

type DraftAddOn = {
  name: string;
  price: string;
};

type DraftDish = {
  id?: number;
  name: string;
  price: string;
  description: string;
  category: MenuCategory;
  sectionId: string;
  sectionTitle: string;
  sectionNote: string;
  vegan: boolean;
  choices: ApiChoice[];
  addOns: DraftAddOn[];
  imageFile: File | null;
  imageUrl: string | null;
};

const emptyDraft = (): DraftDish => ({
  name: "",
  price: "",
  description: "",
  category: "lunch",
  sectionId: "salad-rolls",
  sectionTitle: "Salad Rolls",
  sectionNote: "Lettuce, mint, basil, sprout, carrot, and mango.",
  vegan: false,
  choices: [],
  addOns: [],
  imageFile: null,
  imageUrl: null,
});

function itemToDraft(item: ApiMenuItem): DraftDish {
  const category = toUiCategory(item.category);
  const fallbackHeader = defaultHeaderFor(category);

  return {
    id: item.id,
    name: item.name,
    price: String(item.price),
    description: item.description ?? "",
    category,
    sectionId: item.sectionId ?? fallbackHeader.id,
    sectionTitle: item.sectionTitle ?? fallbackHeader.title,
    sectionNote: item.sectionNote ?? fallbackHeader.note ?? "",
    vegan: item.tags.includes("vegan"),
    choices: item.choices ?? [],
    addOns: (item.addOns ?? []).map((addOn) => ({
      name: addOn.name,
      price: addOn.price ? formatPrice(addOn.price) : "",
    })),
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
  form.set("sectionId", draft.sectionId.trim());
  form.set("sectionTitle", draft.sectionTitle.trim());
  form.set("sectionNote", draft.sectionNote.trim());
  form.set("tags", JSON.stringify(tagsToApi([], draft.vegan)));

  const choices = draft.choices
    .map((choice) => ({
      name: choice.name.trim(),
      required: Boolean(choice.required),
      options: choice.options.map((option) => option.trim()).filter(Boolean),
    }))
    .filter((choice) => choice.name || choice.options.length);
  const addOns = draft.addOns
    .map((addOn) => ({
      name: addOn.name.trim(),
      price: parsePriceInput(addOn.price),
    }))
    .filter((addOn) => addOn.name);

  form.set("choices", JSON.stringify(choices));
  form.set("addOns", JSON.stringify(addOns));
  if (draft.imageFile) form.set("image", draft.imageFile);
  return form;
}

function headerOptionsFor(category: MenuCategory) {
  return restaurantContent.menuSections[category] ?? [];
}

function defaultHeaderFor(category: MenuCategory) {
  return headerOptionsFor(category)[0] ?? { id: "", title: "", note: "" };
}

function slugifyHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function scrollToDishEditor() {
  window.requestAnimationFrame(() => {
    const editor = document.getElementById("dish-editor");
    if (!editor) return;

    const top = editor.getBoundingClientRect().top + window.scrollY - 18;
    window.history.replaceState(null, "", "#dish-editor");
    window.scrollTo({ top, behavior: "smooth" });
  });
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
  const [dailyFilterCategory, setDailyFilterCategory] = useState<DailyFilterCategory>("all");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [accountUsername, setAccountUsername] = useState("staff");
  const [passwordDraft, setPasswordDraft] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [restaurantInfo, setRestaurantInfo] = useState<ApiRestaurantInfo>({
    location: restaurantContent.contact.location,
    city: restaurantContent.contact.city,
    email: restaurantContent.contact.email,
    phone: restaurantContent.contact.phone,
    hoursByDay: restaurantContent.contact.hoursByDay,
    hoursNote: restaurantContent.contact.hoursNote ?? "",
  });

  const token = () => {
    const value = getStaffToken();
    if (!value) throw new Error("Not signed in.");
    return value;
  };

  const isFrontendTestToken = () => token().endsWith(".frontend-test");

  const load = useCallback(async () => {
    const [menu, specialty, info] = await Promise.all([
      fetchMenu(),
      fetchMenu("?specialty=true"),
      fetchRestaurantInfo(),
    ]);
    setItems(menu);
    setSpecialtyIds(specialty.map((item) => item.id));
    setRestaurantInfo(info);
  }, []);

  useEffect(() => {
    load().catch((error) => {
      setNotice(error instanceof Error ? error.message : "Failed to load menu.");
    });
  }, [load]);

  useEffect(() => {
    const savedUsername = window.localStorage.getItem(accountUsernameKey);
    if (savedUsername) setAccountUsername(savedUsername);
  }, []);

  useEffect(() => {
    if (!notice) return undefined;

    const timeout = window.setTimeout(() => setNotice(""), 4500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const visibleItems = useMemo(() => {
    if (filterCategory === "all") return items;
    return items.filter((item) => toUiCategory(item.category) === filterCategory);
  }, [filterCategory, items]);

  const visibleDailyItems = useMemo(() => {
    if (dailyFilterCategory === "all") return items;
    if (dailyFilterCategory === "shown") {
      return items.filter((item) => specialtyIds.includes(item.id));
    }
    return items.filter((item) => toUiCategory(item.category) === dailyFilterCategory);
  }, [dailyFilterCategory, items, specialtyIds]);

  const headerOptions = useMemo(() => headerOptionsFor(draft.category), [draft.category]);

  useEffect(() => {
    if (draft.imageFile) {
      const localUrl = URL.createObjectURL(draft.imageFile);
      setImagePreviewUrl(localUrl);
      return () => URL.revokeObjectURL(localUrl);
    }

    setImagePreviewUrl(draft.imageUrl ? mediaUrl(draft.imageUrl) : "");
    return undefined;
  }, [draft.imageFile, draft.imageUrl]);

  function updateDraftCategory(category: MenuCategory) {
    const header = defaultHeaderFor(category);
    setDraft((current) => ({
      ...current,
      category,
      sectionId: header.id,
      sectionTitle: header.title,
      sectionNote: header.note ?? "",
    }));
  }

  function selectHeader(sectionId: string) {
    if (sectionId === "custom") {
      setDraft((current) => ({
        ...current,
        sectionId: "",
        sectionTitle: "",
        sectionNote: "",
      }));
      return;
    }

    const header = headerOptions.find((section) => section.id === sectionId);
    if (!header) return;

    setDraft((current) => ({
      ...current,
      sectionId: header.id,
      sectionTitle: header.title,
      sectionNote: header.note ?? "",
    }));
  }

  function updateSectionTitle(sectionTitle: string) {
    setDraft((current) => ({
      ...current,
      sectionTitle,
      sectionId: slugifyHeader(sectionTitle),
    }));
  }

  function addChoice() {
    setDraft((current) => ({
      ...current,
      choices: [...current.choices, { name: "", options: [""] }],
    }));
  }

  function updateChoiceName(choiceIndex: number, name: string) {
    setDraft((current) => ({
      ...current,
      choices: current.choices.map((choice, index) =>
        index === choiceIndex ? { ...choice, name } : choice,
      ),
    }));
  }

  function removeChoice(choiceIndex: number) {
    setDraft((current) => ({
      ...current,
      choices: current.choices.filter((_, index) => index !== choiceIndex),
    }));
  }

  function addChoiceOption(choiceIndex: number) {
    setDraft((current) => ({
      ...current,
      choices: current.choices.map((choice, index) =>
        index === choiceIndex ? { ...choice, options: [...choice.options, ""] } : choice,
      ),
    }));
  }

  function updateChoiceOption(choiceIndex: number, optionIndex: number, option: string) {
    setDraft((current) => ({
      ...current,
      choices: current.choices.map((choice, index) =>
        index === choiceIndex
          ? {
              ...choice,
              options: choice.options.map((value, currentOptionIndex) =>
                currentOptionIndex === optionIndex ? option : value,
              ),
            }
          : choice,
      ),
    }));
  }

  function removeChoiceOption(choiceIndex: number, optionIndex: number) {
    setDraft((current) => ({
      ...current,
      choices: current.choices.map((choice, index) =>
        index === choiceIndex
          ? {
              ...choice,
              options: choice.options.filter((_, currentOptionIndex) => currentOptionIndex !== optionIndex),
            }
          : choice,
      ),
    }));
  }

  function addAddOn() {
    setDraft((current) => ({
      ...current,
      addOns: [...current.addOns, { name: "", price: "" }],
    }));
  }

  function updateAddOn(addOnIndex: number, field: keyof DraftAddOn, value: string) {
    setDraft((current) => ({
      ...current,
      addOns: current.addOns.map((addOn, index) =>
        index === addOnIndex ? { ...addOn, [field]: value } : addOn,
      ),
    }));
  }

  function removeAddOn(addOnIndex: number) {
    setDraft((current) => ({
      ...current,
      addOns: current.addOns.filter((_, index) => index !== addOnIndex),
    }));
  }

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
    window.setTimeout(scrollToDishEditor, 0);
    window.setTimeout(scrollToDishEditor, 140);
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

  async function saveRestaurant(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const updated = await updateRestaurantInfoRequest(token(), restaurantInfo);
      setRestaurantInfo(updated);
      setNotice("Restaurant contact and hours saved.");
    } catch (error) {
      setNotice(error instanceof ApiError ? error.message : "Restaurant save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function saveUsername(event: FormEvent) {
    event.preventDefault();
    const nextUsername = accountUsername.trim();
    if (!nextUsername) {
      setNotice("Enter a username.");
      return;
    }

    setBusy(true);
    try {
      const staffToken = token();
      if (isFrontendTestToken()) {
        window.localStorage.setItem(accountUsernameKey, nextUsername);
        setNotice("Username updated.");
      } else {
        const result = await updateUsernameRequest(staffToken, nextUsername);
        setNotice(result.message || "Username updated.");
      }
    } catch (error) {
      setNotice(error instanceof ApiError ? error.message : "Username update failed.");
    } finally {
      setBusy(false);
    }
  }

  async function savePassword(event: FormEvent) {
    event.preventDefault();
    if (!passwordDraft.currentPassword.trim()) {
      setNotice("Enter the current password.");
      return;
    }
    if (passwordDraft.newPassword.length < 1) {
      setNotice("Enter a new password.");
      return;
    }
    if (passwordDraft.newPassword !== passwordDraft.confirmPassword) {
      setNotice("New passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const staffToken = token();
      if (isFrontendTestToken()) {
        setNotice("Password updated.");
      } else {
        const result = await updatePasswordRequest(
          staffToken,
          passwordDraft.currentPassword,
          passwordDraft.newPassword,
        );
        setNotice(result.message || "Password updated.");
      }
      setPasswordDraft({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setNotice(error instanceof ApiError ? error.message : "Password update failed.");
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
            <a href="#account">Account</a>
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
            <div className="admin-daily-filter-bar">
              <div className="admin-daily-filter" aria-label="Daily specialty category filter">
                <button
                  className={dailyFilterCategory === "all" ? "active" : ""}
                  onClick={() => setDailyFilterCategory("all")}
                  type="button"
                >
                  All
                </button>
                <button
                  className={dailyFilterCategory === "shown" ? "active" : ""}
                  onClick={() => setDailyFilterCategory("shown")}
                  type="button"
                >
                  Shown dishes
                </button>
                {restaurantContent.menuTabs.map((tab) => (
                  <button
                    className={dailyFilterCategory === tab.id ? "active" : ""}
                    key={tab.id}
                    onClick={() => setDailyFilterCategory(tab.id)}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <p>{visibleDailyItems.length} dishes showing</p>
            </div>
            <div className="admin-daily-list">
              {visibleDailyItems.map((item) => (
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
                    onChange={(event) => updateDraftCategory(event.target.value as MenuCategory)}
                    value={draft.category}
                  >
                    {restaurantContent.menuTabs.map((tab) => (
                      <option key={tab.id} value={tab.id}>
                        {tab.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="check-row tag-checkbox-card">
                  <input
                    checked={draft.vegan}
                    onChange={(event) => setDraft((d) => ({ ...d, vegan: event.target.checked }))}
                    type="checkbox"
                  />
                  Vegan
                </label>
              </div>
              <div className="header-picker-panel">
                <label>
                  Menu header
                  <select
                    onChange={(event) => selectHeader(event.target.value)}
                    value={headerOptions.some((section) => section.id === draft.sectionId) ? draft.sectionId : "custom"}
                  >
                    {headerOptions.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.title}
                      </option>
                    ))}
                    <option value="custom">Custom header</option>
                  </select>
                </label>
                <div className="two-col">
                  <label>
                    Header name
                    <input
                      onChange={(event) => updateSectionTitle(event.target.value)}
                      placeholder="Salad Rolls"
                      value={draft.sectionTitle}
                    />
                  </label>
                  <label>
                    Header note
                    <input
                      onChange={(event) => setDraft((d) => ({ ...d, sectionNote: event.target.value }))}
                      placeholder="Lettuce, mint, basil, sprout, carrot, and mango."
                      value={draft.sectionNote}
                    />
                  </label>
                </div>
              </div>
              <label>
                Description
                <textarea
                  onChange={(event) => setDraft((d) => ({ ...d, description: event.target.value }))}
                  rows={3}
                  value={draft.description}
                />
              </label>
              <div className="option-editor-grid">
                <article>
                  <div className="choice-admin-header">
                    <strong>Choices</strong>
                    <button onClick={addChoice} type="button">
                      + Choice
                    </button>
                  </div>
                  <div className="choice-admin-list">
                    {draft.choices.length ? (
                      draft.choices.map((choice, choiceIndex) => (
                        <section className="choice-admin-card" key={`choice-${choiceIndex}`}>
                          <div className="choice-admin-heading">
                            <label>
                              Choice name
                              <input
                                onChange={(event) => updateChoiceName(choiceIndex, event.target.value)}
                                placeholder="Egg style, filling, noodle style"
                                value={choice.name}
                              />
                            </label>
                            <button onClick={() => removeChoice(choiceIndex)} type="button">
                              -
                            </button>
                          </div>
                          <div className="choice-option-list">
                            <div className="choice-admin-header compact">
                              <strong>Options</strong>
                              <button onClick={() => addChoiceOption(choiceIndex)} type="button">
                                + Option
                              </button>
                            </div>
                            {choice.options.length ? (
                              choice.options.map((option, optionIndex) => (
                                <div className="choice-option-row" key={`choice-${choiceIndex}-option-${optionIndex}`}>
                                  <input
                                    onChange={(event) =>
                                      updateChoiceOption(choiceIndex, optionIndex, event.target.value)
                                    }
                                    placeholder="Sunny side up"
                                    value={option}
                                  />
                                  <button onClick={() => removeChoiceOption(choiceIndex, optionIndex)} type="button">
                                    -
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className="muted">No options added.</p>
                            )}
                          </div>
                        </section>
                      ))
                    ) : (
                      <p className="muted">No choices added.</p>
                    )}
                  </div>
                </article>
                <article>
                  <div className="choice-admin-header">
                    <strong>Add-ons</strong>
                    <button onClick={addAddOn} type="button">
                      + Add-on
                    </button>
                  </div>
                  <div className="addon-admin-block">
                    {draft.addOns.length ? (
                      draft.addOns.map((addOn, addOnIndex) => (
                        <div className="addon-admin-row" key={`add-on-${addOnIndex}`}>
                          <label>
                            Add-on
                            <input
                              onChange={(event) => updateAddOn(addOnIndex, "name", event.target.value)}
                              placeholder="Bacon"
                              value={addOn.name}
                            />
                          </label>
                          <label>
                            Price
                            <input
                              onChange={(event) => updateAddOn(addOnIndex, "price", event.target.value)}
                              placeholder="$2"
                              value={addOn.price}
                            />
                          </label>
                          <button onClick={() => removeAddOn(addOnIndex)} type="button">
                            -
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="muted">No add-ons added.</p>
                    )}
                  </div>
                </article>
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
                  <small>
                    Shown only when this dish is featured as a daily specialty.
                  </small>
                </label>
              </div>
              {imagePreviewUrl ? (
                <div className="admin-preview-panel">
                  <span>Image preview</span>
                  <img alt={draft.name ? `${draft.name} preview` : "Dish preview"} src={imagePreviewUrl} />
                </div>
              ) : null}
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
                <p>Saved to the database and shown in the site footer.</p>
              </div>
              <button disabled={busy} form="restaurant-settings-form" type="submit">
                Save details
              </button>
            </div>
            <form className="admin-form" id="restaurant-settings-form" onSubmit={saveRestaurant}>
              <div className="two-col">
                <label>
                  Location
                  <input
                    onChange={(event) =>
                      setRestaurantInfo((info) => ({ ...info, location: event.target.value }))
                    }
                    required
                    value={restaurantInfo.location}
                  />
                </label>
                <label>
                  City
                  <input
                    onChange={(event) =>
                      setRestaurantInfo((info) => ({ ...info, city: event.target.value }))
                    }
                    required
                    value={restaurantInfo.city}
                  />
                </label>
                <label>
                  Email
                  <input
                    onChange={(event) =>
                      setRestaurantInfo((info) => ({ ...info, email: event.target.value }))
                    }
                    required
                    type="email"
                    value={restaurantInfo.email}
                  />
                </label>
                <label>
                  Phone
                  <input
                    onChange={(event) =>
                      setRestaurantInfo((info) => ({ ...info, phone: event.target.value }))
                    }
                    value={restaurantInfo.phone}
                  />
                </label>
              </div>
              <label>
                Hours note
                <input
                  onChange={(event) =>
                    setRestaurantInfo((info) => ({ ...info, hoursNote: event.target.value }))
                  }
                  value={restaurantInfo.hoursNote}
                />
              </label>
              <div className="admin-dish-editor">
                {weekDays.map((day) => (
                  <label key={day}>
                    {day}
                    <input
                      onChange={(event) =>
                        setRestaurantInfo((info) => ({
                          ...info,
                          hoursByDay: { ...info.hoursByDay, [day]: event.target.value },
                        }))
                      }
                      required
                      value={restaurantInfo.hoursByDay[day] ?? ""}
                    />
                  </label>
                ))}
              </div>
            </form>
          </section>

          <section className="admin-card" id="account" aria-labelledby="account-title">
            <div className="admin-card-heading">
              <div>
                <p className="eyebrow">Staff access</p>
                <h2 id="account-title">Account settings</h2>
              </div>
            </div>
            <div className="account-settings-grid">
              <form className="admin-form account-panel" onSubmit={saveUsername}>
                <strong>Username</strong>
                <label>
                  New username
                  <input
                    autoComplete="username"
                    onChange={(event) => setAccountUsername(event.target.value)}
                    required
                    value={accountUsername}
                  />
                </label>
                <button disabled={busy} type="submit">
                  Save username
                </button>
              </form>

              <form className="admin-form account-panel" onSubmit={savePassword}>
                <strong>Password</strong>
                <label>
                  Current password
                  <input
                    autoComplete="current-password"
                    onChange={(event) =>
                      setPasswordDraft((draft) => ({
                        ...draft,
                        currentPassword: event.target.value,
                      }))
                    }
                    required
                    type="password"
                    value={passwordDraft.currentPassword}
                  />
                </label>
                <div className="two-col">
                  <label>
                    New password
                    <input
                      autoComplete="new-password"
                      onChange={(event) =>
                        setPasswordDraft((draft) => ({
                          ...draft,
                          newPassword: event.target.value,
                        }))
                      }
                      required
                      type="password"
                      value={passwordDraft.newPassword}
                    />
                  </label>
                  <label>
                    Confirm password
                    <input
                      autoComplete="new-password"
                      onChange={(event) =>
                        setPasswordDraft((draft) => ({
                          ...draft,
                          confirmPassword: event.target.value,
                        }))
                      }
                      required
                      type="password"
                      value={passwordDraft.confirmPassword}
                    />
                  </label>
                </div>
                <button disabled={busy} type="submit">
                  Save password
                </button>
              </form>
            </div>
          </section>
        </section>
      </main>
    </AdminGuard>
  );
}
