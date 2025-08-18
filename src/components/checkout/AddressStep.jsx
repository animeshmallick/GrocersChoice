import React from 'react';
import { Fade } from 'react-awesome-reveal';
import BottomNavigation from "./BottomNavigation";

const AddressSelector = ({ addresses, selected, onSelect, onNext, placeOrder }) => {
    return (
        <div className="p-2">
            <h2 className="text-xl font-semibold mb-1">📍 Select Delivery Address</h2>
            <Fade cascade>
                <div className="grid gap-1">
                    {addresses.map((addr) => (
                        <div
                            key={addr.address_id}
                            onClick={() => onSelect(addr)}
                            className={`pl-4 p-1 rounded-xl border shadow-sm cursor-pointer transition-all duration-200 ${
                                selected?.address_id === addr.address_id
                                    ? 'border-green-500 bg-green-50 scale-[1.02]'
                                    : 'hover:bg-gray-100'
                            } ${addr.address_id === 'pickup_at_store' ? 'bg-yellow-50 hover:bg-yellow-100' : ''}`}
                        >
                            {addr.address_id === 'pickup_at_store' ? (
                                <p className="text-m font-bold">PickUp From Store</p>
                            ): (<p></p>)}
                            <p className="text-m font-semibold">
                                {addr.addr_line1 + " "}
                                <span className="text-sm text-gray-700">
                                    {addr.addr_line2}
                                </span>
                            </p>
                            <p className="text-sm text-gray-500">
                                {addr.city + " " + addr.state + " " + addr.pincode}
                            </p>
                        </div>
                    ))}
                </div>
            </Fade>

            <BottomNavigation onBack={null} onNext={onNext} selected={selected} placeOrder={placeOrder} />
        </div>
    );
};

export default AddressSelector;
