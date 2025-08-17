// src/components/PreviouslyBought.jsx
import React from "react";
import { motion } from "framer-motion";
import ProductContainer from "./Category/ProductContainer";
import { ShoppingBag } from "lucide-react";

const PreviouslyBought = ({ products }) => {
    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <ShoppingBag size={40} className="mb-2" />
                <p>No previous purchases yet.</p>
            </div>
        );
    }

    return (
        <div className="px-4 py-6">
            {/* Heading */}
            <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="text-emerald-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                    Previously Bought
                </h2>
            </div>

            {/* Product grid */}
            <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            >
                {products.map((product, idx) => (
                    <motion.div
                        key={product.productId || idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <ProductContainer product={product} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default PreviouslyBought;
