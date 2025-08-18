import React from 'react';
import { Fade } from 'react-awesome-reveal';
import BottomNavigation from "./BottomNavigation";

const PaymentSelector = ({ methods, selected, onSelect, onNext, onBack, placeOrder}) => {
    return (
        <div className="p-2">
            <h2 className="text-xl font-semibold mb-4">💳 Select Payment Method</h2>
            <Fade cascade>
                <div className="grid gap-2">
                    {methods.map((method) => (
                        <div
                            key={method.id}
                            onClick={() => onSelect(method)}
                            className={`px-4 py-2 font-semibold rounded-xl border shadow-sm cursor-pointer transition-all duration-200 ${
                                selected?.id === method.id
                                    ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <p>{method.name}</p>
                        </div>
                    ))}
                </div>
            </Fade>

            <BottomNavigation onBack={onBack} onNext={onNext} selected={selected} placeOrder={placeOrder}/>
        </div>
    );
};

export default PaymentSelector;
