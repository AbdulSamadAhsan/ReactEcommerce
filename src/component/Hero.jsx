import React, { useMemo, useState,useEffect } from 'react';
import ProductCard from './ProductCard';
import { API_URL } from '../api';
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  UserRound,
  ChevronDown,
  Menu,
  X,
  Star,
  ArrowLeft,
  ArrowRight,
  Mail,

} from 'lucide-react';
import Brand from './Brand';

const reviews = [
  ['Sarah M.', 'I’m blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece has exceeded my expectations.'],
  ['Alex K.', 'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range is genuinely impressive.'],
  ['James L.', 'The selection of clothes is not only diverse but also on-point with the latest trends. The shopping experience is smooth and easy.'],
  ['Mia R.', 'The fit, quality, and packaging were all excellent. I have already recommended SHOP.CO to several friends.'],
];


export default function Hero() {
    const [products, setProducts] = useState([]);
      const [loading, setLoading] = useState(true);
const [topSelling,setTopSellings] = useState([]);

useEffect(() => {

    const fetchApiProducts = async () => {
      try {
        const [newResponse, topResponse] = await Promise.all([
          fetch(`${API_URL}/products?sort=newest&limit=4`),
          fetch(`${API_URL}/products?sort=popular&limit=4`),
        ]);
        const [newResult, topResult] = await Promise.all([newResponse.json(), topResponse.json()]);
        if (!newResponse.ok || !topResponse.ok) throw new Error(newResult.message || topResult.message || "Failed to fetch products");
        setProducts(newResult.data);
        setTopSellings(topResult.data);

      } catch (error) {

        console.log(error.message);

      } finally {

        setLoading(false);
      }
    };

    fetchApiProducts();

  }, []);


      const [reviewIndex, setReviewIndex] = useState(0);
        const visibleReviews = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 3; i += 1) arr.push(reviews[(reviewIndex + i) % reviews.length]);
    return arr;
  }, [reviewIndex]);

 if (loading) {
    return (
      <>
        

        <main className="shell">
          <div className="not-found">
            Loading Product...
          </div>
        </main>

        
      </>
    );
  }

  return (
    <>
     <main>
        <section className="hero">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <h1>FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
              <p>Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>
              <a className="dark-btn" href="#new">Shop Now</a>
              <div className="stats">
                <div><strong>200+</strong><span>International Brands</span></div>
                <div><strong>40,000+</strong><span>High-Quality Products</span></div>
                <div><strong>30,000+</strong><span>Happy Customers</span></div>
              </div>
            </div>
            <div className="hero-visual">
              <span className="spark spark-big">✦</span><span className="spark spark-small">✦</span>
              <img src="/assets/introImage.jpg" alt="Fashion models" onError={(e) => {e.currentTarget.src='https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90'}} />
            </div>
          </div>
        </section>

<Brand/>
        <section id="new" className="shell product-section">
          <h2>NEW ARRIVALS</h2>
          <div className="product-grid">{products.map(item => <ProductCard key={item._id} item={item} />)}</div>
          <Link className="outline-btn" to="/shop?sort=newest">View All</Link>
        </section>

        <div className="shell divider" />

        <section className="shell product-section">
          <h2>TOP SELLING</h2>
          <div className="product-grid">{topSelling.map(item => <ProductCard key={item.name} item={item} />)}</div>
          <Link className="outline-btn" to="/shop?sort=popular">View All</Link>
        </section>

        <section className="shell styles-wrap">
          <h2>BROWSE BY DRESS STYLE</h2>
          <div className="styles-grid">
            <div className="styles-row styles-row-top">
              <article className="style-card casual"><h3>Casual</h3></article>
              <article className="style-card formal"><h3>Formal</h3></article>
            </div>
            <div className="styles-row styles-row-bottom">
              <article className="style-card party"><h3>Party</h3></article>
              <article className="style-card gym"><h3>Gym</h3></article>
            </div>
          </div>
        </section>

        <section className="shell reviews-section">
          <div className="section-heading-row"><h2>OUR HAPPY CUSTOMERS</h2><div><button className="icon-btn" onClick={() => setReviewIndex((reviewIndex - 1 + reviews.length) % reviews.length)}><ArrowLeft /></button><button className="icon-btn" onClick={() => setReviewIndex((reviewIndex + 1) % reviews.length)}><ArrowRight /></button></div></div>
          <div className="review-grid">
            {visibleReviews.map(([name, text]) => <article className="review-card" key={name}><div className="stars review-stars">★★★★★</div><h3>{name} <span>✓</span></h3><p>“{text}”</p></article>)}
          </div>
        </section>
      </main>
    
    </>
  )
}
