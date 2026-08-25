import React, { useMemo, useState } from 'react';
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
import Hero from "./Hero";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import Header from './Header';


export default function Home() {
   const [menuOpen, setMenuOpen] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
 
    return (
   <>
  


    <div>
     <Header/>  

  <Hero/>
      <Footer/>
    </div>

   </>
  )
}
