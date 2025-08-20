import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Divider from "./Divider";
import { Fade } from "react-awesome-reveal";

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
};

const CategoryHolder = React.memo(({ mainCategory, subCategories }) => {
    const navigate = useNavigate();

    return (
        <motion.section variants={cardVariants}>
            <Fade direction="up" triggerOnce>
                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative inline-block text-2xl font-semibold tracking-tight
                   text-gray-800 dark:text-gray-100 drop-shadow-sm mb-3"
                >
                    {mainCategory || "Category"}

                    {/* Sleek underline */}
                    <span className="absolute left-0 bottom-[-6px] w-full h-[3px]
                         bg-emerald-500 rounded-full shadow-sm animate-expandLine"></span>

                    {/* Soft glowing dot at the end */}
                    <span className="absolute bottom-[-6px] left-w-full w-2 h-2 rounded-full
                         bg-emerald-400 shadow-md animate-pulseDot"></span>
                </motion.h2>
            </Fade>



            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {subCategories?.map((sub, i) => {
                    const imgUrl =
                        sub?.image
                            ? `https://bsquaresupermart-images.s3.ap-south-1.amazonaws.com/productImages/thumbnail/${sub.image}`
                            : "/images/default-category.png";

                    return (
                        <motion.div
                            key={`${sub.category}-${i}`}
                            variants={cardVariants}
                            whileHover={{ scale: 1.05, y: -5, rotateX: 3, rotateY: -3 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 250, damping: 20 }}
                            onClick={() =>
                                sub?.category &&
                                navigate(`/Category/${encodeURIComponent(sub.category)}`)
                            }
                            role="button"
                            aria-label={`Go to ${sub?.category || "subcategory"}`}
                            className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl
               cursor-pointer group transition-all duration-300"
                        >
                            {/* Background image */}
                            <motion.img
                                src={imgUrl}
                                alt={sub?.category || "Category"}
                                loading="lazy"
                                className="h-32 w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

                            {/* Enhanced Category Name Container */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.05, type: "spring", stiffness: 120 }}
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2
                   bg-white/10 backdrop-blur-lg rounded-full shadow-md
                   group-hover:scale-110 group-hover:shadow-emerald-500/40
                   transition-all duration-500 flex items-center justify-center"
                            >
                                {/* Shiny gradient text effect */}
                                <span className="relative text-white font-semibold text-sm sm:text-base tracking-wide">
            <span className="font-bold bg-gradient-to-r from-emerald-200 via-white to-lime-200 bg-clip-text text-transparent animate-[shine_3s_linear_infinite]">
                {sub?.category || "Subcategory"}
            </span>
        </span>
                            </motion.div>

                            {/* Hover ripple aura */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-emerald-200/20 transition duration-500"></div>
                        </motion.div>

                    );
                })}
            </div>

            <Divider gradient />
        </motion.section>
    );
});

export default CategoryHolder;
