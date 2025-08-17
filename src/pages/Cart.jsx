import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import CartHelper from "../helpers/CartHelper";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthHelper from "../helpers/AuthHelper";
import PageTitle from "../components/PageTitle";
import ContinueShopping from "../components/buttons/ContinueShopping";
import ProceedToCheckout from "../components/buttons/ProceedToCheckout";
import CartLogin from "../components/buttons/CartLogin";
import ClearCart from "../components/buttons/ClearCart";
import CartSummary from "../components/checkout/CartSummary";
import Config from "../../config";
import PreviouslyBought from "../components/PreviouslyBought";
import { useProducts } from "../hooks/useProducts";

const CartPage = () => {
    const [localCart, setLocalCart] = useState(CartHelper.getStoredCart());
    const [cart, setCart] = useState({ products: [], bill: null });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [previouslyBoughtProducts, setPreviouslyBoughtProducts] = useState([]);

    const { data: allProducts, isLoading, error } = useProducts();

    /** 🔹 Fetch most-ordered products */
    const getPreviouslyBoughtProducts = async () => {
        try {
            const { data } = await axios.get(
                `${Config.getBackendDomain()}/mostOrderedProduct`,
                {
                    headers: {
                        accept: "application/json",
                        "x-authorization": `Bearer ${AuthHelper.getToken()}`,
                        'x-storename': Config.getStoreName()
                    },
                }
            );

            // Extract product IDs from response: [{ product_id: 14 }, ...]
            const productIds = data.map((item) => item.product_id);

            if (allProducts && productIds.length > 0) {
                console.log(allProducts);
                // Match IDs with products list (make sure key matches your useProducts hook)
                const matched = allProducts.filter((p) =>
                    productIds.includes(p.id)
                );
                console.log(matched);
                setPreviouslyBoughtProducts(matched);
            } else {
                setPreviouslyBoughtProducts([]);
            }
        } catch (err) {
            console.error("Error fetching previously bought products:", err);
            setPreviouslyBoughtProducts([]);
        }
    };

    /** 🔹 Fetch Cart Data */
    useEffect(() => {
        const fetchCartData = async () => {
            if (localCart && localCart.length > 0) {
                try {
                    const res = await axios.post(
                        `${Config.getBackendDomain()}/cart`,
                        localCart,
                        {
                            headers: {'x-storename': Config.getStoreName()}
                        }
                    );
                    setCart(res.data);
                } catch (err) {
                    console.error("Error fetching cart data:", err);
                    setCart({ products: [], bill: null });
                }
            } else {
                setCart({ products: [], bill: null });
            }
        };

        fetchCartData();
    }, [localCart]);

    /** 🔹 Validate Login + Fetch Previously Bought */
    useEffect(() => {
        const validateAndFetch = async () => {
            const loggedIn = await AuthHelper.isLoggedIn();
            setIsLoggedIn(loggedIn);

            if (loggedIn) {
                await getPreviouslyBoughtProducts();
            }
        };
        validateAndFetch();
    }, [allProducts]); // depends on products loaded

    const onUpdate = () => {
        setLocalCart(CartHelper.getStoredCart());
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
            <Header />

            <main className="flex-grow px-2 sm:px-6 md:px-12 py-3">
                <PageTitle title={"🛒 Your Cart"} size={"small"} />

                {/* Cart Summary */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={cart.products.length}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <CartSummary
                            products={cart.products}
                            bill={cart.bill}
                            showBillFlag={true}
                            onUpdate={onUpdate}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Cart Buttons */}
                <div className="flex justify-center mt-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md"
                    >
                        {!isLoggedIn ? <CartLogin /> : <ProceedToCheckout />}
                        <ContinueShopping />
                        <ClearCart onClear={onUpdate} />
                    </motion.div>
                </div>

                {/* Previously Bought Section */}
                {isLoggedIn && previouslyBoughtProducts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mt-10"
                    >
                        <PreviouslyBought products={previouslyBoughtProducts} />
                    </motion.div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default CartPage;
