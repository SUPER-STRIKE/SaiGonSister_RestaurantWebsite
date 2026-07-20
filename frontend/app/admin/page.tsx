import Image from "next/image";
import Link from "next/link";
import { AdminGuard } from "../components/AdminGuard";
import { restaurantContent } from "../lib/restaurant-data";

const editableCategories = restaurantContent.menuTabs;
const editableDailySpecial = restaurantContent.dailySpecials[0];
const editableMenuItems = restaurantContent.menuItems.slice(0, 6);

export default function AdminPage() {
  return (
    <AdminGuard>
      <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/">
          <Image alt="" height={54} src="/logo.svg" width={54} />
          <span>
            <strong>SaiGonSister</strong>
            <small>Staff Console</small>
          </span>
        </Link>
        <div className="admin-nav-label">Workspace</div>
        <nav aria-label="Admin sections">
          <a href="#daily">Daily special</a>
          <a href="#menu-editor">Menu editor</a>
          <a href="#extras">Choices and extras</a>
          <a href="#categories">Categories</a>
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
            <span>Dishes</span>
            <strong>{restaurantContent.menuItems.length}</strong>
          </article>
          <article>
            <span>Categories</span>
            <strong>{restaurantContent.menuTabs.length}</strong>
          </article>
        </section>

        <section className="admin-card" id="daily" aria-labelledby="daily-admin-title">
          <div className="admin-card-heading">
            <div>
              <p className="eyebrow">Homepage</p>
              <h2 id="daily-admin-title">Daily specialty</h2>
            </div>
            <button type="button">Save daily special</button>
          </div>
          <form className="admin-form">
            <div className="two-col">
              <label>
                Day label
                <input defaultValue={editableDailySpecial.dayLabel} required />
              </label>
              <label>
                Price
                <input defaultValue={editableDailySpecial.price} required />
              </label>
            </div>
            <label>
              Dish name
              <input defaultValue={editableDailySpecial.name} required />
            </label>
            <label>
              Description
              <textarea defaultValue={editableDailySpecial.description} required rows={4} />
            </label>
            <label className="check-row">
              <input defaultChecked={editableDailySpecial.isVeganAvailable} type="checkbox" />
              Vegan option available
            </label>
          </form>
        </section>

        <section className="admin-card" id="extras" aria-labelledby="extras-admin-title">
          <div className="admin-card-heading">
            <div>
              <p className="eyebrow">Dish choices</p>
              <h2 id="extras-admin-title">Dish details and add-ons</h2>
              <p>In case not wanting to show detail, please leave blank.</p>
            </div>
            <button type="button">Save options</button>
          </div>
          <div className="option-editor-grid">
            {restaurantContent.menuItems
              .filter((item) => item.choices?.length || item.addOns?.length || item.allergens?.length)
              .slice(0, 4)
              .map((item) => (
                <article key={item.id}>
                  <strong>{item.name}</strong>
                  {(item.choices?.length ? item.choices : [{ label: "", options: [""] }]).map(
                    (choice) => (
                      <div className="choice-admin-block" key={`${item.id}-${choice.label}`}>
                        <label>
                          Custom headline
                          <input defaultValue={choice.label} />
                        </label>
                        <div className="choice-admin-list">
                          {(choice.options.length ? choice.options : [""]).slice(0, 4).map((option) => (
                            <label key={option || "new-option"}>
                              Info
                              <span>
                                <input defaultValue={option} />
                                <button aria-label="Add info" type="button">+</button>
                                <button aria-label="Remove info" type="button">-</button>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                  {item.addOns?.length ? (
                    <div className="addon-admin-block">
                      <strong>Add-ons</strong>
                      {item.addOns.slice(0, 4).map((addOn) => (
                        <label key={`${item.id}-${addOn.name}`}>
                          Name and price
                          <span>
                            <input defaultValue={addOn.name} />
                            <input defaultValue={addOn.price} />
                            <button aria-label="Add add-on" type="button">+</button>
                            <button aria-label="Remove add-on" type="button">-</button>
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="addon-admin-block">
                      <strong>Add-ons</strong>
                      <label>
                        Name and price
                        <span>
                          <input />
                          <input />
                          <button aria-label="Add add-on" type="button">+</button>
                          <button aria-label="Remove add-on" type="button">-</button>
                        </span>
                      </label>
                    </div>
                  )}
                  <label>
                    Allergies
                    <input defaultValue={item.allergens?.join(", ") ?? ""} />
                  </label>
                </article>
              ))}
          </div>
        </section>

        <section className="admin-card" id="menu-editor" aria-labelledby="menu-admin-title">
          <div className="admin-card-heading">
            <div>
              <p className="eyebrow">Editable menu</p>
              <h2 id="menu-admin-title">Menu items</h2>
            </div>
            <button type="button">Add dish</button>
          </div>
          <div className="admin-table">
            <div className="admin-table-head">
              <span>Dish</span>
              <span>Category</span>
              <span>Price</span>
              <span>Status</span>
            </div>
            {editableMenuItems.map((item) => (
              <article className="admin-table-row" key={item.id}>
                <label>
                  Name
                  <input defaultValue={item.name} required />
                </label>
                <label>
                  Category
                  <select defaultValue={item.category}>
                    {editableCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Price
                  <input defaultValue={item.price} required />
                </label>
                <div className="admin-row-actions">
                  <label className="check-row">
                    <input defaultChecked={item.isSignature} type="checkbox" />
                    Signature
                  </label>
                  <button type="button">Edit</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-grid">
          <article className="admin-card" id="categories">
            <div className="admin-card-heading">
              <div>
                <p className="eyebrow">Menu structure</p>
                <h2>Categories</h2>
              </div>
              <button type="button">Save categories</button>
            </div>
            <div className="category-editor">
              {editableCategories.map((category) => (
                <label key={category.id}>
                  {category.label}
                  <input defaultValue={category.note} required />
                </label>
              ))}
            </div>
          </article>

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
