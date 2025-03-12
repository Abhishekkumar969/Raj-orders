import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, deleteDoc, query, where, getDocs, collection } from "firebase/firestore";

import "./Home.css";

const allRooms = [
    { id: 1001, type: "Deluxe", image: "/assets/1001.jpg", orders: [] },
    { id: 1002, type: "Semi-Deluxe", image: "/assets/1002.jpg", orders: [] },
    { id: 1003, type: "Semi-Deluxe", image: "/assets/1003.jpg", orders: [] },
    { id: 1004, type: "Standard", image: "/assets/1004.jpg", orders: [] },
    { id: 1005, type: "Semi-Deluxe", image: "/assets/1005.jpg", orders: [] },
    { id: 1006, type: "Standard", image: "/assets/1001.jpg", orders: [] },
    { id: 1007, type: "Semi-Deluxe", image: "/assets/1002.jpg", orders: [] },
    { id: 1008, type: "Standard", image: "/assets/1003.jpg", orders: [] },
    { id: 1009, type: "Semi-Deluxe", image: "/assets/1004.jpg", orders: [] },
    { id: 1010, type: "Standard", image: "/assets/1003.jpg", orders: [] },
];

const Home = () => {
    const [rooms, setRooms] = useState(allRooms);
    const [selectedRoomOrders, setSelectedRoomOrders] = useState(null);

    const fetchOrders = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "orders"));
            const ordersData = {};

            querySnapshot.forEach((doc) => {
                const order = doc.data();
                if (ordersData[order.roomNo]) {
                    ordersData[order.roomNo].push({ ...order, id: doc.id });
                } else {
                    ordersData[order.roomNo] = [{ ...order, id: doc.id }];
                }
            });

            const updatedRooms = allRooms.map((room) => ({
                ...room,
                orders: ordersData[room.id] || [],
            }));

            setRooms(updatedRooms);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleViewOrders = (room) => {
        if (!room.orders || room.orders.length === 0) {
            alert(`No orders available for Room ${room.id}.`);
            return;
        }
        setSelectedRoomOrders(room);
    };



    const handleCheckout = async (roomNo) => {
        try {
            console.log("Checking out room:", roomNo); // Debugging log

            const ordersRef = collection(db, "orders");
            const q = query(ordersRef, where("roomNo", "==", String(roomNo))); // 🔥 Ensure roomNo is a string

            const querySnapshot = await getDocs(q);
            console.log("Orders found for checkout:", querySnapshot.size);

            if (querySnapshot.empty) {
                alert(`No orders found for Room ${roomNo}.`);
                return;
            }

            // Delete all orders for this room
            const deletePromises = querySnapshot.docs.map((document) => {
                console.log("Deleting order ID:", document.id);
                return deleteDoc(doc(db, "orders", document.id));
            });

            await Promise.all(deletePromises);

            alert(`Orders for Room ${roomNo} have been checked out successfully.`);
            fetchOrders(); // Refresh UI with updated data
            setSelectedRoomOrders(null); // Close popup
        } catch (error) {
            console.error("Error during checkout:", error);
            alert("Error checking out. Please try again.");
        }
    };





    const closePopup = () => {
        setSelectedRoomOrders(null);
    };

    return (
        <div className="home-container">
            <div className="hero-section">
                <img src="/assets/1005.jpg" alt="Hotel" className="hero-image" />
                <div className="overlay">
                    <h3 style={{ color: "white" }}>Raj Mahal Rooms & Banquet</h3>
                    <button className="icon-button">🔔</button>
                </div>
            </div>

            <div className="room-list">
                {rooms
                    .filter(room => room.orders && room.orders.length > 0)
                    .map((room) => (
                        <div key={room.id} className="room-card">
                            <img style={{ width: "100%" }} src={room.image} alt={`Room ${room.id}`} className="room-img" />
                            <div className="room-details">
                                <h3>Room {room.id}</h3>
                                <button style={{ backgroundColor: "green", width: "100%", borderRadius: "5px" }} onClick={() => handleViewOrders(room)}>
                                    View Orders
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>

            {selectedRoomOrders && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Orders for Room {selectedRoomOrders.id}</h2>
                        <table className="popup-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedRoomOrders.orders.map((order, index) =>
                                    order.items.map((item, i) => (
                                        <tr key={`${index}-${i}`}>
                                            <td>{item.name}</td>
                                            <td>{item.qty}</td>
                                            <td>₹{item.price}</td>
                                            <td>₹{item.qty * item.price}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <h3>Total Amt: ₹{selectedRoomOrders.orders.reduce((total, order) => total + order.items.reduce((sum, item) => sum + item.qty * item.price, 0), 0)}</h3>
                        <button className="close-popup" onClick={closePopup}>
                            Close
                        </button>
                        <button className="checkout-button" onClick={() => handleCheckout(selectedRoomOrders.id)}>
                            Checkout
                        </button>
                    </div>
                </div>
            )}

            <div className="bottom-nav">
                <Link
                    to="/allOrders"
                    state={{ orders: rooms.filter(room => room.orders.length > 0) }}
                    className="nav-icon"
                >
                    <span className="material-icons">restaurant</span>
                    <span>All Orders</span>
                </Link>

                <Link to="/" className="nav-icon active">
                    <span className="material-icons">home</span>
                    <span>Home</span>
                </Link>

                {/* <Link to="menu" className="nav-icon">
                    <span className="material-icons">restaurant_menu</span>
                    <span>Menu</span>
                </Link> */}

                <Link to="/bill" className="nav-icon" state={{ orders: rooms.flatMap(room => room.orders) }}>
                    <span className="material-icons">receipt</span>
                    <span>Bill</span>
                </Link>
            </div>
        </div>
    );
};

export default Home;
