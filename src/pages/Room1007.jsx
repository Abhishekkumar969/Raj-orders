import React, { useState, useEffect } from "react";
import { menuItems } from "../components/Menu";
import { db } from "../firebaseConfig"; // Import Firestore database
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions separately

import "./Room.css"; // Ensure you have a CSS file for styling

const Room1007 = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const storedOrders = JSON.parse(localStorage.getItem("room1007Orders")) || [];
        setOrders(storedOrders);
    }, []);

    useEffect(() => {
        localStorage.setItem("room1007Orders", JSON.stringify(orders));
    }, [orders]);

    const updateOrder = (item, qty) => {
        if (qty === 0) {
            setOrders(orders.filter(order => order.name !== item.name));
        } else {
            setOrders(prevOrders => {
                const existingOrder = prevOrders.find(order => order.name === item.name);
                if (existingOrder) {
                    return prevOrders.map(order => order.name === item.name ? { ...order, qty } : order);
                }
                return [...prevOrders, { name: item.name, qty, price: item.price }];
            });
        }
    };

    const submitOrder = async () => {
        if (orders.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        try {
            const roomNumber = "1007"; // Set Room No. Here (Change dynamically if needed)

            const orderData = {
                roomNo: roomNumber, // Add room number to Firestore
                items: orders,
                totalAmount: orders.reduce((acc, item) => acc + item.price * item.qty, 0),
                timestamp: new Date()
            };

            console.log("Submitting order:", orderData); // Debug log before submitting

            const docRef = await addDoc(collection(db, "orders"), orderData);

            console.log("Order submitted, document ID:", docRef.id); // Debug log after submitting

            alert(`Order from Room ${roomNumber} submitted successfully!`);
            setOrders([]);
            localStorage.removeItem("room1007Orders");
        } catch (error) {
            console.error("Error submitting order:", error.message); // Log exact error message
            alert("Failed to submit order: " + error.message);
        }
    };




    return (
        <div className="menu-container">
            <h2 className="restaurant-title">Raj Mahal Rooms & Banquet Hall</h2>
            <p className="delivery-time">30-35 mins</p>
            <div className="menu-list">
                {menuItems.map((item) => {
                    const order = orders.find(order => order.name === item.name);
                    return (
                        <div key={item.id} className="menu-item">
                            <div className="menu-content">
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p className="item-price">₹{item.price}</p>
                                    <p className="item-description">{item.description}</p>
                                </div>
                            </div>
                            <div className="order-controls">
                                {order ? (
                                    <div className="counter">
                                        <button onClick={() => updateOrder(item, order.qty - 1)}>-</button>
                                        <span>{order.qty}</span>
                                        <button onClick={() => updateOrder(item, order.qty + 1)}>+</button>
                                    </div>
                                ) : (
                                    <button className="add-button" onClick={() => updateOrder(item, 1)}>ADD</button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {orders.length > 0 && (
                <div className="cart-footer">
                    <p>{orders.length} item(s) added</p>
                    <button className="submit-order" onClick={submitOrder}>
                        Submit Order
                    </button>
                </div>
            )}
        </div>
    );
};

export default Room1007;