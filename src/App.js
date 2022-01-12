import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';
import { Products, Navbar, Cart, Checkout } from './components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const fetchProducts = async () => {
        const { data } = await commerce.products.list();

        setProducts(data);
    }

    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
    }

    const handleAddToCart = async(productId, quantity) => {
        const item = await commerce.cart.add(productId, quantity);
        setCart(item.cart);
    }

    const handleUpdateCartQty = async (productId, quantity) => {
        const { cart } = await commerce.cart.update(productId, { quantity });
        setCart(cart);
    }

    const handleRemoveFromCart = async (productId) => {
        const { cart } = await commerce.cart.remove(productId);
        setCart(cart);
    }

    const handleEmptyCart = async () => {
        const { cart } = await commerce.cart.empty();
        setCart(cart);
    }

    const refreshCart = async () => {
        const { cart } = await commerce.cart.empty();
        setCart(cart);
        console.log("Cart refreshed");
        console.log(cart);
    }

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            /*const incomingOrder = await commerce.checkout.capture(checkoutTokenId);
            setOrder(incomingOrder);*/
            refreshCart();
            console.log("Called refresh cart");

        } catch (error) {
            setErrorMessage(error.data.error.message);
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    console.log(cart);


    return (
        <Router>
            <div>
                <Navbar totalItems={cart.total_items}/>
                <Routes>
                    <Route exact path="/" element={<Products products={products} onAddToCart={handleAddToCart}/>}>
                        {/*<Products products={products} onAddToCart={handleAddToCart}/>*/}
                    </Route>
                    <Route exact path="/cart" element={<Cart cart={cart} handleUpdateCartQty={handleUpdateCartQty} handleRemoveFromCart={handleRemoveFromCart} handleEmptyCart={handleEmptyCart} />}>
                        {/*<Cart cart={cart} />*/}
                    </Route>
                    <Route exact path="/checkout" element={<Checkout cart={cart} order={order} onCaptureCheckout={handleCaptureCheckout} error={errorMessage}/>}>
                    </Route>
                </Routes>   
            </div>
        </Router>
       
    )
}

export default App
