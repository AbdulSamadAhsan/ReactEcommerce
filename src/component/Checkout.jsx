import React, { useEffect, useState } from "react";
import { ArrowRight, CreditCard } from "lucide-react";
import "./Checkout.css";
import Header from "./Header";
import { getCart } from "../api";
import {pay} from "../api";


export default function App() {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [cart, setCart] = useState(null);
  const [cartError, setCartError] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    console.log(controller);
    getCart(controller.signal).then(setCart).catch(e => { if (e.name !== 'AbortError') setCartError(e.message); });
    return () => controller.abort();
  }, []);


useEffect(() => {
    const storedUser = localStorage.getItem("shopco.user");
       console.log(storedUser);
    if (storedUser) {
        const user = JSON.parse(storedUser);

        setForm((prev) => ({
            ...prev,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            city: user.city || "",
            state: user.state || "",
            zip: user.zip || "",
        }));
    }
}, []);

  
  const cartItems = cart?.items || [];
  const { subtotal = 0, discount = 0, deliveryFee = 0, total = 0 } = cart?.totals || {};

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentMessage('');
    try {
      await pay(form);
      setPaymentMessage('Test response received. No payment was processed or order placed.');
    } catch (error) {
      setPaymentMessage(error.message || 'Unable to submit payment data. Please try again.');
    }
  };


  return (
   <>
   <Header/>
       <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-breadcrumb">
          <span>Home</span>
          <span>Checkout</span>
        </div>

        <h1 className="checkout-title">CHECKOUT</h1>
        {cartError && <p role="alert">{cartError}</p>}
        {paymentMessage && <p role="status">{paymentMessage}</p>}
        {!cart && !cartError && <p role="status">Loading your cart…</p>}

        {cartItems.length == 0 ? (
          <div className="empty-checkout">
            <h2>Your cart is empty</h2>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="checkout-grid">
              <div className="checkout-left">
                <section className="checkout-card">
                  <h2>Billing Details</h2>

                  <div className="form-grid">
                    <div className="input-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email address"
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                        required
                      />
                    </div>

                    <div className="input-group full-width">
                      <label>Street Address</label>
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="House number and street name"
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="State"
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>ZIP Code</label>
                      <input
                        type="text"
                        name="zip"
                        value={form.zip}
                        onChange={handleChange}
                        placeholder="ZIP code"
                        required
                      />
                    </div>
                  </div>
                </section>

                <section className="checkout-card payment-card">
                  <h2>Payment Method</h2>

                  <div className="payment-option active-payment">
                    <div>
                      <CreditCard size={22} />
                      <span>Credit / Debit Card</span>
                    </div>

                    <input
                      type="radio"
                      name="payment"
                      defaultChecked
                    />
                  </div>

                  <div className="form-grid card-form">
                    <div className="input-group full-width">
                      <label>Name on Card</label>
                      <input
                        type="text"
                        name="cardName"
                        value={form.cardName}
                        onChange={handleChange}
                        placeholder="Name on card"
                        required
                      />
                    </div>

                    <div className="input-group full-width">
                      <label>Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={form.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        value={form.expiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        value={form.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </section>
              </div>

              <aside className="checkout-summary">
                <h2>Order Summary</h2>

                <div className="summary-products">
                  {cartItems.map((item) => (
                    <div
                      className="summary-product"
                      key={`${item.productId}-${item.size}-${item.color}`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div className="summary-product-info">
                        <h3>{item.name}</h3>
                        <p>
                          Qty: {item.quantity || 1}
                        </p>
                      </div>

                      <strong>
                        $
                        {(
                          Number(item.price) *
                          Number(item.quantity || 1)
                        ).toFixed(0)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>${subtotal.toFixed(0)}</strong>
                </div>

                <div className="summary-row">
                  <span>Discount{cart?.promoCode ? " (-20%)" : ""}</span>
                  <strong className="discount-price">
                    -${discount.toFixed(0)}
                  </strong>
                </div>

                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <strong>${deliveryFee}</strong>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span>Total</span>
                  <strong>${total.toFixed(0)}</strong>
                </div>

                <button
                  type="submit"
                  className="place-order-btn"
                >
                  <span>Place Order</span>
                  <ArrowRight size={22} />
                </button>
              </aside>
            </div>
          </form>
        )}
      </div>
    </div>
   
   </>
  )
}
