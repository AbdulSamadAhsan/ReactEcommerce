import React, { useMemo, useState,useEffect } from 'react';
import ProductCard from './ProductCard';
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

const newArrivals = [
  { id:5, name: 'T-shirt with Tape Details', price: 120, rating: 4.5, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85' },
  {id:6,  name: 'Skinny Fit Jeans', price: 240, oldPrice: 260, discount: '-20%', rating: 3.5, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85' },
  {id:7, name: 'Checkered Shirt', price: 180, rating: 4.5, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85' },
  {id:8, name: 'Sleeve Striped T-shirt', price: 130, oldPrice: 160, discount: '-30%', rating: 4.5, image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=85' },
];
    

const reviews = [
  ['Sarah M.', 'I’m blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece has exceeded my expectations.'],
  ['Alex K.', 'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range is genuinely impressive.'],
  ['James L.', 'The selection of clothes is not only diverse but also on-point with the latest trends. The shopping experience is smooth and easy.'],
  ['Mia R.', 'The fit, quality, and packaging were all excellent. I have already recommended SHOP.CO to several friends.'],
];


export default function Hero() {
    const [products, setProducts] = useState([]);
const [topSelling,setTopSellings] = useState([
  { id:1,  name: 'Vertical Striped Shirt', price: 212, oldPrice: 232, discount: '-20%', rating: 5, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85' },
  { id:2, name: 'Courage Graphic T-shirt', price: 145, rating: 4, image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85' },
  { id:3, name: 'Loose Fit Bermuda Shorts', price: 80, rating: 3, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=85' },
  { id:4 ,name: 'Faded Skinny Jeans', price: 210, rating: 4.5, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85' },
]);

useEffect(() => {

    const fetchApiProducts = async () => {
      try {

   const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products`
      );

        const result = await response.json();
          console.log(result);
        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch products");
        }
         setTopSellings(result.data);
        setProducts(result.data);

      } catch (error) {

        console.log(error.message);

      } finally {

    
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
          <div className="product-grid">{newArrivals.map(item => <ProductCard key={item.name} item={item} />)}</div>
          <button className="outline-btn">View All</button>
        </section>

        <div className="shell divider" />

        <section className="shell product-section">
          <h2>TOP SELLING</h2>
          <div className="product-grid">{topSelling.map(item => <ProductCard key={item.name} item={item} />)}</div>
          <button className="outline-btn">View All</button>
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
