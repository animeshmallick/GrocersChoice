import { motion } from "framer-motion";
import Divider from "./Divider";

const PageTitle = ({ title, size = "large" }) => {
    if (!title) return null;

    const MotionTag = size === "small" ? motion.h2 : motion.h1;
    const textSize = size === "small" ? "text-2xl" : "text-3xl";

    return (
        <div className="relative flex flex-col items-center">
            <MotionTag
                className={`
                    ${textSize} font-extrabold text-center tracking-tight
                    text-gray-900 dark:text-gray-100
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <span className="relative inline-block">{title}</span>
            </MotionTag>

            {/* Elegant underline */}
            <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                className="mt-1 w-24 h-[3px] bg-emerald-500/80 rounded-full origin-left"
            />

            {/* Divider (subtle professional line) */}
            <div className="w-2/3">
                <Divider />
            </div>
        </div>
    );
};

export default PageTitle;
