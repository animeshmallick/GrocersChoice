import {motion} from "framer-motion";
import React from "react";
import {useNavigate} from "react-router-dom";
import Divider from "../Divider";

const BottomNavigation = ({onBack}) => {
    const navigate = useNavigate();
    return (
        <motion.div
            className="flex flex-wrap justify-between items-center gap-2 pb-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Divider />
            {/* Back Button */}
            {onBack === null && (<button></button>)}
            {onBack !== null && (
                <button
                    onClick={onBack}
                    className="text-gray-600 hover:text-black text-sm md:text-base transition-colors duration-300"
                >
                    ← Back
                </button>
            )}

            {/* Go to Cart Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/cart")}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-1.5 px-4 md:px-6 rounded-lg shadow-md transition-colors duration-300"
            >
                🛒 Go to Cart
            </motion.button>
        </motion.div>
    );
}
export default BottomNavigation;