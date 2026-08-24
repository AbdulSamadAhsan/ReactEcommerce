import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Search,
  ShoppingCart,
  UserRound,
  SlidersHorizontal,
  X,
  ArrowLeft,
  ArrowRight,
  Mail,
  Menu,
  Check,
} from "lucide-react";

import "./Shop.css";

const products = [
  {
    id: 1,
    name: "Gradient Graphic T-shirt",
    image: "/assets/related-2.jpg",
    rating: 3.5,
    price: 145,
  },
  {
    id: 2,
    name: "Polo with Tipping Details",
    image: "/assets/related-3.jpg",
    rating: 4.5,
    price: 180,
  },
  {
    id: 3,
    name: "Black Striped T-shirt",
    image: "/assets/related-4.jpg",
    rating: 5,
    price: 120,
    oldPrice: 150,
    discount: 30,
  },
  {
    id: 4,
    name: "Skinny Fit Jeans",
    image: "/assets/skinny-jeans.png",
    rating: 3.5,
    price: 240,
    oldPrice: 260,
    discount: 20,
  },
  {
    id: 5,
    name: "Checkered Shirt",
    image: "/assets/main-shirt.jpg",
    rating: 4.5,
    price: 180,
  },
  {
    id: 6,
    name: "Sleeve Striped T-shirt",
    image: "/assets/related-1.jpg",
    rating: 4.5,
    price: 130,
    oldPrice: 160,
    discount: 20,
  },
  {
    id: 7,
    name: "Vertical Striped Shirt",
    image: "/assets/thumb-front.jpg",
    rating: 5,
    price: 212,
    oldPrice: 232,
    discount: 20,
  },
  {
    id: 8,
    name: "Courage Graphic T-shirt",
    image: "/assets/party.jpg",
    rating: 4,
    price: 145,
  },
  {
    id: 9,
    name: "Loose Fit Bermuda Shorts",
    image: "/assets/gym.jpg",
    rating: 3,
    price: 80,
  },
];

const colors = [
  "#00c12b",
  "#f50606",
  "#f5dd06",
  "#f57906",
  "#06caf5",
  "#063af5",
  "#7d06f5",
  "#f506a4",
  "#ffffff",
  "#000000",
];

const sizes = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
  "4X-Large",
];

function Rating({ value }) {
  const fullStars = Math.floor(value);

  return (
    <div className="shop-rating">
      <div className="shop-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= fullStars ? "active" : ""}
          >
            ★
          </span>
        ))}
      </div>

      <span className="shop-rating-value">
        {value}/5
      </span>
    </div>
  );
}

function FilterContent({ closeMobile }) {
  const [selectedColor, setSelectedColor] = useState("#063af5");
  const [selectedSize, setSelectedSize] = useState("Large");

  return (
    <div className="shop-filter-content">
      <div className="shop-filter-heading">
        <h3>Filters</h3>

        <SlidersHorizontal size={20} />

        {closeMobile && (
          <button
            className="shop-filter-close"
            onClick={closeMobile}
          >
            <X size={22} />
          </button>
        )}
      </div>

      <div className="shop-filter-divider" />

      <div className="shop-filter-links">
        {["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"].map(
          (item) => (
            <button key={item}>
              <span>{item}</span>
              <ChevronRight size={17} />
            </button>
          )
        )}
      </div>

      <div className="shop-filter-divider" />

      <div className="shop-filter-section">
        <div className="shop-filter-section-heading">
          <strong>Price</strong>
          <ChevronUp size={18} />
        </div>

        <div className="shop-price-filter">
          <div className="shop-price-track">
            <div className="shop-price-active" />

            <span className="shop-price-dot shop-price-left" />
            <span className="shop-price-dot shop-price-right" />
          </div>

          <div className="shop-price-values">
            <span>$50</span>
            <span>$200</span>
          </div>
        </div>
      </div>

      <div className="shop-filter-divider" />

      <div className="shop-filter-section">
        <div className="shop-filter-section-heading">
          <strong>Colors</strong>
          <ChevronUp size={18} />
        </div>

        <div className="shop-color-grid">
          {colors.map((color) => (
            <button
              key={color}
              className="shop-color"
              style={{
                backgroundColor: color,
              }}
              onClick={() => setSelectedColor(color)}
            >
              {selectedColor === color && (
                <Check
                  size={17}
                  color={
                    color === "#ffffff" ||
                    color === "#f5dd06"
                      ? "#111"
                      : "#fff"
                  }
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="shop-filter-divider" />

      <div className="shop-filter-section">
        <div className="shop-filter-section-heading">
          <strong>Size</strong>
          <ChevronUp size={18} />
        </div>

        <div className="shop-size-grid">
          {sizes.map((size) => (
            <button
              key={size}
              className={
                selectedSize === size ? "active" : ""
              }
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="shop-filter-divider" />

      <div className="shop-filter-section">
        <div className="shop-filter-section-heading">
          <strong>Dress Style</strong>
          <ChevronUp size={18} />
        </div>

        <div className="shop-filter-links shop-dress-links">
          {["Casual", "Formal", "Party", "Gym"].map(
            (item) => (
              <button key={item}>
                <span>{item}</span>
                <ChevronRight size={17} />
              </button>
            )
          )}
        </div>
      </div>

      <button
        className="shop-apply-filter"
        onClick={() => closeMobile && closeMobile()}
      >
        Apply Filter
      </button>
    </div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div className="shop-footer-column">
      <h4>{title}</h4>

      {links.map((link) => (
        <a href="#" key={link}>
          {link}
        </a>
      ))}
    </div>
  );
}

export default function Shop() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="shop-page">
      <div className="shop-promo">
        <span>
          Sign up and get 20% off to your first order.{" "}
          <u>Sign Up Now</u>
        </span>

        <X size={17} />
      </div>

      <header className="shop-header shop-shell">
        <button
          className="shop-mobile-menu-button"
          onClick={() =>
            setMobileMenuOpen((current) => !current)
          }
        >
          {mobileMenuOpen ? (
            <X size={23} />
          ) : (
            <Menu size={23} />
          )}
        </button>

        <a href="/" className="shop-logo">
          SHOP.CO
        </a>

        <nav
          className={
            mobileMenuOpen
              ? "shop-nav shop-nav-open"
              : "shop-nav"
          }
        >
          <a href="#">
            Shop
            <ChevronDown size={14} />
          </a>

          <a href="#">On Sale</a>
          <a href="#">New Arrivals</a>
          <a href="#">Brands</a>
        </nav>

        <div className="shop-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search for products..."
          />
        </div>

        <div className="shop-header-icons">
          <Search
            className="shop-mobile-search"
            size={21}
          />

          <ShoppingCart size={21} />
          <UserRound size={21} />
        </div>
      </header>

      <div className="shop-header-line shop-shell" />

      <main className="shop-shell">
        <div className="shop-breadcrumb">
          <span>Home</span>

          <ChevronRight size={15} />

          <b>Casual</b>
        </div>

        <div className="shop-main-layout">
          <aside className="shop-sidebar">
            <FilterContent />
          </aside>

          <section className="shop-products-section">
            <div className="shop-products-top">
              <h1>Casual</h1>

              <div className="shop-sort">
                <span className="shop-results-text">
                  Showing 1-10 of 100 Products
                </span>

                <span className="shop-sort-text">
                  Sort by:
                  <strong>Most Popular</strong>
                  <ChevronDown size={15} />
                </span>

                <button
                  className="shop-mobile-filter-button"
                  onClick={() => setFilterOpen(true)}
                >
                  <SlidersHorizontal size={20} />
                </button>
              </div>
            </div>

            <div className="shop-products-grid">
              {products.map((product) => (
                <article
                  className="shop-product-card"
                  key={product.id}
                >
                  <div className="shop-product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  </div>

                  <h3>{product.name}</h3>

                  <Rating value={product.rating} />

                  <div className="shop-product-price">
                    <strong>${product.price}</strong>

                    {product.oldPrice && (
                      <del>
                        ${product.oldPrice}
                      </del>
                    )}

                    {product.discount && (
                      <span className="shop-discount">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="shop-pagination">
              <button className="shop-page-nav">
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>

              <div className="shop-page-numbers">
                <button className="active">1</button>
                <button>2</button>
                <button>3</button>
                <button>...</button>
                <button>8</button>
                <button>9</button>
                <button>10</button>
              </div>

              <button className="shop-page-nav">
                <span>Next</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </section>
        </div>
      </main>

      <section className="shop-newsletter shop-shell">
        <h2>
          STAY UP TO DATE ABOUT
          <br />
          OUR LATEST OFFERS
        </h2>

        <div className="shop-newsletter-form">
          <label>
            <Mail size={18} />

            <input
              type="email"
              placeholder="Enter your email address"
            />
          </label>

          <button>
            Subscribe to Newsletter
          </button>
        </div>
      </section>

      <footer className="shop-footer">
        <div className="shop-footer-grid shop-shell">
          <div className="shop-footer-about">
            <h2>SHOP.CO</h2>

            <p>
              We have clothes that suits your style and
              which you're proud to wear. From women to
              men.
            </p>

            <div className="shop-socials">
              <button>𝕏</button>
              <button>f</button>
              <button>◎</button>
              <button>G</button>
            </div>
          </div>

          <FooterColumn
            title="COMPANY"
            links={[
              "About",
              "Features",
              "Works",
              "Career",
            ]}
          />

          <FooterColumn
            title="HELP"
            links={[
              "Customer Support",
              "Delivery Details",
              "Terms & Conditions",
              "Privacy Policy",
            ]}
          />

          <FooterColumn
            title="FAQ"
            links={[
              "Account",
              "Manage Deliveries",
              "Orders",
              "Payments",
            ]}
          />

          <FooterColumn
            title="RESOURCES"
            links={[
              "Free eBooks",
              "Development Tutorial",
              "How to - Blog",
              "Youtube Playlist",
            ]}
          />
        </div>

        <div className="shop-footer-bottom shop-shell">
          <span>
            Shop.co © 2000-2025, All Rights Reserved
          </span>

          <div className="shop-payment-methods">
            <b>VISA</b>
            <b>●●</b>
            <b>PayPal</b>
            <b>Pay</b>
            <b>G Pay</b>
          </div>
        </div>
      </footer>

      {filterOpen && (
        <>
          <div
            className="shop-filter-overlay"
            onClick={() => setFilterOpen(false)}
          />

          <aside className="shop-mobile-filter">
            <FilterContent
              closeMobile={() => setFilterOpen(false)}
            />
          </aside>
        </>
      )}
    </div>
  );
}