import { hasDiscount } from '../discount';
import { useCurrency } from '../CurrencyContext';
import React, { useEffect, useRef, useState } from "react";
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
import { Link, useLocation } from "react-router-dom";
import { api } from "../api";
import Header from "./Header";
import Footer from "./Footer";
import { discountLabel } from '../productPricing';


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

const colorNames = ["Green", "Red", "Yellow", "Orange", "Cyan", "Blue", "Purple", "Pink", "White", "Black"];

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

const PRICE_MIN = 0;

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

function FilterContent({
  PRICE_MAX,
  closeMobile,

  selectedColor,
  setSelectedColor,

  selectedSize,
  setSelectedSize,

  selectedCategory,
  setSelectedCategory,

  selectedStyle,
  setSelectedStyle,

  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,


  applyFilters,
  clearFilters,
}) {
  const { money } = useCurrency();
  return (
    <div className="shop-filter-content">
      <div className="shop-filter-heading">
        <h3>Filters</h3>

        {!closeMobile && <SlidersHorizontal size={20} aria-hidden="true" />}

        {closeMobile && (
          <button
            className="shop-filter-close"
            type="button"
            aria-label="Close filters"
            onClick={closeMobile}
          >
            <X size={22} />
          </button>
        )}
      </div>

      <div className="shop-filter-divider" />

      <div className="shop-filter-links">
        {[
          "T-shirts",
          "Shorts",
          "Shirts",
          "Hoodie",
          "Jeans",
        ].map((item) => (
          <button
            key={item}
            className={
              selectedCategory === item
                ? "active"
                : ""
            }
            onClick={() =>
              setSelectedCategory(
                selectedCategory === item
                  ? ""
                  : item
              )
            }
          >
            <span>{item}</span>

            <ChevronRight size={17} />
          </button>
        ))}
      </div>

      <div className="shop-filter-divider" />

      <div className="shop-filter-section">
        <div className="shop-filter-section-heading">
          <strong>Price</strong>

          <ChevronUp size={18} />
        </div>

        <div className="shop-price-filter">
          <label className="shop-price-control">
            <span>Minimum price <strong>{money(minPrice)}</strong></span>
            <input type="range" aria-label="Minimum price" aria-valuetext={money(minPrice)}
              min={PRICE_MIN} max={maxPrice - 1} step="1" value={minPrice}
              onChange={event => setMinPrice(Math.max(PRICE_MIN, Math.min(Number(event.target.value), maxPrice - 1)))} />
          </label>
          <label className="shop-price-control">
            <span>Maximum price <strong>{money(maxPrice)}</strong></span>
            <input type="range" aria-label="Maximum price" aria-valuetext={money(maxPrice)}
              min={minPrice + 1} max={PRICE_MAX} step="1" value={maxPrice}
              onChange={event => setMaxPrice(Math.min(PRICE_MAX, Math.max(Number(event.target.value), minPrice + 1)))} />
          </label>
        </div>
      </div>

      <div className="shop-filter-divider" />

      <div className="shop-filter-section">
        <div className="shop-filter-section-heading">
          <strong>Colors</strong>

          <ChevronUp size={18} />
        </div>

        <div className="shop-color-grid">
          {colors.map((color, index) => (
            <button
              key={color}
              className="shop-color"
              type="button"
              aria-label={`Filter by ${colorNames[index]}`}
              aria-pressed={selectedColor === color}
              style={{
                backgroundColor: color,
              }}
              onClick={() =>
                setSelectedColor(
                  selectedColor === color
                    ? ""
                    : color
                )
              }
            >
              {selectedColor === color && (
                <Check
                  size={17}
                  aria-hidden="true"
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
                selectedSize === size
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedSize(
                  selectedSize === size
                    ? ""
                    : size
                )
              }
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
          {[
            "Casual",
            "Formal",
            "Party",
            "Gym",
          ].map((item) => (
            <button
              key={item}
              className={
                selectedStyle === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedStyle(
                  selectedStyle === item
                    ? ""
                    : item
                )
              }
            >
              <span>{item}</span>

              <ChevronRight size={17} />
            </button>
          ))}
        </div>
      </div>

      <button
        className="shop-apply-filter"
        onClick={() => {
          applyFilters();

          if (closeMobile) {
            closeMobile();
          }
        }}
      >
        Apply Filter
      </button>

      <button
        type="button"
        onClick={clearFilters}
        style={{
          width: "100%",
          marginTop: "10px",
          padding: "10px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        Clear Filters
      </button>
    </div>
  );
}

function SortDropdown({ sortBy, setSortBy }) {
  const options = [
    {
      value: "newest",
      label: "Newest arrivals",
    },
    {
      value: "popular",
      label: "Most Popular",
    },
    {
      value: "rating",
      label: "Top Rated",
    },
    {
      value: "price-low",
      label: "Price Low to High",
    },
    {
      value: "price-high",
      label: "Price High to Low",
    },
    {
      value: "name",
      label: "Name A-Z",
    },
  ];

  return (
    <label className="shop-sort-text">
      <span>Sort by:</span>
      <select aria-label="Sort products" value={sortBy} onChange={event => setSortBy(event.target.value)}>
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

export default function Shop() {
  const { money } = useCurrency();
  const [PRICE_MAX, setPriceLimit] = useState(1);
  const [priceRangeError, setPriceRangeError] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sale = location.pathname === '/sale';
  const brand = params.get('brand') || '';
  const initialSort = location.pathname === '/new-arrivals' ? 'newest' : params.get('sort') || 'popular';
  const pageTitle = sale ? 'On Sale' : location.pathname === '/new-arrivals' ? 'New Arrivals' : brand || 'Shop';
  const [currentProducts, setCurrentProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [search, setSearch] = useState(params.get('search') || '');
  const [filterOpen, setFilterOpen] =
    useState(false);
  const filterDrawerRef = useRef(null);
  useEffect(() => {
    if (!filterOpen) return;
    const previousFocus = document.activeElement;
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    filterDrawerRef.current?.querySelector('button')?.focus();
    const onKeyDown = event => {
      if (event.key === 'Escape') setFilterOpen(false);
      if (event.key !== 'Tab') return;
      const controls = [...filterDrawerRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), [tabindex="0"]')];
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const onResize = () => { if (window.innerWidth > 850) setFilterOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [filterOpen]);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  const [selectedColor, setSelectedColor] =
    useState("");

  const [selectedSize, setSelectedSize] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [selectedStyle, setSelectedStyle] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Price
  |--------------------------------------------------------------------------
  */

  const [minPrice, setMinPrice] =
    useState(PRICE_MIN);

  const [maxPrice, setMaxPrice] =
    useState(PRICE_MAX);


  /*
  |--------------------------------------------------------------------------
  | Applied filters
  |--------------------------------------------------------------------------
  */

  const [appliedFilters, setAppliedFilters] =
    useState({
      color: "",
      size: "",
      category: "",
      style: "",
      minPrice: PRICE_MIN,
      maxPrice: "",
    });

  /*
  |--------------------------------------------------------------------------
  | Sorting
  |--------------------------------------------------------------------------
  */

  const [sortBy, setSortBy] =
    useState(initialSort);


  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const [currentPage, setCurrentPage] =
    useState(1);

  const productsPerPage = 6;
  useEffect(() => {
    const controller = new AbortController();
    setPriceRangeError("");
    api('/products?sort=price-desc&limit=1', { signal: controller.signal }).then(result => {
      const highest = Number(result.data[0]?.price || 0);
      const limit = Math.max(1, Math.ceil(highest));
      setPriceLimit(limit);
      setMaxPrice(limit);
    }).catch(error => {
      if (error.name !== 'AbortError') setPriceRangeError('Could not load the price range. Try again to refresh it.');
    });
    return () => controller.abort();
  }, [retry]);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const query = new URLSearchParams(location.search);
    setSearch(query.get('search') || '');
    setSortBy(location.pathname === '/new-arrivals' ? 'newest' : query.get('sort') || 'popular');
    setCurrentPage(1);
  }, [location.search, location.pathname]);

  /*
  |--------------------------------------------------------------------------
  | Apply Filters
  |--------------------------------------------------------------------------
  */

  const applyFilters = () => {
    setAppliedFilters({
      color: selectedColor,
      size: selectedSize,
      category: selectedCategory,
      style: selectedStyle,
      minPrice,
      maxPrice: maxPrice === PRICE_MAX ? "" : maxPrice,
    });

    setCurrentPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Clear Filters
  |--------------------------------------------------------------------------
  */

  const clearFilters = () => {
    setSelectedColor("");

    setSelectedSize("");

    setSelectedCategory("");

    setSelectedStyle("");

    setMinPrice(PRICE_MIN);

    setMaxPrice(PRICE_MAX);

    setAppliedFilters({
      color: "",
      size: "",
      category: "",
      style: "",
      minPrice: PRICE_MIN,
      maxPrice: "",
    });

    setCurrentPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Filter Products
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    const query = { page: currentPage, limit: productsPerPage, sort: { 'price-low': 'price-asc', 'price-high': 'price-desc' }[sortBy] || sortBy, ...appliedFilters };
    for (const key of Object.keys(query)) if (query[key] === '') delete query[key];
    if (search.trim()) query.search = search.trim();
    if (sale) query.sale = 'true';
    if (brand) query.brand = brand;
    const timer = setTimeout(() => {
      api('/products?' + new URLSearchParams(query), { signal: controller.signal }).then(r => {
        setCurrentProducts(r.data); setTotal(r.pagination.total);
      }).catch(e => { if (e.name !== 'AbortError') { setError(e.message); setCurrentProducts([]); setTotal(0); } })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, 200);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [appliedFilters, currentPage, sortBy, search, retry, sale, brand]);
  const totalPages = Math.max(1, Math.ceil(total / productsPerPage));
  const startIndex = (currentPage - 1) * productsPerPage;

  const changePage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="shop-page">
      <Header />

      <div className="shop-header-line shop-shell" />

      <main className="shop-shell">
        <div className="shop-breadcrumb">
          <span>Home</span>

          <ChevronRight size={15} />

          <b>
            {appliedFilters.category ||
              pageTitle}
          </b>
        </div>

        <div className="shop-main-layout">

          {/* Sidebar */}

          <aside className="shop-sidebar">
            <FilterContent
              PRICE_MAX={PRICE_MAX}
              selectedColor={
                selectedColor
              }
              setSelectedColor={
                setSelectedColor
              }

              selectedSize={
                selectedSize
              }
              setSelectedSize={
                setSelectedSize
              }

              selectedCategory={
                selectedCategory
              }
              setSelectedCategory={
                setSelectedCategory
              }

              selectedStyle={
                selectedStyle
              }
              setSelectedStyle={
                setSelectedStyle
              }

              minPrice={minPrice}
              maxPrice={maxPrice}

              setMinPrice={
                setMinPrice
              }
              setMaxPrice={
                setMaxPrice
              }

              applyFilters={
                applyFilters
              }

              clearFilters={
                clearFilters
              }
            />
          </aside>

          {/* Products */}

          <section className="shop-products-section">

            <div className="shop-products-top">
              <h1>
                {appliedFilters.category ||
                  pageTitle}
              </h1>

              <div className="shop-sort">

                <span className="shop-results-text">
                  {total ===
                  0
                    ? "Showing 0 Products"
                    : `Showing ${
                        startIndex + 1
                      }-${Math.min(
                        startIndex +
                          currentProducts.length,
                        total
                      )} of ${
                        total
                      } Products`}
                </span>

                <SortDropdown
                  sortBy={sortBy}
                  setSortBy={value => { setSortBy(value); setCurrentPage(1); }}
                />

                <button
                  className="shop-mobile-filter-button"
                  type="button"
                  aria-label="Open filters"
                  aria-expanded={filterOpen}
                  onClick={() =>
                    setFilterOpen(
                      true
                    )
                  }
                >
                  <SlidersHorizontal
                    size={20}
                  />
                </button>
              </div>
            </div>

            {/* Product Grid */}

            <label style={{display: 'block', marginBottom: 20}}>Search products
              <input type="search" aria-label="Search shop products" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search by name" style={{display:'block',width:'100%',padding:12,border:'1px solid #ddd',borderRadius:12,marginTop:8}} />
            </label>
            {loading && <p role="status">Loading products…</p>}
            {error && <p role="alert">{error} <button onClick={() => setRetry(n => n + 1)}>Try again</button></p>}
            {priceRangeError && <p role="alert">{priceRangeError} <button onClick={() => setRetry(n => n + 1)}>Try again</button></p>}
            <div className="shop-products-grid" aria-busy={loading}>
              {!loading && currentProducts.map(
                (product) => (
                  <article
                    className="shop-product-card"
                    key={product._id}
                  >
                    <Link to={`/products/${product._id}`}><div className="shop-product-image">
                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                      />
                    </div>

                    <h3>
                      {product.name}
                    </h3></Link>

                    <Rating
                      value={
                        product.rating
                      }
                    />

                    <div className="shop-product-price">
                      <strong>
                        {money(product.price)}
                      </strong>

                      {Number(product.oldPrice) > 0 && (
                        <del>
                          {money(product.oldPrice)}
                        </del>
                      )}

                      {hasDiscount(product.discount) && (
                        <span className="shop-discount">{product.discount}</span>
                      )}
                    </div>
                  </article>
                )
              )}

              {!loading && !error && currentProducts.length ===
                0 && (
                <div
                  style={{
                    gridColumn:
                      "1 / -1",
                    textAlign:
                      "center",
                    padding:
                      "40px",
                  }}
                >
                  <h3>
                    No products found
                  </h3>

                  <p>
                    Try changing
                    your filters.
                  </p>

                  <button
                    onClick={
                      clearFilters
                    }
                    style={{
                      cursor:
                        "pointer",
                      padding:
                        "10px 20px",
                      border:
                        "none",
                      borderRadius:
                        "6px",
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}

            {!loading && total >
              0 && (
              <div className="shop-pagination">

                <button
                  className="shop-page-nav"
                  disabled={
                    currentPage ===
                    1
                  }
                  onClick={() =>
                    changePage(
                      currentPage - 1
                    )
                  }
                >
                  <ArrowLeft
                    size={16}
                  />

                  <span>
                    Previous
                  </span>
                </button>

                <div className="shop-page-numbers">

                  {Array.from(
                    {
                      length:
                        totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      className={
                        currentPage ===
                        page
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        changePage(
                          page
                        )
                      }
                    >
                      {page}
                    </button>
                  ))}

                </div>

                <button
                  className="shop-page-nav"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    changePage(
                      currentPage + 1
                    )
                  }
                >
                  <span>
                    Next
                  </span>

                  <ArrowRight
                    size={16}
                  />
                </button>
              </div>
            )}

          </section>
        </div>
      </main>

      <Footer />

      {/* Mobile Filter */}

      {filterOpen && (
        <>
          <div
            className="shop-filter-overlay"
            onClick={() =>
              setFilterOpen(
                false
              )
            }
          />

          <aside className="shop-mobile-filter" role="dialog" aria-modal="true" aria-label="Product filters" ref={filterDrawerRef}>
            <FilterContent
              PRICE_MAX={PRICE_MAX}
              closeMobile={() =>
                setFilterOpen(
                  false
                )
              }

              selectedColor={
                selectedColor
              }
              setSelectedColor={
                setSelectedColor
              }

              selectedSize={
                selectedSize
              }
              setSelectedSize={
                setSelectedSize
              }

              selectedCategory={
                selectedCategory
              }
              setSelectedCategory={
                setSelectedCategory
              }

              selectedStyle={
                selectedStyle
              }
              setSelectedStyle={
                setSelectedStyle
              }

              minPrice={minPrice}
              maxPrice={maxPrice}

              setMinPrice={
                setMinPrice
              }
              setMaxPrice={
                setMaxPrice
              }

              applyFilters={
                applyFilters
              }

              clearFilters={
                clearFilters
              }
            />
          </aside>
        </>
      )}
    </div>
  );
}

