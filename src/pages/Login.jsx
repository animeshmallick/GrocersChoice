// src/pages/LoginPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthHelper from "../helpers/AuthHelper";
import { FaEye, FaEyeSlash, FaUser, FaUserShield } from "react-icons/fa";
import Config from "../../config";

const LoginPage = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword((prev) => !prev);

    const queryParams = new URLSearchParams(location.search);
    const source = queryParams.get("source");

    useEffect(() => {
        const checkLogin = async () => {
            const isLoggedIn = await AuthHelper.isLoggedIn();
            if (isLoggedIn) {
                navigate("/" + (source || ""));
            }
        };
        checkLogin();
    }, [navigate, source]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const endpoint =
                role === "admin"
                    ? `${Config.getBackendDomain()}/adminLogin`
                    : `${Config.getBackendDomain()}/login`;

            const res = await axios.post(
                endpoint,
                { phone, password },
                { headers: { "x-storename": Config.getStoreName() } }
            );

            if (res.data.hasOwnProperty("authToken") || res.data.hasOwnProperty("adminAuthToken")) {
                sessionStorage.setItem(
                    role === "admin" ? "adminAuthToken" : "authToken",
                    role === "admin" ? res.data.adminAuthToken : res.data.authToken
                );

                navigate(role === "admin" ? "/adminDashboard" : source ? "/" + source : "/");
            } else {
                setError("Login failed: No token received.");
            }
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 400) {
                setError("Invalid phone or password.");
            } else {
                setError("Something went wrong. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 via-teal-100 to-yellow-100" />
            <motion.div
                animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-80 h-80 bg-emerald-400/30 rounded-full blur-3xl top-10 left-10"
            />
            <motion.div
                animate={{ y: [0, -20, 0], x: [0, -30, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl bottom-20 right-10"
            />

            {/* Login Card */}
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative bg-white/80 backdrop-blur-2xl shadow-2xl rounded-3xl p-8 w-full max-w-md border border-gray-200"
            >
                <h2 className="text-3xl font-extrabold text-emerald-700 text-center mb-2">
                    Welcome, 👋
                </h2>
                <h5 className="font-semibold text-gray-600 text-center mb-6">
                    Please login to continue
                </h5>

                {/* Role Selector */}
                <div className="flex justify-center mb-8">
                    <div className="flex bg-gray-100 rounded-full p-1 shadow-inner">
                        <button
                            type="button"
                            onClick={() => setRole("customer")}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                                role === "customer"
                                    ? "bg-emerald-500 text-white shadow-md"
                                    : "text-gray-500 hover:text-emerald-600"
                            }`}
                        >
                            <FaUser /> Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("admin")}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                                role === "admin"
                                    ? "bg-purple-600 text-white shadow-md"
                                    : "text-gray-500 hover:text-purple-600"
                            }`}
                        >
                            <FaUserShield /> Admin
                        </button>
                    </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="number"
                            placeholder="9999988888"
                            className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full mt-1 px-4 py-2 pr-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePassword}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition"
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-sm text-center"
                        >
                            {error}
                        </motion.p>
                    )}

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: isLoading ? 1 : 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`w-full ${
                            role === "admin" ? "bg-purple-600 hover:bg-purple-700" : "bg-emerald-600 hover:bg-emerald-700"
                        } font-bold text-white py-2 rounded-xl transition duration-300 shadow-lg ${
                            isLoading ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                    >
                        {isLoading
                            ? "Logging in..."
                            : role === "admin"
                                ? "Login as Admin →"
                                : "Login as Customer →"}
                    </motion.button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6 mb-4">
                    Don’t have an account?{" "}
                    <span className="text-emerald-600 hover:underline cursor-pointer font-semibold">
                        Sign up
                    </span>
                </p>

                <motion.button
                    onClick={() => navigate("/")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-900 text-base font-bold px-6 py-2 rounded-xl shadow-md transition-all duration-300"
                >
                    ← Back to Home
                </motion.button>
            </motion.div>
        </div>
    );
};

export default LoginPage;
