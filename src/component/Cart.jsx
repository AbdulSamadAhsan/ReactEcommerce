import React, { useState } from "react";

import {
  Search,
  ShoppingCart,
  UserRound,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Mail,
  Minus,
  Trash2,
  Plus,
  Tag,
} from "lucide-react";

import "./Cart.css";
import Footer from "./Footer";

import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import Header from "./Header";


/* =====================================================
   CART ITEM COMPONENT
===================================================== */

function CartItem({
  item,
  increaseQuantity,
  decreaseQuantity,
  deleteItem,
}) {
  return (
    <div className="cart-item">

      {/* PRODUCT IMAGE */}

      <img
        src={item.image}
        alt={item.name}
        className="product-image"
      />


      {/* PRODUCT INFORMATION */}

      <div className="item-copy">

        <div className="item-title">
          {item.name}
        </div>

        <div className="item-meta">
          <span>Size:</span> {item.size}
        </div>

        <div className="item-meta">
          <span>Color:</span> {item.color}
        </div>

        <div className="item-price">
          ${Number(item.price).toFixed(0)}
        </div>

      </div>


      {/* DELETE PRODUCT */}

        <Trash2
          className="trash"
          size={22}
          color="#ff3333"
          strokeWidth={1.9}
                onClick={() =>
          deleteItem(
            item.id,
            item.size,
            item.color
          )
        }
        />
     


      {/* QUANTITY */}

      <div className="quantity-pill">

        <button
          type="button"
          className="quantity-button"
          disabled={(item.quantity || 1) <= 1}
          onClick={() =>
            decreaseQuantity(
              item.id,
              item.size,
              item.color
            )
          }
        >
          <Minus size={18} />
        </button>


        <span>
          {item.quantity || 1}
        </span>


        <button
          type="button"
          className="quantity-button"
          onClick={() =>
            increaseQuantity(
              item.id,
              item.size,
              item.color
            )
          }
        >
          <Plus size={18} />
        </button>

      </div>

    </div>
  );
}


/* =====================================================
   ORDER SUMMARY
===================================================== */

function OrderSummary({ cartItems }) {

  /* SUBTOTAL */

  const subtotal = cartItems.reduce(
    (total, item) => {
      return (
        total +
        Number(item.price) *
          Number(item.quantity || 1)
      );
    },
    0
  );


  /* 20% DISCOUNT */

  const discount = subtotal * 0.2;


  /* DELIVERY FEE */

  const deliveryFee =
    cartItems.length > 0 ? 15 : 0;


  /* FINAL TOTAL */

  const total =
    subtotal - discount + deliveryFee;


  return (
    <aside className="summary-card">

      <h2>
        Order Summary
      </h2>


      {/* SUBTOTAL */}

      <div className="summary-row muted">

        <span>
          Subtotal
        </span>

        <strong>
          ${subtotal.toFixed(2)}
        </strong>

      </div>


      {/* DISCOUNT */}

      <div className="summary-row muted">

        <span>
          Discount (-20%)
        </span>

        <strong className="discount">
          -${discount.toFixed(2)}
        </strong>

      </div>


      {/* DELIVERY */}

      <div className="summary-row muted last-before-rule">

        <span>
          Delivery Fee
        </span>

        <strong>
          ${deliveryFee.toFixed(2)}
        </strong>

      </div>


      <div className="summary-divider" />


      {/* TOTAL */}

      <div className="summary-row total-row">

        <span>
          Total
        </span>

        <strong>
          ${total.toFixed(2)}
        </strong>

      </div>


      {/* PROMO CODE */}

      <div className="promo-form">

        <div className="promo-input">

          <Tag
            size={19}
            color="#8c8c8c"
          />

          <span>
            Add promo code
          </span>

        </div>


        <button type="button">
          Apply
        </button>

      </div>


      {/* CHECKOUT */}

      {cartItems.length > 0 ? (

        <Link
          to="/checkout"
          className="checkout-link"
        >

          <button
            className="checkout-button"
            type="button"
          >

            Go to Checkout

            <ArrowRight size={22} />

          </button>

        </Link>

      ) : (

        <button
          className="checkout-button"
          type="button"
          disabled
        >

          Go to Checkout

          <ArrowRight size={22} />

        </button>

      )}

    </aside>
  );
}


/* =====================================================
   NEWSLETTER
===================================================== */

function Newsletter() {
  return (
    <section className="newsletter page-shell">

      <div className="newsletter-title">

        STAY UPTO DATE ABOUT
        <br />
        OUR LATEST OFFERS

      </div>


      <div className="newsletter-form">

        <div className="email-field">

          <Mail
            size={18}
            color="#8a8a8a"
          />

          <span>
            Enter your email address
          </span>

        </div>


        <button type="button">
          Subscribe to Newsletter
        </button>

      </div>

    </section>
  );
}


/* =====================================================
   HEADER
===================================================== */




/* =====================================================
   CART PAGE
===================================================== */

export default function Cart() {

  /* ===================================================
     LOAD CART FROM LOCAL STORAGE
  =================================================== */

  const [cartItems, setCartItems] =
    useState(() => {

      try {

        const savedCart =
          localStorage.getItem("cart");

        return savedCart
          ? JSON.parse(savedCart)
          : [];

      } catch (error) {

        console.error(
          "Unable to read cart:",
          error
        );

        return [];

      }

    });


  /* ===================================================
     SAVE CART
  =================================================== */

  const saveCart = (updatedCart) => {

    setCartItems(updatedCart);


    if (updatedCart.length === 0) {

      localStorage.removeItem("cart");

    } else {

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

    }

  };


  /* ===================================================
     INCREASE QUANTITY
  =================================================== */

  const increaseQuantity = (
    id,
    size,
    color
  ) => {

    const updatedCart =
      cartItems.map((item) => {

        const sameProduct =
          item.id === id &&
          item.size === size &&
          item.color === color;


        if (sameProduct) {

          return {
            ...item,

            quantity:
              Number(item.quantity || 1) + 1,
          };

        }


        return item;

      });


    saveCart(updatedCart);

  };


  /* ===================================================
     DECREASE QUANTITY
  =================================================== */

  const decreaseQuantity = (
    id,
    size,
    color
  ) => {

    const updatedCart =
      cartItems.map((item) => {

        const sameProduct =
          item.id === id &&
          item.size === size &&
          item.color === color;


        if (
          sameProduct &&
          Number(item.quantity || 1) > 1
        ) {

          return {
            ...item,

            quantity:
              Number(item.quantity || 1) - 1,
          };

        }


        return item;

      });


    saveCart(updatedCart);

  };


  /* ===================================================
     DELETE ITEM
  =================================================== */

  const deleteItem = async (
    id,
    size,
    color
  ) => {

    /* SWEETALERT CONFIRMATION */

    const result = await Swal.fire({

      title: "Are you sure?",

      text:
        "Do you want to remove this product from your cart?",

      icon: "warning",

      showCancelButton: true,

      confirmButtonText:
        "Yes, delete it!",

      cancelButtonText:
        "Cancel",

      reverseButtons: true,

    });


    /* CANCEL */

    if (!result.isConfirmed) {
      return;
    }


    /* REMOVE ONLY MATCHING VARIANT */

    const updatedCart =
      cartItems.filter((item) => {

        const sameProduct =
          item.id === id &&
          item.size === size &&
          item.color === color;


        return !sameProduct;

      });


    /* UPDATE STATE + LOCALSTORAGE */

    saveCart(updatedCart);


    /* SUCCESS MESSAGE */

    await Swal.fire({

      title: "Deleted!",

      text:
        "Product removed from your cart.",

      icon: "success",

      timer: 1500,

      showConfirmButton: false,

    });

  };


  /* ===================================================
     UI
  =================================================== */

  return (
    <div className="app">

     <Header/>


      <main className="page-shell main-content">


        {/* BREADCRUMB */}

        <div className="breadcrumb">

          <Link to="/">
            Home
          </Link>

          <span className="active">
            Cart
          </span>

        </div>


        {/* TITLE */}

        <h1>
          YOUR CART
        </h1>


        <div className="cart-layout">


          {/* ===========================================
              CART PRODUCTS
          =========================================== */}

          <section className="cart-card">

            {cartItems.length === 0 ? (

              <div className="empty-cart">

                <h2>
                  Your cart is empty
                </h2>

                <p>
                  Add some products to your cart.
                </p>

                <Link
                  to="/"
                  className="continue-shopping"
                >
                  Continue Shopping
                </Link>

              </div>

            ) : (

              cartItems.map((item) => (

                <CartItem

                  key={`${item.id}-${item.size}-${item.color}`}

                  item={item}

                  increaseQuantity={
                    increaseQuantity
                  }

                  decreaseQuantity={
                    decreaseQuantity
                  }

                  deleteItem={
                    deleteItem
                  }

                />

              ))

            )}

          </section>


          {/* ===========================================
              ORDER SUMMARY
          =========================================== */}

          <OrderSummary
            cartItems={cartItems}
          />

        </div>

      </main>


      <Footer />

    </div>
  );
}