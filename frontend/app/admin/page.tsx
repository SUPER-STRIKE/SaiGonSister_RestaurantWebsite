"use client";

import Link from "next/link";
import Image from "next/image";
import { type ChangeEvent, useMemo, useState } from "react";
import { AdminGuard } from "../components/AdminGuard";
import { clearStaffSession, staffEmail, staffPassword } from "../lib/staff-auth";
import {
  type DailySpecial,
  type DishAddOn,
  type DishOption,
  type HouseFocusLink,
  type MenuCategory,
  type MenuDish,
  type MenuSection,
  restaurantContent,
} from "../lib/restaurant-data";

const editableCategories = restaurantContent.menuTabs;
const firstCategory = editableCategories[0];
const firstSectionId = restaurantContent.menuSections[firstCategory.id][0]?.id ?? "";
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const contactStorageKey = "saigonSisterContactDetails";

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function cloneMenuSections() {
  return Object.fromEntries(
    Object.entries(restaurantContent.menuSections).map(([category, sections]) => [
      category,
      sections.map((section) => ({
        ...section,
        dishes: section.dishes.map((dish) => ({
          ...dish,
          tags: dish.tags ? [...dish.tags] : undefined,
          allergens: dish.allergens ? [...dish.allergens] : undefined,
          options: dish.options?.map((option) => ({ ...option, options: [...option.options] })),
          addOns: dish.addOns?.map((addOn) => ({ ...addOn })),
        })),
      })),
    ]),
  ) as Record<MenuCategory, MenuSection[]>;
}

function createBlankDish(): MenuDish {
  return {
    id: makeId("dish"),
    name: "New dish",
    description: "",
    price: "",
    allergens: [],
    tags: [],
    options: [],
    addOns: [],
    veganOptionAvailable: false,
  };
}

function createBlankDailyDish(): DailySpecial {
  return {
    ...createBlankDish(),
    id: makeId("daily"),
    dayLabel: "Today",
    image: "",
  };
}

export default function AdminPage() {
  const [dailyDishes, setDailyDishes] = useState<DailySpecial[]>(restaurantContent.dailySpecials);
  const [menuSections, setMenuSections] = useState<Record<MenuCategory, MenuSection[]>>(cloneMenuSections);
  const [headerCategory, setHeaderCategory] = useState<MenuCategory>(firstCategory.id);
  const [dishCategory, setDishCategory] = useState<MenuCategory>(firstCategory.id);
  const [dishSectionId, setDishSectionId] = useState(firstSectionId);
  const [houseFocusImage, setHouseFocusImage] = useState(restaurantContent.houseFocus.image);
  const [focusLinks, setFocusLinks] = useState<HouseFocusLink[]>(restaurantContent.houseFocus.links);
  const [selectedFocusHeader, setSelectedFocusHeader] = useState("");
  const [adminNotice, setAdminNotice] = useState("");
  const [accountNotice, setAccountNotice] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [restaurantLocation, setRestaurantLocation] = useState(restaurantContent.contact.location);
  const [restaurantEmail, setRestaurantEmail] = useState(restaurantContent.contact.email);
  const [restaurantPhone, setRestaurantPhone] = useState(restaurantContent.contact.phone);
  const [restaurantHours, setRestaurantHours] = useState(restaurantContent.contact.hoursByDay);
  const allSections = useMemo(() => Object.values(menuSections).flat(), [menuSections]);
  const allDishes = useMemo(() => allSections.flatMap((section) => section.dishes), [allSections]);
  const headerSections = menuSections[headerCategory];
  const dishSections = menuSections[dishCategory];
  const activeDishSection = dishSections.find((section) => section.id === dishSectionId) ?? dishSections[0];
  const activeDishItems = activeDishSection?.dishes ?? [];

  function showAdminNotice(message: string) {
    setAdminNotice(message);
  }

  function addDailyDish() {
    setDailyDishes((current) => [createBlankDailyDish(), ...current]);
    showAdminNotice("New daily dish added.");
  }

  function removeDailyDish(dishId: string, dishName: string) {
    setDailyDishes((current) => current.filter((dish) => dish.id !== dishId));
    showAdminNotice(`${dishName} removed from the daily list.`);
  }

  function updateDailyDish(dishId: string, patch: Partial<DailySpecial>) {
    setDailyDishes((current) =>
      current.map((dish) => (dish.id === dishId ? { ...dish, ...patch } : dish)),
    );
  }

  function chooseDailyImage(dishId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    updateDailyDish(dishId, { image: URL.createObjectURL(file) });
    showAdminNotice(`${file.name} selected.`);
  }

  function addDish() {
    if (!activeDishSection) {
      showAdminNotice("Choose a header first.");
      return;
    }

    const nextDish = createBlankDish();
    updateMenuSections((sections) =>
      sections.map((section) =>
        section.id === activeDishSection.id ? { ...section, dishes: [nextDish, ...section.dishes] } : section,
      ),
    );
    showAdminNotice("New dish added.");
  }

  function removeDish(dishId: string, dishName: string) {
    updateMenuSections((sections) =>
      sections.map((section) =>
        section.id === activeDishSection?.id
          ? { ...section, dishes: section.dishes.filter((dish) => dish.id !== dishId) }
          : section,
      ),
    );
    showAdminNotice(`${dishName} removed from the editor.`);
  }

  function updateMenuSections(updater: (sections: MenuSection[]) => MenuSection[]) {
    setMenuSections((current) => ({
      ...current,
      [dishCategory]: updater(current[dishCategory]),
    }));
  }

  function updateHeaderSections(updater: (sections: MenuSection[]) => MenuSection[]) {
    setMenuSections((current) => ({
      ...current,
      [headerCategory]: updater(current[headerCategory]),
    }));
  }

  function addHeader() {
    const nextHeader = {
      id: makeId("header"),
      title: "New header",
      note: "",
      dishes: [],
    };

    updateHeaderSections((sections) => [...sections, nextHeader]);
    setDishCategory(headerCategory);
    setDishSectionId(nextHeader.id);
    showAdminNotice("New header added.");
  }

  function removeHeader(sectionId: string, title: string) {
    updateHeaderSections((sections) => sections.filter((section) => section.id !== sectionId));
    setFocusLinks((current) => current.filter((link) => link.sectionId !== sectionId));
    if (dishSectionId === sectionId) {
      setDishSectionId(menuSections[headerCategory].find((section) => section.id !== sectionId)?.id ?? "");
    }
    showAdminNotice(`${title} removed.`);
  }

  function updateHeader(sectionId: string, patch: Partial<MenuSection>) {
    updateHeaderSections((sections) =>
      sections.map((section) => (section.id === sectionId ? { ...section, ...patch } : section)),
    );
  }

  function updateDish(dishId: string, patch: Partial<MenuDish>) {
    updateMenuSections((sections) =>
      sections.map((section) =>
        section.id === activeDishSection?.id
          ? {
              ...section,
              dishes: section.dishes.map((dish) => (dish.id === dishId ? { ...dish, ...patch } : dish)),
            }
          : section,
      ),
    );
  }

  function updateDishOptions(dishId: string, updater: (options: DishOption[]) => DishOption[]) {
    updateMenuSections((sections) =>
      sections.map((section) =>
        section.id === activeDishSection?.id
          ? {
              ...section,
              dishes: section.dishes.map((dish) =>
                dish.id === dishId ? { ...dish, options: updater(dish.options ?? []) } : dish,
              ),
            }
          : section,
      ),
    );
  }

  function addOptionHeadline(dishId: string, dishName: string) {
    updateDishOptions(dishId, (options) => [...options, { label: "", options: [""] }]);
    showAdminNotice(`New option headline added for ${dishName}.`);
  }

  function removeOptionHeadline(dishId: string, optionIndex: number) {
    updateDishOptions(dishId, (options) => options.filter((_, index) => index !== optionIndex));
    showAdminNotice("Option headline removed.");
  }

  function addOptionInfo(dishId: string, optionIndex: number) {
    updateDishOptions(dishId, (options) =>
      options.map((option, index) =>
        index === optionIndex ? { ...option, options: [...option.options, ""] } : option,
      ),
    );
    showAdminNotice("Option info added.");
  }

  function removeOptionInfo(dishId: string, optionIndex: number, choiceIndex: number) {
    updateDishOptions(dishId, (options) =>
      options.map((option, index) =>
        index === optionIndex
          ? { ...option, options: option.options.filter((_, innerIndex) => innerIndex !== choiceIndex) }
          : option,
      ),
    );
    showAdminNotice("Option info removed.");
  }

  function updateOptionHeadline(dishId: string, optionIndex: number, label: string) {
    updateDishOptions(dishId, (options) =>
      options.map((option, index) => (index === optionIndex ? { ...option, label } : option)),
    );
  }

  function updateOptionInfo(dishId: string, optionIndex: number, choiceIndex: number, value: string) {
    updateDishOptions(dishId, (options) =>
      options.map((option, index) =>
        index === optionIndex
          ? {
              ...option,
              options: option.options.map((choice, innerIndex) => (innerIndex === choiceIndex ? value : choice)),
            }
          : option,
      ),
    );
  }

  function updateDishAddOns(dishId: string, updater: (addOns: DishAddOn[]) => DishAddOn[]) {
    updateMenuSections((sections) =>
      sections.map((section) =>
        section.id === activeDishSection?.id
          ? {
              ...section,
              dishes: section.dishes.map((dish) =>
                dish.id === dishId ? { ...dish, addOns: updater(dish.addOns ?? []) } : dish,
              ),
            }
          : section,
      ),
    );
  }

  function addAddOn(dishId: string, dishName: string) {
    updateDishAddOns(dishId, (addOns) => [...addOns, { name: "", price: "" }]);
    showAdminNotice(`New add-on added for ${dishName}.`);
  }

  function removeAddOn(dishId: string, addOnIndex: number) {
    updateDishAddOns(dishId, (addOns) => addOns.filter((_, index) => index !== addOnIndex));
    showAdminNotice("Add-on removed.");
  }

  function updateAddOn(dishId: string, addOnIndex: number, patch: Partial<DishAddOn>) {
    updateDishAddOns(dishId, (addOns) =>
      addOns.map((addOn, index) => (index === addOnIndex ? { ...addOn, ...patch } : addOn)),
    );
  }

  function chooseDishCategory(category: MenuCategory) {
    setDishCategory(category);
    setDishSectionId(menuSections[category][0]?.id ?? "");
  }

  function addFocusHeader() {
    const [category, sectionId] = selectedFocusHeader.split(":");
    const categoryDetails = editableCategories.find((item) => item.id === category);
    const section = categoryDetails ? menuSections[categoryDetails.id].find((item) => item.id === sectionId) : null;

    if (!categoryDetails || !section) {
      showAdminNotice("Choose a header first.");
      return;
    }

    setFocusLinks((current) => [
      ...current,
      {
        label: section.title,
        category: categoryDetails.id,
        sectionId: section.id,
        image: "",
      },
    ]);
    setSelectedFocusHeader("");
    showAdminNotice(`${section.title} added to focus links.`);
  }

  function removeFocusHeader(sectionId: string, label: string) {
    setFocusLinks((current) => current.filter((link) => link.sectionId !== sectionId));
    showAdminNotice(`${label} removed from focus links.`);
  }

  function chooseFocusImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setHouseFocusImage(URL.createObjectURL(file));
    showAdminNotice(`${file.name} selected.`);
  }

  function chooseFocusLinkImage(sectionId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFocusLinks((current) =>
      current.map((link) =>
        link.sectionId === sectionId ? { ...link, image: URL.createObjectURL(file) } : link,
      ),
    );
    showAdminNotice(`${file.name} selected.`);
  }

  function sendEmailCode() {
    setIsChangingEmail(true);
    setIsEmailCodeSent(true);
    setIsEmailVerified(false);
    setNewEmail("");
    setEmailCode("");
    setAccountNotice(`Verification code sent to ${staffEmail}.`);
  }

  function verifyEmail() {
    if (!emailCode.trim()) {
      setAccountNotice("Enter the verification code first.");
      return;
    }

    setIsEmailVerified(true);
    setAccountNotice("Email verified. You can save the new email now.");
  }

  function saveEmailChange() {
    if (!newEmail.trim()) {
      setAccountNotice("Enter the new email first.");
      return;
    }

    setAccountNotice(isEmailVerified ? "Email change saved." : "Verify the new email before saving.");
  }

  function savePasswordChange() {
    if (!currentPassword) {
      setAccountNotice("Enter the current password first.");
      return;
    }

    if (currentPassword !== staffPassword) {
      setAccountNotice("Current password is not correct.");
      return;
    }

    if (!newPassword) {
      setAccountNotice("Enter the new password first.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setAccountNotice("New passwords do not match.");
      return;
    }

    setAccountNotice("Password change saved.");
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  function logOut() {
    clearStaffSession();
    window.location.href = "/login";
  }

  function toggleEmailChange() {
    setIsChangingEmail((value) => !value);
    setIsEmailCodeSent(false);
    setIsEmailVerified(false);
    setEmailCode("");
    setNewEmail("");
    setAccountNotice("");
  }

  function updateRestaurantHour(day: string, value: string) {
    setRestaurantHours((current) => ({
      ...current,
      [day]: value,
    }));
  }

  function saveRestaurantDetails() {
    window.localStorage.setItem(
      contactStorageKey,
      JSON.stringify({
        location: restaurantLocation,
        email: restaurantEmail,
        phone: restaurantPhone,
        hoursByDay: restaurantHours,
      }),
    );
    showAdminNotice("Restaurant details saved.");
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
            <a href="#house-focus">House focus</a>
            <a href="#menu-builder">Menu builder</a>
            <a href="#dish-details">Dish details</a>
            <a href="#account">Account</a>
            <a href="#settings">Restaurant info</a>
          </nav>
        </aside>

        <section className="admin-main">
          <header className="admin-header">
            <div>
              <p className="eyebrow">Staff workspace</p>
              <h1>Admin menu editor</h1>
            </div>
            <div className="admin-header-actions">
              <Link className="admin-view-site" href="/">View website</Link>
              <button className="admin-view-site" onClick={logOut} type="button">Log out</button>
            </div>
          </header>

          {adminNotice ? <p className="account-notice">{adminNotice}</p> : null}

          <section className="admin-summary" aria-label="Admin summary">
            <article>
              <span>Daily</span>
              <strong>{dailyDishes.length}</strong>
            </article>
            <article>
              <span>Headers</span>
              <strong>{allSections.length}</strong>
            </article>
            <article>
              <span>Dishes</span>
              <strong>{allDishes.length}</strong>
            </article>
          </section>

          <section className="admin-card" id="daily" aria-labelledby="daily-admin-title">
            <div className="admin-card-heading">
              <div>
                <p className="eyebrow">Homepage</p>
              <h2 id="daily-admin-title">Daily specialty</h2>
              <p>In case not wanting to show detail, please leave blank.</p>
            </div>
              <button className="icon-command" onClick={addDailyDish} type="button">+ Daily dish</button>
            </div>
            <div className="admin-daily-list">
              {dailyDishes.map((dish) => (
                <form className="admin-form admin-daily-item" key={dish.id}>
                  <div className="admin-item-bar">
                    <strong>{dish.name}</strong>
                    <button aria-label={`Remove ${dish.name}`} className="icon-remove" onClick={() => removeDailyDish(dish.id, dish.name)} type="button">-</button>
                  </div>
                  <div className="two-col">
                    <label>
                      Dish name
                      <input defaultValue={dish.name} required />
                    </label>
                    <label>
                      Price
                      <input defaultValue={dish.price} required />
                    </label>
                  </div>
                  <label>
                    Description
                    <textarea defaultValue={dish.description} required rows={3} />
                  </label>
                  <div className="two-col">
                    <label>
                      Allergies
                      <input defaultValue={dish.allergens?.join(", ") ?? ""} />
                    </label>
                    <label>
                      Tags
                      <input defaultValue={dish.tags?.join(", ") ?? ""} />
                    </label>
                  </div>
                  <div className="two-col">
                    <label className="upload-picker">
                      Upload image
                      <input accept="image/*" onChange={(event) => chooseDailyImage(dish.id, event)} type="file" />
                      <span>Choose from computer</span>
                    </label>
                    <label>
                      Image path
                      <input onChange={(event) => updateDailyDish(dish.id, { image: event.target.value })} value={dish.image} />
                    </label>
                  </div>
                  {dish.image ? <Image alt="" className="admin-image-preview" height={180} src={dish.image} unoptimized width={240} /> : null}
                  <label className="check-row">
                    <input defaultChecked={dish.veganOptionAvailable} type="checkbox" />
                    Vegan option available
                  </label>
                  <button onClick={() => showAdminNotice(`${dish.name} saved.`)} type="button">Save daily dish</button>
                </form>
              ))}
            </div>
          </section>

          <section className="admin-card" id="house-focus" aria-labelledby="house-focus-title">
            <div className="admin-card-heading">
              <div>
                <p className="eyebrow">Menu feature</p>
                <h2 id="house-focus-title">House focus block</h2>
                <p>Choose the menu headers that appear as quick links.</p>
              </div>
              <button onClick={() => showAdminNotice("House focus saved.")} type="button">Save focus</button>
            </div>
            <form className="admin-form">
              <label>
                Main header
                <input defaultValue={restaurantContent.houseFocus.title} />
              </label>
              <label>
                Description
                <textarea defaultValue={restaurantContent.houseFocus.description} rows={3} />
              </label>
              <div className="two-col">
                <label className="upload-picker">
                  Upload image
                  <input accept="image/*" onChange={chooseFocusImage} type="file" />
                  <span>Choose from computer</span>
                </label>
                <label>
                  Image path
                  <input onChange={(event) => setHouseFocusImage(event.target.value)} value={houseFocusImage} />
                </label>
              </div>
              {houseFocusImage ? <Image alt="" className="admin-image-preview wide-preview" height={236} src={houseFocusImage} unoptimized width={420} /> : null}
              <div className="link-picker">
                <strong>Chosen headers</strong>
                <div className="selected-link-list">
                  {focusLinks.map((link) => (
                    <div className="selected-link-card" key={`${link.category}-${link.sectionId}`}>
                      <span>
                        {link.label}
                        <button aria-label={`Remove ${link.label}`} onClick={() => removeFocusHeader(link.sectionId, link.label)} type="button">-</button>
                      </span>
                      <label className="upload-picker compact-upload">
                        Image
                        <input accept="image/*" onChange={(event) => chooseFocusLinkImage(link.sectionId, event)} type="file" />
                        <span>Choose image</span>
                      </label>
                      <label>
                        Image path
                        <input
                          onChange={(event) =>
                            setFocusLinks((current) =>
                              current.map((item) =>
                                item.sectionId === link.sectionId ? { ...item, image: event.target.value } : item,
                              ),
                            )
                          }
                          value={link.image}
                        />
                      </label>
                      {link.image ? <Image alt="" className="admin-image-preview small-preview" height={105} src={link.image} unoptimized width={140} /> : null}
                    </div>
                  ))}
                </div>
                <label>
                  Add another header
                  <span className="inline-add">
                    <select onChange={(event) => setSelectedFocusHeader(event.target.value)} value={selectedFocusHeader}>
                      <option value="">Choose header</option>
                      {editableCategories.flatMap((category) =>
                        menuSections[category.id]
                          .filter(
                            (section) =>
                              !focusLinks.some(
                                (link) => link.category === category.id && link.sectionId === section.id,
                              ),
                          )
                          .map((section) => (
                            <option key={`${category.id}-${section.id}`} value={`${category.id}:${section.id}`}>
                              {category.label} - {section.title}
                            </option>
                          )),
                      )}
                    </select>
                    <button aria-label="Add header link" onClick={addFocusHeader} type="button">+</button>
                  </span>
                </label>
              </div>
            </form>
          </section>

          <section className="admin-card" id="menu-builder" aria-labelledby="menu-builder-title">
            <div className="admin-card-heading">
              <div>
                <p className="eyebrow">Menu structure</p>
                <h2 id="menu-builder-title">Category and header</h2>
              </div>
              <button className="icon-command" onClick={addHeader} type="button">+ Header</button>
            </div>
            <form className="admin-form">
              <label>
                Big category
                <select onChange={(event) => setHeaderCategory(event.target.value as MenuCategory)} value={headerCategory}>
                  {editableCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="header-editor-list">
                {headerSections.map((section) => (
                  <section className="header-editor-card" key={section.id}>
                    <div className="admin-item-bar">
                      <strong>{section.title || "New header"}</strong>
                      <button aria-label={`Remove ${section.title}`} className="icon-remove" onClick={() => removeHeader(section.id, section.title)} type="button">-</button>
                    </div>
                    <div className="two-col">
                      <label>
                        Header
                        <input onChange={(event) => updateHeader(section.id, { title: event.target.value })} value={section.title} />
                      </label>
                      <label>
                        Header note
                        <input onChange={(event) => updateHeader(section.id, { note: event.target.value })} value={section.note ?? ""} />
                      </label>
                    </div>
                  </section>
                ))}
              </div>
            </form>
          </section>

          <section className="admin-card" id="dish-details" aria-labelledby="dish-details-title">
            <div className="admin-card-heading">
              <div>
                <p className="eyebrow">Menu dishes</p>
                <h2 id="dish-details-title">Dish editor</h2>
                <p>Choose a category and header, then edit the dishes under it.</p>
              </div>
              <button className="icon-command" onClick={addDish} type="button">+ Dish</button>
            </div>
            <div className="admin-form dish-editor-picker">
              <div className="two-col">
                <label>
                  Big category
                  <select onChange={(event) => chooseDishCategory(event.target.value as MenuCategory)} value={dishCategory}>
                    {editableCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Header
                  <select onChange={(event) => setDishSectionId(event.target.value)} value={activeDishSection?.id ?? ""}>
                    {dishSections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <div className="admin-dish-editor">
              {activeDishItems.map((dish) => (
                <form className="admin-form admin-dish-line" key={dish.id}>
                  <div className="admin-item-bar">
                    <strong>{dish.name}</strong>
                    <button aria-label={`Remove ${dish.name}`} className="icon-remove" onClick={() => removeDish(dish.id, dish.name)} type="button">-</button>
                  </div>
                  <div className="admin-dish-line-top">
                    <label>
                      Dish
                      <input onChange={(event) => updateDish(dish.id, { name: event.target.value })} value={dish.name} />
                    </label>
                    <label>
                      Price
                      <input onChange={(event) => updateDish(dish.id, { price: event.target.value })} value={dish.price} />
                    </label>
                  </div>
                  <label>
                    Description
                    <textarea onChange={(event) => updateDish(dish.id, { description: event.target.value })} rows={2} value={dish.description} />
                  </label>
                  <div className="admin-dish-line-top">
                    <label>
                      Allergies
                      <input
                        onChange={(event) =>
                          updateDish(dish.id, {
                            allergens: event.target.value
                              .split(",")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="Optional, leave blank for no allergies."
                        value={dish.allergens?.join(", ") ?? ""}
                      />
                    </label>
                    <label>
                      Tags
                      <input
                        onChange={(event) =>
                          updateDish(dish.id, {
                            tags: event.target.value
                              .split(",")
                              .map((item) => item.trim())
                              .filter(Boolean) as MenuDish["tags"],
                          })
                        }
                        placeholder="Optional, leave blank to hide tags."
                        value={dish.tags?.join(", ") ?? ""}
                      />
                    </label>
                  </div>
                  <div className="dish-control-grid">
                    <section className="dish-control-panel" aria-label={`${dish.name} options`}>
                      <div className="dish-control-heading">
                        <strong>Add optional headline</strong>
                        <button aria-label={`Add option headline for ${dish.name}`} onClick={() => addOptionHeadline(dish.id, dish.name)} type="button">+</button>
                      </div>
                      {(dish.options?.length ? dish.options : [{ label: "", options: [""] }]).map((option, optionIndex) => (
                        <div className="option-admin-card" key={`${dish.id}-option-${option.label || optionIndex}`}>
                          <div className="option-headline-row">
                            <label>
                              Option headline
                              <input
                                onChange={(event) => updateOptionHeadline(dish.id, optionIndex, event.target.value)}
                                placeholder="Example: Filling, egg style, noodle style."
                                value={option.label}
                              />
                            </label>
                            <button aria-label={`Remove option headline ${optionIndex + 1}`} onClick={() => removeOptionHeadline(dish.id, optionIndex)} type="button">-</button>
                          </div>
                          <div className="option-info-list">
                            <div className="option-info-list-heading">
                              <strong>Option info</strong>
                              <button aria-label={`Add option info for ${option.label || dish.name}`} onClick={() => addOptionInfo(dish.id, optionIndex)} type="button">+</button>
                            </div>
                            {(option.options.length ? option.options : [""]).map((choice, choiceIndex) => (
                              <div className="option-info-row" key={`${dish.id}-choice-${optionIndex}-${choice || choiceIndex}`}>
                                <label>
                                  <span className="sr-only">Option info</span>
                                  <input
                                    onChange={(event) => updateOptionInfo(dish.id, optionIndex, choiceIndex, event.target.value)}
                                    placeholder="Optional, leave blank to hide this choice."
                                    value={choice}
                                  />
                                </label>
                                <button aria-label={`Remove option info ${choiceIndex + 1}`} onClick={() => removeOptionInfo(dish.id, optionIndex, choiceIndex)} type="button">-</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </section>

                    <section className="dish-control-panel" aria-label={`${dish.name} add-ons`}>
                      <div className="dish-control-heading">
                        <strong>Add-ons</strong>
                        <button aria-label={`Add add-on for ${dish.name}`} onClick={() => addAddOn(dish.id, dish.name)} type="button">+</button>
                      </div>
                      <div className="addon-list-editor">
                        {(dish.addOns?.length ? dish.addOns : [{ name: "", price: "" }]).map((addOn, addOnIndex) => (
                          <div className="addon-editor-row" key={`${dish.id}-addon-${addOn.name || addOnIndex}`}>
                            <label>
                              Add-on
                              <input
                                onChange={(event) => updateAddOn(dish.id, addOnIndex, { name: event.target.value })}
                                value={addOn.name}
                              />
                            </label>
                            <label>
                              Price
                              <input
                                onChange={(event) => updateAddOn(dish.id, addOnIndex, { price: event.target.value })}
                                value={addOn.price}
                              />
                            </label>
                            <button aria-label={`Remove add-on ${addOnIndex + 1}`} onClick={() => removeAddOn(dish.id, addOnIndex)} type="button">-</button>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                  <label className="check-row">
                    <input defaultChecked={dish.veganOptionAvailable} type="checkbox" />
                    Vegan option available
                  </label>
                </form>
              ))}
            </div>
          </section>

          <section className="admin-card" id="account" aria-labelledby="account-title">
            <div className="admin-card-heading">
              <div>
                <p className="eyebrow">Staff login</p>
                <h2 id="account-title">Account settings</h2>
              </div>
            </div>
            <form className="admin-form account-settings-panel">
              {accountNotice ? <p className="account-notice">{accountNotice}</p> : null}

              <section className="account-action-card">
                <div>
                  <strong>Email</strong>
                  <p className="current-email">Current email: {staffEmail}</p>
                  <p>Verify the new email before saving the account change.</p>
                </div>
                <button onClick={toggleEmailChange} type="button">
                  Change email
                </button>
                {isChangingEmail ? (
                  <div className="account-reveal">
                    {!isEmailCodeSent ? (
                      <button className="account-primary-action" onClick={sendEmailCode} type="button">
                        Send verification code
                      </button>
                    ) : null}
                    {isEmailCodeSent && !isEmailVerified ? (
                      <div className="verify-row">
                        <label>
                          Verification code
                          <input inputMode="numeric" onChange={(event) => setEmailCode(event.target.value)} value={emailCode} />
                        </label>
                        <button onClick={verifyEmail} type="button">Verify email</button>
                      </div>
                    ) : null}
                    {isEmailVerified ? (
                      <div className="verify-row">
                        <label>
                          New email
                          <input onChange={(event) => setNewEmail(event.target.value)} type="email" value={newEmail} />
                        </label>
                        <button onClick={saveEmailChange} type="button">Save email</button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </section>

              <section className="account-action-card">
                <div>
                  <strong>Password</strong>
                  <p>Confirm the current password before setting a new one.</p>
                </div>
                <button onClick={() => setIsChangingPassword((value) => !value)} type="button">
                  Change password
                </button>
                {isChangingPassword ? (
                  <div className="account-reveal">
                    <div className="three-col">
                      <label>
                        Current password
                        <input onChange={(event) => setCurrentPassword(event.target.value)} type="password" value={currentPassword} />
                      </label>
                      <label>
                        New password
                        <input onChange={(event) => setNewPassword(event.target.value)} type="password" value={newPassword} />
                      </label>
                      <label>
                        Retype new password
                        <input onChange={(event) => setConfirmPassword(event.target.value)} type="password" value={confirmPassword} />
                      </label>
                    </div>
                    <button className="account-primary-action" onClick={savePasswordChange} type="button">
                      Save password
                    </button>
                  </div>
                ) : null}
              </section>
            </form>
          </section>

          <section className="admin-card" id="settings" aria-labelledby="settings-title">
            <div className="admin-card-heading">
              <div>
                <p className="eyebrow">Restaurant details</p>
                <h2 id="settings-title">Contact and hours</h2>
              </div>
              <button onClick={saveRestaurantDetails} type="button">Save details</button>
            </div>
            <form className="admin-form">
              <div className="two-col">
                <label>
                  Location
                  <input onChange={(event) => setRestaurantLocation(event.target.value)} required value={restaurantLocation} />
                </label>
                <label>
                  Email
                  <input onChange={(event) => setRestaurantEmail(event.target.value)} required type="email" value={restaurantEmail} />
                </label>
              </div>
              <label>
                Phone
                <input onChange={(event) => setRestaurantPhone(event.target.value)} required value={restaurantPhone} />
              </label>
              <div className="hours-editor-grid">
                {weekDays.map((day) => (
                  <label key={day}>
                    {day}
                    <input onChange={(event) => updateRestaurantHour(day, event.target.value)} value={restaurantHours[day]} />
                  </label>
                ))}
              </div>
            </form>
          </section>
        </section>
      </main>
    </AdminGuard>
  );
}
