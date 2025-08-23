import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import CartFooter from "../components/CartFooter";
import CategoryHolder from "../components/CategoryHolder";
import LoadingSkeleton from "../components/Loading/LoadingSkeleton";
import PageTitle from "../components/PageTitle";
import { useProducts } from "../hooks/useProducts";
import { getAllCategories } from "../helpers/HomePageHelper";
import { motion } from "framer-motion";

const CategoriesPage = () => {
    const { data, isLoading, error } = useProducts();
    const categoriesData = getAllCategories(data);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 via-lime-50 to-white"
        >
            <Header />
            <main className="flex-grow px-4 md:px-10">
                <PageTitle title="🌟 Explore Product Categories" />

                {isLoading && <LoadingSkeleton count={8} variant="card" />}

                {error && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center text-red-600 py-8"
                    >
                        <p className="font-semibold text-lg">⚠ Oops! Failed to load categories</p>
                        <button
                            className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </motion.div>
                )}

                {!isLoading && !error && categoriesData && Object.keys(categoriesData).length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.15 },
                            },
                        }}
                    >
                        {Object.entries(categoriesData).map(([mainCategory, subCategories]) => (
                            <CategoryHolder
                                key={mainCategory}
                                mainCategory={mainCategory}
                                subCategories={subCategories}
                            />
                        ))}
                    </motion.div>
                ) : (
                    !isLoading &&
                    !error && (
                        <p className="text-center text-gray-500 py-8 text-lg tracking-wide">
                            No categories available right now. Check back later!
                        </p>
                    )
                )}
            </main>
            <CartFooter />
            <Footer />
        </motion.div>
    );
};

export default CategoriesPage;
