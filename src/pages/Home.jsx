import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "orders"));
                const ordersData = {};

                querySnapshot.forEach((doc) => {
                    const order = doc.data();
                    if (ordersData[order.roomNo]) {
                        ordersData[order.roomNo].push(order);
                    } else {
                        ordersData[order.roomNo] = [order];
                    }
                });

                // Update rooms with orders
                const updatedRooms = allRooms.map((room) => ({
                    ...room,
                    orders: ordersData[room.id] || [],
                }));

                setRooms(updatedRooms);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);


    const handleViewOrders = (room) => {
        if (!room.orders || room.orders.length === 0) {
            alert(`No orders available for Room ${room.id}.`);
            return;
        }

        setSelectedRoomOrders(room); // Store the room details in state to show the pop-up
    };


    const closePopup = () => {
        setSelectedRoomOrders(null);
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <div className="hero-section">
                <img src="/assets/1005.jpg" alt="Hotel" className="hero-image" />
                <div className="overlay">
                    <h3 style={{ color: "white" }}>Raj Mahal Rooms & Banquet</h3>
                    <button className="icon-button">🔔</button>
                </div>
            </div>


            {/* Listings */}
            <div className="room-list">
                {rooms
                    .filter(room => room.orders && room.orders.length > 0) // Only show rooms with orders
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

            {/* Pop-up for Orders */}
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
                        <button className="close-popup" onClick={closePopup}>
                            Close
                        </button>
                    </div>
                </div>
            )}
            {/* Bottom Navigation */}
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

                <Link to="menu" className="nav-icon">
                    <span className="material-icons">restaurant_menu</span>
                    <span>Menu</span>
                </Link>


                <Link to="/bill" className="nav-icon" state={{ orders: rooms.flatMap(room => room.orders) }}>

                    <span className="material-icons">receipt</span>
                    <span>Bill</span>
                </Link>
            </div>
        </div>
    );
};
export default Home;

