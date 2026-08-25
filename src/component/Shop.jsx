import React, { useEffect, useMemo, useState } from "react";
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
import Header from "./Header";
import Footer from "./Footer";

const products = [
  {
    id: 1,
    name: "Gradient Graphic T-shirt",
    image: "/assets/related-2.jpg",
    rating: 3.5,
    price: 145,
    category: "T-shirts",
    style: "Casual",
    color: "#000000",
    sizes: ["Small", "Medium", "Large"],
  },
  {
    id: 2,
    name: "Polo with Tipping Details",
    image: "/assets/related-3.jpg",
    rating: 4.5,
    price: 180,
    category: "Shirts",
    style: "Casual",
    color: "#ffffff",
    sizes: ["Medium", "Large", "X-Large"],
  },
  {
    id: 3,
    name: "Black Striped T-shirt",
    image: "/assets/related-4.jpg",
    rating: 5,
    price: 120,
    oldPrice: 150,
    discount: 30,
    category: "T-shirts",
    style: "Party",
    color: "#000000",
    sizes: ["Small", "Medium", "Large"],
  },
  {
    id: 4,
    name: "Skinny Fit Jeans",
    image: "/assets/skinny-jeans.png",
    rating: 3.5,
    price: 240,
    oldPrice: 260,
    discount: 20,
    category: "Jeans",
    style: "Casual",
    color: "#063af5",
    sizes: ["Medium", "Large", "X-Large"],
  },
  {
    id: 5,
    name: "Checkered Shirt",
    image: "/assets/main-shirt.jpg",
    rating: 4.5,
    price: 180,
    category: "Shirts",
    style: "Formal",
    color: "#f50606",
    sizes: ["Small", "Medium", "Large"],
  },
  {
    id: 6,
    name: "Sleeve Striped T-shirt",
    image: "/assets/related-1.jpg",
    rating: 4.5,
    price: 130,
    oldPrice: 160,
    discount: 20,
    category: "T-shirts",
    style: "Gym",
    color: "#06caf5",
    sizes: ["X-Small", "Small", "Medium"],
  },
  {
    id: 7,
    name: "Vertical Striped Shirt",
    image: "/assets/thumb-front.jpg",
    rating: 5,
    price: 212,
    oldPrice: 232,
    discount: 20,
    category: "Shirts",
    style: "Formal",
    color: "#ffffff",
    sizes: ["Large", "X-Large", "XX-Large"],
  },
  {
    id: 8,
    name: "Courage Graphic T-shirt",
    image: "/assets/party.jpg",
    rating: 4,
    price: 145,
    category: "T-shirts",
    style: "Party",
    color: "#7d06f5",
    sizes: ["Medium", "Large"],
  },
  {
    id: 9,
    name: "Loose Fit Bermuda Shorts",
    image: "/assets/gym.jpg",
    rating: 3,
    price: 80,
    category: "Shorts",
    style: "Gym",
    color: "#00c12b",
    sizes: ["Small", "Medium", "Large"],
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

const PRICE_MIN = 0;
const PRICE_MAX = 300;

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

  setPriceDragging,

  applyFilters,
  clearFilters,
}) {
  const handlePriceMouseDown = (event, type) => {
    event.stopPropagation();

    setPriceDragging(type);
  };

  const handleTrackMouseDown = (event) => {
    const track = event.currentTarget;

    const rect = track.getBoundingClientRect();

    let percentage =
      (event.clientX - rect.left) / rect.width;

    percentage = Math.max(
      0,
      Math.min(1, percentage)
    );

    const value = Math.round(
      PRICE_MIN +
        percentage *
          (PRICE_MAX - PRICE_MIN)
    );

    const distanceFromMin = Math.abs(
      value - minPrice
    );

    const distanceFromMax = Math.abs(
      value - maxPrice
    );

    if (
      distanceFromMin <=
      distanceFromMax
    ) {
      setMinPrice(
        Math.min(value, maxPrice - 1)
      );

      setPriceDragging("min");
    } else {
      setMaxPrice(
        Math.max(value, minPrice + 1)
      );

      setPriceDragging("max");
    }
  };

  const minPercentage =
    ((minPrice - PRICE_MIN) /
      (PRICE_MAX - PRICE_MIN)) *
    100;

  const maxPercentage =
    ((maxPrice - PRICE_MIN) /
      (PRICE_MAX - PRICE_MIN)) *
    100;

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

          {/* Existing price track */}
          <div
            className="shop-price-track"
            onMouseDown={handleTrackMouseDown}
          >
            {/* Existing active element */}
            <div
              className="shop-price-active"
              style={{
                left: `${minPercentage}%`,
                right: `${100 - maxPercentage}%`,
              }}
            />

            {/* Existing left dot */}
            <span
              className="shop-price-dot shop-price-left"
              style={{
                left: `${minPercentage}%`,
                cursor: "grab",
              }}
              onMouseDown={(event) =>
                handlePriceMouseDown(
                  event,
                  "min"
                )
              }
            />

            {/* Existing right dot */}
            <span
              className="shop-price-dot shop-price-right"
              style={{
                left: `${maxPercentage}%`,
                cursor: "grab",
              }}
              onMouseDown={(event) =>
                handlePriceMouseDown(
                  event,
                  "max"
                )
              }
            />
          </div>

          {/* Existing price values */}
          <div className="shop-price-values">
            <span>${minPrice}</span>

            <span>${maxPrice}</span>
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

function SortDropdown({
  sortBy,
  setSortBy,
  sortOpen,
  setSortOpen,
}) {
  const options = [
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

  const currentLabel =
    options.find(
      (option) =>
        option.value === sortBy
    )?.label || "Most Popular";

  return (
    <div
      className="shop-sort-text"
      style={{
        position: "relative",
        cursor: "pointer",
      }}
      onClick={() =>
        setSortOpen(!sortOpen)
      }
    >
      Sort by:

      <strong>
        {currentLabel}
      </strong>

      <ChevronDown size={15} />

      {sortOpen && (
        <div
          style={{
            position: "absolute",
            top: "25px",
            right: 0,
            minWidth: "180px",
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "6px",
            zIndex: 100,
            boxShadow:
              "0 8px 20px rgba(0,0,0,0.12)",
          }}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setSortBy(option.value);
                setSortOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "9px 10px",
                border: "none",
                background:
                  sortBy === option.value
                    ? "#f5f5f5"
                    : "transparent",
                textAlign: "left",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Shop() {
  const [filterOpen, setFilterOpen] =
    useState(false);

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
    useState(50);

  const [maxPrice, setMaxPrice] =
    useState(200);

  const [priceDragging, setPriceDragging] =
    useState(null);

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
      minPrice: 50,
      maxPrice: 200,
    });

  /*
  |--------------------------------------------------------------------------
  | Sorting
  |--------------------------------------------------------------------------
  */

  const [sortBy, setSortBy] =
    useState("popular");

  const [sortOpen, setSortOpen] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const [currentPage, setCurrentPage] =
    useState(1);

  const productsPerPage = 6;

  /*
  |--------------------------------------------------------------------------
  | Price dragging
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!priceDragging) {
      return;
    }

    const handleMouseMove = (event) => {
      const track =
        document.querySelector(
          ".shop-price-track"
        );

      if (!track) {
        return;
      }

      const rect =
        track.getBoundingClientRect();

      let percentage =
        (event.clientX - rect.left) /
        rect.width;

      percentage = Math.max(
        0,
        Math.min(1, percentage)
      );

      const value = Math.round(
        PRICE_MIN +
          percentage *
            (PRICE_MAX - PRICE_MIN)
      );

      if (priceDragging === "min") {
        setMinPrice(
          Math.min(
            value,
            maxPrice - 1
          )
        );
      }

      if (priceDragging === "max") {
        setMaxPrice(
          Math.max(
            value,
            minPrice + 1
          )
        );
      }
    };

    const handleMouseUp = () => {
      setPriceDragging(null);
    };

    document.addEventListener(
      "mousemove",
      handleMouseMove
    );

    document.addEventListener(
      "mouseup",
      handleMouseUp
    );

    return () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      document.removeEventListener(
        "mouseup",
        handleMouseUp
      );
    };
  }, [
    priceDragging,
    minPrice,
    maxPrice,
  ]);

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
      maxPrice,
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

    setMinPrice(50);

    setMaxPrice(200);

    setAppliedFilters({
      color: "",
      size: "",
      category: "",
      style: "",
      minPrice: 50,
      maxPrice: 200,
    });

    setCurrentPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Filter Products
  |--------------------------------------------------------------------------
  */

  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (product) => {
        if (
          appliedFilters.category &&
          product.category !==
            appliedFilters.category
        ) {
          return false;
        }

        if (
          appliedFilters.style &&
          product.style !==
            appliedFilters.style
        ) {
          return false;
        }

        if (
          appliedFilters.color &&
          product.color !==
            appliedFilters.color
        ) {
          return false;
        }

        if (
          appliedFilters.size &&
          !product.sizes.includes(
            appliedFilters.size
          )
        ) {
          return false;
        }

        if (
          product.price <
          appliedFilters.minPrice
        ) {
          return false;
        }

        if (
          product.price >
          appliedFilters.maxPrice
        ) {
          return false;
        }

        return true;
      }
    );

    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

    switch (sortBy) {
      case "rating":
        result.sort(
          (a, b) =>
            b.rating - a.rating
        );
        break;

      case "price-low":
        result.sort(
          (a, b) =>
            a.price - b.price
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            b.price - a.price
        );
        break;

      case "name":
        result.sort(
          (a, b) =>
            a.name.localeCompare(
              b.name
            )
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    appliedFilters,
    sortBy,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length /
        productsPerPage
    )
  );

  const startIndex =
    (currentPage - 1) *
    productsPerPage;

  const currentProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );

  /*
  |--------------------------------------------------------------------------
  | Page Navigation
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Price percentages
  |--------------------------------------------------------------------------
  */

  const minPricePercentage =
    ((minPrice - PRICE_MIN) /
      (PRICE_MAX - PRICE_MIN)) *
    100;

  const maxPricePercentage =
    ((maxPrice - PRICE_MIN) /
      (PRICE_MAX - PRICE_MIN)) *
    100;

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
              "Casual"}
          </b>
        </div>

        <div className="shop-main-layout">

          {/* Sidebar */}

          <aside className="shop-sidebar">
            <FilterContent
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

              setPriceDragging={
                setPriceDragging
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
                  "Casual"}
              </h1>

              <div className="shop-sort">

                <span className="shop-results-text">
                  {filteredProducts.length ===
                  0
                    ? "Showing 0 Products"
                    : `Showing ${
                        startIndex + 1
                      }-${Math.min(
                        startIndex +
                          currentProducts.length,
                        filteredProducts.length
                      )} of ${
                        filteredProducts.length
                      } Products`}
                </span>

                <SortDropdown
                  sortBy={sortBy}
                  setSortBy={
                    setSortBy
                  }
                  sortOpen={
                    sortOpen
                  }
                  setSortOpen={
                    setSortOpen
                  }
                />

                <button
                  className="shop-mobile-filter-button"
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

            <div className="shop-products-grid">
              {currentProducts.map(
                (product) => (
                  <article
                    className="shop-product-card"
                    key={product.id}
                  >
                    <div className="shop-product-image">
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
                    </h3>

                    <Rating
                      value={
                        product.rating
                      }
                    />

                    <div className="shop-product-price">
                      <strong>
                        ${product.price}
                      </strong>

                      {product.oldPrice && (
                        <del>
                          $
                          {
                            product.oldPrice
                          }
                        </del>
                      )}

                      {product.discount && (
                        <span className="shop-discount">
                          -
                          {
                            product.discount
                          }
                          %
                        </span>
                      )}
                    </div>
                  </article>
                )
              )}

              {currentProducts.length ===
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

            {filteredProducts.length >
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

          <aside className="shop-mobile-filter">
            <FilterContent
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

              setPriceDragging={
                setPriceDragging
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