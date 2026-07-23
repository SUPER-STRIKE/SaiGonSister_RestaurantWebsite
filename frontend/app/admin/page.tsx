"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminGuard } from "../components/AdminGuard";
import { restaurantContent } from "../lib/restaurant-data";

const editableCategories = restaurantContent.menuTabs;
const firstCategory = editableCategories[0];
const firstSection = restaurantContent.menuSections[firstCategory.id][0];
const allSections = Object.values(restaurantContent.menuSections).flat();
const allDishes = allSections.flatMap((section) => section.dishes);

export default function AdminPage() {
  const [accountNotice, setAccountNotice] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  function sendEmailCode() {
    setIsChangingEmail(true);
    setIsEmailCodeSent(true);
    setAccountNotice("Verification code sent to the new email.");
  }

  function verifyEmail() {
    setIsEmailVerified(true);
    setAccountNotice("Email verified. You can save the new email now.");
  }

  function saveEmailChange() {
    setAccountNotice(isEmailVerified ? "Email change saved." : "Verify the new email before saving.");
  }

  function savePasswordChange() {
    setAccountNotice("Password change saved.");
    setIsChangingPassword(false);
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
            <Link className="admin-view-site" href="/">View website</Link>
          </header>

          <section className="admin-summary" aria-label="Admin summary">
            <article>
              <span>Daily</span>
              <strong>{restaurantContent.dailySpecials.length}</strong>
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
              <button className="icon-command" type="button">+ Daily dish</button>
            </div>
            <div className="admin-daily-list">
              {restaurantContent.dailySpecials.map((dish) => (
                <form className="admin-form admin-daily-item" key={dish.id}>
                  <div className="admin-item-bar">
                    <strong>{dish.name}</strong>
                    <button aria-label={`Remove ${dish.name}`} className="icon-remove" type="button">-</button>
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
                      <input accept="image/*" type="file" />
                      <span>Choose from computer</span>
                    </label>
                    <label>
                      Image path
                      <input defaultValue={dish.image} />
                    </label>
                  </div>
                  <label className="check-row">
                    <input defaultChecked={dish.veganOptionAvailable} type="checkbox" />
                    Vegan option available
                  </label>
                  <button type="button">Save daily dish</button>
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
              <button type="button">Save focus</button>
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
                  <input accept="image/*" type="file" />
                  <span>Choose from computer</span>
                </label>
                <label>
                  Image path
                  <input defaultValue={restaurantContent.houseFocus.image} />
                </label>
              </div>
              <div className="link-picker">
                <strong>Chosen headers</strong>
                <div className="selected-link-list">
                  {restaurantContent.houseFocus.links.map((link) => (
                    <div className="selected-link-card" key={`${link.category}-${link.sectionId}`}>
                      <span>
                        {link.label}
                        <button aria-label={`Remove ${link.label}`} type="button">-</button>
                      </span>
                      <label className="upload-picker compact-upload">
                        Image
                        <input accept="image/*" type="file" />
                        <span>Choose image</span>
                      </label>
                      <label>
                        Image path
                        <input defaultValue={link.image} />
                      </label>
                    </div>
                  ))}
                </div>
                <label>
                  Add another header
                  <span className="inline-add">
                    <select defaultValue="">
                      <option value="">Choose header</option>
                      {editableCategories.flatMap((category) =>
                        restaurantContent.menuSections[category.id]
                          .filter(
                            (section) =>
                              !restaurantContent.houseFocus.links.some(
                                (link) => link.category === category.id && link.sectionId === section.id,
                              ),
                          )
                          .map((section) => (
                            <option key={`${category.id}-${section.id}`} value={`${category.id}-${section.id}`}>
                              {category.label} - {section.title}
                            </option>
                          )),
                      )}
                    </select>
                    <button aria-label="Add header link" type="button">+</button>
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
            </div>
            <form className="admin-form">
              <div className="two-col">
                <label>
                  Big category
                  <select defaultValue={firstCategory.id}>
                    {editableCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Header
                  <input defaultValue={firstSection.title} />
                </label>
              </div>
              <label>
                Header note
                <input defaultValue={firstSection.note ?? ""} />
              </label>
            </form>
          </section>

          <section className="admin-card" id="dish-details" aria-labelledby="dish-details-title">
            <div className="admin-card-heading">
              <div>
                <p className="eyebrow">Menu dishes</p>
                <h2 id="dish-details-title">Dish editor</h2>
                <p>Choose a category, type a header, then add dishes under that header.</p>
              </div>
              <button className="icon-command" type="button">+ Dish</button>
            </div>
            <div className="admin-dish-editor">
              {allDishes.slice(0, 8).map((dish) => (
                <form className="admin-form admin-dish-line" key={dish.id}>
                  <div className="admin-item-bar">
                    <strong>{dish.name}</strong>
                    <button aria-label={`Remove ${dish.name}`} className="icon-remove" type="button">-</button>
                  </div>
                  <div className="admin-dish-line-top">
                    <label>
                      Dish
                      <input defaultValue={dish.name} />
                    </label>
                    <label>
                      Price
                      <input defaultValue={dish.price} />
                    </label>
                  </div>
                  <label>
                    Description
                    <textarea defaultValue={dish.description} rows={2} />
                  </label>
                  <div className="admin-dish-line-top">
                    <label>
                      Allergies
                      <input defaultValue={dish.allergens?.join(", ") ?? ""} />
                    </label>
                    <label>
                      Tags
                      <input defaultValue={dish.tags?.join(", ") ?? ""} />
                    </label>
                  </div>
                  <div className="dish-control-grid">
                    <section className="dish-control-panel" aria-label={`${dish.name} options`}>
                      <div className="dish-control-heading">
                        <strong>Options</strong>
                        <button aria-label={`Add option headline for ${dish.name}`} type="button">+</button>
                      </div>
                      {(dish.options?.length ? dish.options : [{ label: "", options: [""] }]).map((option, optionIndex) => (
                        <div className="option-admin-card" key={`${dish.id}-option-${option.label || optionIndex}`}>
                          <div className="option-headline-row">
                            <label>
                              Option headline
                              <input defaultValue={option.label} />
                            </label>
                            <button aria-label={`Remove option headline ${optionIndex + 1}`} type="button">-</button>
                          </div>
                          <div className="option-info-list">
                            {(option.options.length ? option.options : [""]).map((choice, choiceIndex) => (
                              <div className="option-info-row" key={`${dish.id}-choice-${optionIndex}-${choice || choiceIndex}`}>
                                <label>
                                  Option info
                                  <input defaultValue={choice} />
                                </label>
                                <button aria-label={`Add option info ${choiceIndex + 1}`} type="button">+</button>
                                <button aria-label={`Remove option info ${choiceIndex + 1}`} type="button">-</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </section>

                    <section className="dish-control-panel" aria-label={`${dish.name} add-ons`}>
                      <div className="dish-control-heading">
                        <strong>Add-ons</strong>
                        <button aria-label={`Add add-on for ${dish.name}`} type="button">+</button>
                      </div>
                      <div className="addon-list-editor">
                        {(dish.addOns?.length ? dish.addOns : [{ name: "", price: "" }]).map((addOn, addOnIndex) => (
                          <div className="addon-editor-row" key={`${dish.id}-addon-${addOn.name || addOnIndex}`}>
                            <label>
                              Add-on
                              <input defaultValue={addOn.name} />
                            </label>
                            <label>
                              Price
                              <input defaultValue={addOn.price} />
                            </label>
                            <button aria-label={`Remove add-on ${addOnIndex + 1}`} type="button">-</button>
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
                  <p className="current-email">Current email: staff@saigonsister.ca</p>
                  <p>Verify the new email before saving the account change.</p>
                </div>
                <button onClick={() => setIsChangingEmail((value) => !value)} type="button">
                  Change email
                </button>
                {isChangingEmail ? (
                  <div className="account-reveal">
                    <div className="two-col">
                      <label>
                        Current email
                        <input defaultValue="staff@saigonsister.ca" type="email" />
                      </label>
                      <label>
                        New email
                        <input type="email" />
                      </label>
                    </div>
                    {isEmailCodeSent ? (
                      <div className="verify-row">
                        <label>
                          Verification code
                          <input inputMode="numeric" />
                        </label>
                        <button onClick={verifyEmail} type="button">Verify email</button>
                        <button disabled={!isEmailVerified} onClick={saveEmailChange} type="button">Save email</button>
                      </div>
                    ) : (
                      <button className="account-primary-action" onClick={sendEmailCode} type="button">
                        Send verification code
                      </button>
                    )}
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
                        <input type="password" />
                      </label>
                      <label>
                        New password
                        <input minLength={8} type="password" />
                      </label>
                      <label>
                        Retype new password
                        <input minLength={8} type="password" />
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
              <button type="button">Save details</button>
            </div>
            <form className="admin-form two-col">
              <label>
                Location
                <input defaultValue={restaurantContent.contact.location} required />
              </label>
              <label>
                Hours
                <input defaultValue={restaurantContent.contact.hours} required />
              </label>
              <label>
                Email
                <input defaultValue={restaurantContent.contact.email} required type="email" />
              </label>
              <label>
                Phone
                <input defaultValue={restaurantContent.contact.phone} required />
              </label>
            </form>
          </section>
        </section>
      </main>
    </AdminGuard>
  );
}
