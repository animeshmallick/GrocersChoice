// src/components/Footer.jsx
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Footer = () => {
    const isProdEnv = window.location.hostname.indexOf("www.") >= 0;

    return (
        <motion.footer
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-white py-4 text-center relative shadow-xl rounded-t-2xl"
        >
            {/* Top subtle glow line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 animate-pulse"></div>

            <p className="text-sm opacity-80">
                &copy; {new Date().getFullYear()}{" "}
                <span className="font-semibold">Grocer&apos;s Choice</span>. All
                rights reserved.
            </p>

            {/* Powered By Section */}
            <motion.div
                whileHover={{ scale: 1.1, rotate: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mt-1 flex items-center justify-center gap-2"
            >
                <Sparkles className="text-yellow-300 animate-pulse" size={18} />
                <a
                    href="https://www.quickchoice.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-300 hover:text-yellow-300 transition-all text-lg drop-shadow-lg"
                >
                    Powered by QuickChoice
                </a>
            </motion.div>

            {/* Version (only in non-prod) */}
            {!isProdEnv && (
                <p className="text-xs mt-1 text-gray-300 italic">
                    Version: 1.1.2
                </p>
            )}
        </motion.footer>
    );
};

export default Footer;
