import Image from "next/image";
import Link from "next/link";
import { restaurantContent } from "../lib/restaurant-data";

const editableCategories = restaurantContent.menuTabs;
const editableDailySpecial = restaurantContent.dailySpecials[0];
const editableMenuItems = restaurantContent.menuItems.slice(0, 6);

export default function AdminPage() {
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/">
          <Image alt="" height={54} src="/logo.svg" width={54} />
          <span>
            <strong>All@One</strong>
            <small>Staff Console</small>
          </span>
        </Link>
        <div className="admin-nav-label">Workspace</div>
        <nav aria-label="Admin sections">
          <a href="#daily">Daily special</a>
          <a href="#menu-editor">Menu editor</a>
          <a href="#categories">Categories</a>
          <a href="#media">Images</a>
          <a href="#settings">Restaurant info</a>
        </nav>
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <div>
            <p className="eyebrow">Staff workspace</p>
            <h1>Admin menu editor</h1>
            <p>
              Manage daily specials, menu items, categories, images, hours, and restaurant
              contact details from one clean workspace.
            </p>
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

        <section className="admin-card login-card" aria-labelledby="login-title">
          <div>
            <h2 id="login-title">Login</h2>
            <p>Staff access for the restaurant team.</p>
          </div>
          <form className="admin-form two-col">
            <label>
              Email
              <input type="email" />
            </label>
            <label>
              Password
              <input type="password" />
            </label>
            <button type="button">Sign in</button>
          </form>
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
                <input defaultValue={editableDailySpecial.dayLabel} />
              </label>
              <label>
                Price
                <input defaultValue={editableDailySpecial.price} />
              </label>
            </div>
            <label>
              Dish name
              <input defaultValue={editableDailySpecial.name} />
            </label>
            <label>
              Description
              <textarea defaultValue={editableDailySpecial.description} rows={4} />
            </label>
            <label className="check-row">
              <input defaultChecked={editableDailySpecial.isVeganAvailable} type="checkbox" />
              Vegan option available
            </label>
          </form>
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
                  <input defaultValue={item.name} />
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
                  <input defaultValue={item.price} />
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
                  <input defaultValue={category.note} />
                </label>
              ))}
            </div>
          </article>

          <article className="admin-card" id="media">
            <div className="admin-card-heading">
              <div>
                <p className="eyebrow">Decorative</p>
                <h2>Images</h2>
              </div>
              <button type="button">Upload image</button>
            </div>
            <div className="image-drop">
              <span>Hero / carousel image</span>
              <p>Use this area for homepage and gallery images.</p>
            </div>
            <label>
              Image URL
              <input defaultValue="/vietnamese-rolls-hero.png" />
            </label>
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
              <input defaultValue={restaurantContent.contact.location} />
            </label>
            <label>
              Hours
              <input defaultValue={restaurantContent.contact.hours} />
            </label>
            <label>
              Email
              <input defaultValue={restaurantContent.contact.email} />
            </label>
            <label>
              Phone
              <input defaultValue={restaurantContent.contact.phone} />
            </label>
          </form>
        </section>
      </section>
    </main>
  );
}
