import React, { useEffect, useState } from "react";
import "./productdetail.css";

import {
  ChevronRight,
  UserRound,
  ChevronDown,
  Minus,
  Plus,
  Menu,
  Search,
  ShoppingCart,
  X
} from "lucide-react";

import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const mainImage = "/assets/main-shirt.jpg";
const thumbFront = "/assets/thumb-front.jpg";
const thumbBack = "/assets/thumb-back.jpg";
const thumbModel = "/assets/thumb-model.jpg";

const relatedOne = "/assets/related-1.jpg";
const relatedTwo = "/assets/related-2.jpg";
const relatedThree = "/assets/related-3.jpg";
const relatedFour = "/assets/related-4.jpg";

export default function ProductDetail() {

  const { id } = useParams();

  console.log(id);

  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [selectedColor, setSelectedColor] = useState("olive");
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");

  // API products
  const [products, setProducts] = useState([]);

  // NEW: loading state
  const [loading, setLoading] = useState(true);

  const [menuOpen, setMenuOpen] = useState(false);

  const reviews = [
    {
      name: "Samantha D.",
      rating: 5,
      text: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
      date: "August 14, 2023",
    },
    {
      name: "Alex M.",
      rating: 4.5,
      text: "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
      date: "August 15, 2023",
    },
    {
      name: "Ethan R.",
      rating: 4.5,
      text: "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect.",
      date: "August 16, 2023",
    },
    {
      name: "Olivia P.",
      rating: 5,
      text: "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear.",
      date: "August 17, 2023",
    },
    {
      name: "Liam K.",
      rating: 4,
      text: "This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill.",
      date: "August 18, 2023",
    },
    {
      name: "Ava H.",
      rating: 4.5,
      text: "I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The intricate details make this shirt a conversation starter.",
      date: "August 19, 2023",
    },
  ];

  const relatedProducts = [
    {
      name: "Polo with Contrast Trims",
      image: relatedOne,
      rating: 4.5,
      price: 212,
      oldPrice: 242,
      discount: 20,
    },
    {
      name: "Gradient Graphic T-shirt",
      image: relatedTwo,
      rating: 3.5,
      price: 145,
    },
    {
      name: "Polo with Tipping Details",
      image: relatedThree,
      rating: 4.5,
      price: 180,
    },
    {
      name: "Black Striped T-shirt",
      image: relatedFour,
      rating: 5,
      price: 120,
      oldPrice: 150,
      discount: 30,
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Fetch products from Node API
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const fetchApiProducts = async () => {

      try {

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/products`
        );

        const result = await response.json();

        console.log(result);

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch products"
          );
        }

        setProducts(result.data);

      } catch (error) {

        console.log(error.message);

      } finally {

        setLoading(false);

      }
    };

    fetchApiProducts();

  }, []);

  /*
  |--------------------------------------------------------------------------
  | Find product
  |--------------------------------------------------------------------------
  |
  | MongoDB _id is a string/ObjectId.
  | Do NOT convert route id using Number(id).
  |
  */

  const product = products.find(
    (item) => item._id === id
  );

  /*
  |--------------------------------------------------------------------------
  | Set image after API product becomes available
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (product?.image) {
      setSelectedImage(product.image);
    }

  }, [product]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <>
        <Header />

        <main className="shell">
          <div className="not-found">
            Loading Product...
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Product not found
  |--------------------------------------------------------------------------
  */

  if (!product) {
    return (
      <>
        <Header />

        <main className="shell">
          <div className="not-found">
            Product Not Found
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Thumbnails
  |--------------------------------------------------------------------------
  */

  const thumbnails = [
    {
      thumbnail: product.image || thumbFront,
      fullImage: product.image || mainImage,
    },
    {
      thumbnail: thumbBack,
      fullImage: thumbBack,
    },
    {
      thumbnail: thumbModel,
      fullImage: thumbModel,
    },
  ];

  const colors = [
    {
      name: "olive",
      value: "#4b4730",
    },
    {
      name: "teal",
      value: "#315b58",
    },
    {
      name: "navy",
      value: "#313850",
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Add to cart
  |--------------------------------------------------------------------------
  */

  function addToCart(productData) {

    console.log(productData.name);
    console.log(productData._id);
    console.log(selectedColor);
    console.log(selectedSize);

    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find((item) => {

      return (
        item._id === product._id &&
        item.color === selectedColor &&
        item.size === selectedSize
      );

    });

    if (exists) {

      exists.quantity = quantity;
      exists.color = selectedColor;
      exists.size = selectedSize;

      Swal.fire({
        title: "Cart Updated!",
        text: "This product quantity update in your cart.",
        icon: "success",
        confirmButtonText: "OK"
      });

      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

      return;
    }

    const newProduct = {
      ...product,
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
    };

    Swal.fire({
      title: "Added!",
      text: "Product added to cart successfully.",
      icon: "success",
      confirmButtonText: "OK"
    });

    cart.push(newProduct);

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }

  const sizes = [
    "Small",
    "Medium",
    "Large",
    "X-Large",
  ];

  return (
    <>

      <Header />

      <main className="shell">

        <div className="crumb">

          <span>Home</span>

          <ChevronRight />

          <span>Shop</span>

          <ChevronRight />

          <span>Men</span>

          <ChevronRight />

          <b>T-shirts</b>

        </div>

        <section className="product">

          {/* Gallery */}

          <div className="gallery">

            <div className="thumbs">

              {thumbnails.map((item, index) => (

                <button
                  key={index}
                  className={
                    selectedImage === item.fullImage
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedImage(item.fullImage)
                  }
                >

                  <img
                    src={item.thumbnail}
                    alt={`Product ${index + 1}`}
                  />

                </button>

              ))}

            </div>

            <div className="mainimg">

              <img
                src={selectedImage}
                alt={product.name}
              />

            </div>

          </div>

          {/* Product information */}

          <div className="info">

            <h1>
              {product.name.toUpperCase()}
            </h1>

            <div className="rating">

              <div className="stars">
                ★★★★★
              </div>

              <span>
                {product.rating || 0}/5
              </span>

            </div>

            <div className="price">

              <b>
                ${product.price}
              </b>

              {product.oldPrice && (
                <del>
                  ${product.oldPrice}
                </del>
              )}

              {product.discount && (
                <em>
                  {product.discount}
                </em>
              )}

            </div>

            <p>
              This graphic t-shirt is perfect for
              any occasion. Crafted from a soft and
              breathable fabric, it offers superior
              comfort and style.
            </p>

            <hr />

            {/* Colors */}

            <label>
              Select Colors
            </label>

            <div className="colors">

              {colors.map((color) => (

                <button
                  key={color.name}
                  className={
                    selectedColor === color.name
                      ? "selected"
                      : ""
                  }
                  style={{
                    backgroundColor: color.value,
                  }}
                  onClick={() =>
                    setSelectedColor(color.name)
                  }
                  aria-label={color.name}
                >

                  {selectedColor === color.name
                    ? "✓"
                    : ""}

                </button>

              ))}

            </div>

            <hr />

            {/* Sizes */}

            <label>
              Choose Size
            </label>

            <div className="sizes">

              {sizes.map((size) => (

                <button
                  key={size}
                  className={
                    selectedSize === size
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedSize(size)
                  }
                >
                  {size}
                </button>

              ))}

            </div>

            <hr />

            {/* Cart controls */}

            <div className="buy">

              <div className="qty">

                <button
                  onClick={() =>
                    setQuantity((current) =>
                      Math.max(
                        1,
                        current - 1
                      )
                    )
                  }
                >
                  <Minus />
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity(
                      (current) =>
                        current + 1
                    )
                  }
                >
                  <Plus />
                </button>

              </div>

              <button
                className="add"
                onClick={() =>
                  addToCart(product)
                }
              >
                Add to Cart
              </button>

            </div>

          </div>

        </section>

        {/* Tabs */}

        <div className="tabs">

          {[
            [
              "details",
              "Product Details",
            ],
            [
              "reviews",
              "Rating & Reviews",
            ],
            [
              "faqs",
              "FAQs",
            ],
          ].map(([key, label]) => (

            <button
              key={key}
              className={
                activeTab === key
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab(key)
              }
            >
              {label}
            </button>

          ))}

        </div>

        {/* Reviews */}

        {activeTab === "reviews" && (

          <section className="reviews">

            <div className="review-head">

              <h2>
                All Reviews{" "}
                <span>
                  ({reviews.length})
                </span>
              </h2>

              <div>

                <button className="latest">
                  Latest
                  <ChevronDown />
                </button>

                <button className="write">
                  Write a Review
                </button>

              </div>

            </div>

            <div className="review-grid">

              {reviews.map((review) => (

                <article
                  key={review.name}
                >

                  <div className="rtop">

                    <div className="stars small">
                      ★★★★★
                    </div>

                  </div>

                  <h3>
                    {review.name}
                  </h3>

                  <p>
                    “{review.text}”
                  </p>

                  <b>
                    Posted on{" "}
                    {review.date}
                  </b>

                </article>

              ))}

            </div>

            <div className="load">

              <button>
                Load More Reviews
              </button>

            </div>

          </section>

        )}

        {/* Product details */}

        {activeTab === "details" && (

          <div className="placeholder">
            Premium graphic t-shirt with
            soft breathable fabric and a
            comfortable fit.
          </div>

        )}

        {/* FAQs */}

        {activeTab === "faqs" && (

          <div className="placeholder">
            Machine wash cold. True-to-size
            fit. Static React page with no
            API.
          </div>

        )}

        {/* Related products */}

        <section className="related">

          <h2>
            YOU MIGHT ALSO LIKE
          </h2>

          <div className="related-grid">

            {relatedProducts.map(
              (item) => (

                <article key={item.name}>

                  <div className="rimg">

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                  </div>

                  <h3>
                    {item.name}
                  </h3>

                  <div className="rr">

                    <div className="stars small">
                      ★★★★★
                    </div>

                    <span>
                      {item.rating}/5
                    </span>

                  </div>

                  <div className="rp">

                    <b>
                      ${item.price}
                    </b>

                    {item.oldPrice && (
                      <del>
                        ${item.oldPrice}
                      </del>
                    )}

                    {item.discount && (
                      <em>
                        -{item.discount}%
                      </em>
                    )}

                  </div>

                </article>

              )
            )}

          </div>

        </section>

      </main>

      <Footer />

    </>
  );
}