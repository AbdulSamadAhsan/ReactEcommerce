import React, { useMemo, useState } from 'react';

import {  Routes, Route } from "react-router-dom";

import Home from './component/Home';
import Cart from './component/Cart';
import Shop from "./component/Shop";
import ProductDetail from './component/ProductDetail';


// function Home(){
//   return(

//     <>
//     Home
//     </>
//   );
// }

function App() {
        // <Routes>
        //     <Route path="/" element={<Home/>} />
        //     {/* <Route path="/products" element={<Products />} /> */}
        //     {/* <Route
        //         path="/products/:id"
        //         element={<ProductDetails />}
        //     />
        //     <Route path="*" element={<NotFound />} /> */}
        // </Routes>
          return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart/>}/>
             <Route path="/shop" element={<Shop/>}/>
         <Route path="/products/:id" element={<ProductDetail />} />
            {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    );

}

export default App;
