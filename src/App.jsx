import React from 'react';

import {  Routes, Route } from "react-router-dom";

import Home from './component/Home';
import Cart from './component/Cart';
import Shop from "./component/Shop";
import ProductDetail from './component/ProductDetail';
import Checkout from './component/Checkout';
import Account from './component/Account';
import Brands from './component/Brands';
import { Login, Register, RequireAuth } from './component/Auth';
import { ForgotPassword, ResetPassword } from './component/PasswordReset';


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
            <Route path="/sale" element={<Shop/>}/>
            <Route path="/new-arrivals" element={<Shop/>}/>
            <Route path="/brands" element={<Brands/>}/>
            <Route path="/account" element={<RequireAuth><Account /></RequireAuth>}/>
         <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
            <Route path="*" element={<Home />} />
            {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    );

}

export default App;
