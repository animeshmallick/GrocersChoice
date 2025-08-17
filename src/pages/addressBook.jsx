import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthHelper from "../helpers/AuthHelper";
import { useNavigate } from "react-router-dom";
import Config from "../../config";

const AddressBookPage = () => {
    const navigate = useNavigate();
    const [userAddresses, setUserAddresses] = useState([]);
    const [storeAddress, setStoreAddress] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loadingAddressId, setLoadingAddressId] = useState(null);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(null);
    const [newAddress, setNewAddress] = useState({
        address_label: "",
        addr_line1: "",
        addr_line2: "",
        city: "",
        state: "",
        pincode: "",
    });
    const [adding, setAdding] = useState(false);

    // 🔑 Ref for Add Address popup
    const addPopupRef = useRef(null);

    // Close Add Address popup if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addPopupRef.current && !addPopupRef.current.contains(event.target))
                setShowAddPopup(false);
        };
        showAddPopup ?
            document.addEventListener("mousedown", handleClickOutside) :
            document.removeEventListener("mousedown", handleClickOutside);

        return () => {document.removeEventListener("mousedown", handleClickOutside);};
    }, [showAddPopup]);

    // Fetch user addresses
    const fetchAddresses = async () => {
        try {
            const token = AuthHelper.getToken();
            const res = await axios.get(`${Config.getBackendDomain()}/getUserAddresses`, {
                headers: {
                    Accept: "application/json",
                    "x-authorization": `Bearer ${token}`,
                },
            });

            setUserAddresses(res.data?.userAddress || []);
            setStoreAddress(res.data?.storeAddress || null);
        } catch (err) {
            console.error("Error fetching addresses:", err);
            setUserAddresses([]);
            setStoreAddress(null);
        }
    };

    // Set default address
    const handleSetDefault = async (addressId) => {
        try {
            setLoadingAddressId(addressId);
            const token = AuthHelper.getToken();
            const res = await axios.post(
                `${Config.getBackendDomain()}/setDefaultAddress`,
                { address_id: addressId },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-authorization": `Bearer ${token}`,
                    },
                }
            );

            if (res.status === 200 && res.data?.success) {
                setUserAddresses((prev) =>
                    prev.map((addr) => ({
                        ...addr,
                        isDefault: addr.address_id === addressId,
                    }))
                );
            }
        } catch (err) {
            console.error("Error setting default address:", err);
        } finally {
            setLoadingAddressId(null);
        }
    };

    // Delete address
    const handleDeleteAddress = async (addressId) => {
        try {
            setLoadingAddressId(addressId);
            const token = AuthHelper.getToken();
            const res = await axios.get(`${Config.getBackendDomain()}/deleteAddress/${addressId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-authorization": `Bearer ${token}`,
                },
            });

            if (res.status === 200 && res.data?.status) {
                setUserAddresses((prev) =>
                    prev.filter((addr) => addr.address_id !== addressId)
                );
            }
        } catch (err) {
            console.error("Error deleting address:", err);
        } finally {
            setLoadingAddressId(null);
            setShowDeletePopup(null);
        }
    };

    // Add new address
    const handleAddAddress = async () => {
        try {
            setAdding(true);
            const token = AuthHelper.getToken();
            const res = await axios.post(
                `${Config.getBackendDomain()}/addAddress`,
                newAddress,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-authorization": `Bearer ${token}`,
                    },
                }
            );

            if (res.status === 200 && res.data?.success) {
                setShowAddPopup(false);
                setNewAddress({
                    address_label: "",
                    addr_line1: "",
                    addr_line2: "",
                    city: "",
                    state: "",
                    pincode: "",
                });
                fetchAddresses();
            }
        } catch (err) {
            console.error("Error adding address:", err);
        } finally {
            setAdding(false);
        }
    };

    // Initial load
    useEffect(() => {
        const init = async () => {
            const loggedIn = await AuthHelper.isLoggedIn();
            setIsLoggedIn(loggedIn);
            if (!loggedIn) {
                navigate("/login?source=addressBook");
                return;
            }
            fetchAddresses();
        };
        init();
    }, [navigate]);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
            <Header />

            <main className="flex-grow px-2 sm:px-6 md:px-12 py-3">
                <h2 className="text-3xl font-bold text-center text-green-800 mb-4">
                    My Address Book 🏠
                </h2>

                <div className="flex justify-center mb-3">
                    <motion.button
                        onClick={() => setShowAddPopup(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        + Add New Address
                    </motion.button>
                </div>

                {/* Address list */}
                <motion.div className="bg-gray-200 rounded-lg mx-3 p-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {userAddresses.length > 0 ? (
                            userAddresses.map((address) => (
                                <motion.div
                                    key={address.address_id}
                                    layout
                                    className={`bg-white shadow-xl rounded-xl px-3 py-2 relative transition-all duration-300 ${
                                        address.isDefault
                                            ? "border-4 border-blue-500 shadow-2xl"
                                            : "border-l-4 border-green-400"
                                    }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-lg text-green-700">
                                            {address.address_label}
                                        </h4>
                                        {address.isDefault && (
                                            <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600">
                                        {address.addr_line1}, {address.addr_line2}
                                    </p>
                                    <p className="text-gray-600">
                                        {address.city}, {address.state} -{" "}
                                        <span className="font-medium text-gray-800">{address.pincode}</span>
                                    </p>
                                    <div className="mt-2 flex justify-between items-center text-sm">
                                        <button className="text-green-600 hover:text-green-800 font-medium">
                                            Edit
                                        </button>
                                        {!address.isDefault && (
                                            <button
                                                onClick={() => handleSetDefault(address.address_id)}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                                disabled={loadingAddressId === address.address_id}
                                            >
                                                {loadingAddressId === address.address_id ? "Updating..." : "Set Default"}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setShowDeletePopup(address.address_id)}
                                            className="text-red-600 hover:text-red-800 font-medium"
                                            disabled={loadingAddressId === address.address_id}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 col-span-2">
                                No saved addresses found.
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Store address (pickup location) */}
                {storeAddress && (
                    <motion.div
                        className="bg-yellow-50 shadow-xl rounded-xl px-4 py-2 border-l-4 border-yellow-500 mt-4"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg text-yellow-700">
                                {storeAddress.store_name} 🏪
                            </h4>
                            <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                                Pickup Location
                            </span>
                        </div>
                        <p className="text-gray-700">
                            {storeAddress.addr_line1}, {storeAddress.addr_line2}
                        </p>
                        <p className="text-gray-700">
                            {storeAddress.city}, {storeAddress.state} -{" "}
                            <span className="font-medium text-gray-800">{storeAddress.pincode}</span>
                        </p>
                    </motion.div>
                )}
            </main>

            <Footer />

            {/* Add Address Popup */}
            <AnimatePresence>
                {showAddPopup && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            ref={addPopupRef} // 🔑 attach ref
                            className="m-6 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <h3 className="text-xl font-bold text-green-700 mb-4">Add New Address</h3>

                            <div className="space-y-2">
                                {["address_label","addr_line1","addr_line2","city","state","pincode"].map((field, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        placeholder={field.replace("_"," ").toUpperCase()}
                                        value={newAddress[field]}
                                        onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-1"
                                    />
                                ))}
                            </div>

                            <div className="mt-4 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowAddPopup(false)}
                                    className="px-4 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddAddress}
                                    disabled={adding}
                                    className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    {adding ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Popup */}
            <AnimatePresence>
                {showDeletePopup && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl shadow-2xl mx-8 p-6 w-full max-w-sm text-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <h3 className="text-lg font-semibold text-red-600 mb-3">
                                Delete Address?
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to permanently delete this address?
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setShowDeletePopup(null)}
                                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteAddress(showDeletePopup)}
                                    disabled={loadingAddressId === showDeletePopup}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    {loadingAddressId === showDeletePopup ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddressBookPage;