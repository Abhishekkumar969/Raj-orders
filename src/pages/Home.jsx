import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, updateDoc, deleteDoc, query, where, getDocs, collection, onSnapshot } from "firebase/firestore";
import "./Home.css";
import { FaEdit, FaTrash, FaTimes, FaCalendarCheck, FaBoxOpen, FaList, FaPrint, FaBars } from "react-icons/fa";

const notificationSound = "/assets/notification.mp3";

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
    const [bellShake, setBellShake] = useState(false);
    const previousOrdersRef = useRef(new Map()); // Stores previous orders per room
    const [editingItem, setEditingItem] = useState(null);
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const toggleMoreMenu = () => {
        setIsMoreOpen(!isMoreOpen);
    };

    useEffect(() => {
        const ordersCollection = collection(db, "orders");
        const unsubscribe = onSnapshot(ordersCollection, (snapshot) => {
            const ordersData = {};
            const newOrders = new Set();

            snapshot.forEach((doc) => {
                const order = doc.data();
                if (!ordersData[order.roomNo]) {
                    ordersData[order.roomNo] = [];
                }
                ordersData[order.roomNo].push({ ...order, id: doc.id });
            });

            let isNewOrderAdded = false;

            const updatedRooms = allRooms.map((room) => {
                const currentOrders = ordersData[room.id] || [];
                const previousOrders = previousOrdersRef.current.get(room.id) || [];

                // ✅ Check if new orders are added
                if (currentOrders.length > previousOrders.length) {
                    isNewOrderAdded = true;
                    newOrders.add(room.id);
                }

                // Store the latest orders for next comparison
                previousOrdersRef.current.set(room.id, currentOrders);

                return {
                    ...room,
                    orders: currentOrders,
                    newOrder: newOrders.has(room.id),
                };
            });

            if (isNewOrderAdded) {
                playNotificationSound();
                triggerBellShake();
            }

            setRooms(updatedRooms);
        });

        return () => unsubscribe();
    }, []); // ✅ Removed unnecessary dependencies

    const playNotificationSound = () => {
        const audio = new Audio(notificationSound);
        audio.play().catch((error) => console.error("Audio play failed:", error));
    };

    const handleEditChange = async (orderIndex, itemIndex, field, value) => {
        const updatedOrders = [...selectedRoomOrders.orders];
        updatedOrders[orderIndex].items[itemIndex][field] = value;

        setSelectedRoomOrders({ ...selectedRoomOrders, orders: updatedOrders });

        // Update Firestore
        const orderId = selectedRoomOrders.orders[orderIndex].id; // Get order document ID
        const orderRef = doc(db, "orders", orderId);

        try {
            await updateDoc(orderRef, { items: updatedOrders[orderIndex].items });
            console.log("Order updated in Firestore");
        } catch (error) {
            console.error("Error updating Firestore:", error);
        }
    };


    const handleDelete = async (orderIndex, itemIndex) => {
        const updatedOrders = [...selectedRoomOrders.orders];
        updatedOrders[orderIndex].items.splice(itemIndex, 1);

        setSelectedRoomOrders({ ...selectedRoomOrders, orders: updatedOrders });

        // Update Firestore
        const orderId = selectedRoomOrders.orders[orderIndex].id;
        const orderRef = doc(db, "orders", orderId);

        try {
            await updateDoc(orderRef, { items: updatedOrders[orderIndex].items });
            console.log("Item deleted in Firestore");
        } catch (error) {
            console.error("Error deleting item from Firestore:", error);
        }
        if (updatedOrders[orderIndex].items.length === 0) {
            await deleteDoc(orderRef);
            updatedOrders.splice(orderIndex, 1);
        }

    };


    const triggerBellShake = () => {
        setBellShake(true);
        setTimeout(() => setBellShake(false), 3000);
    };

    const handleViewOrders = (room) => {
        if (!room.orders || room.orders.length === 0) {
            alert(`No orders available for Room ${room.id}.`);
            return;
        }
        setSelectedRoomOrders(room);
    };

    const handleCheckout = async (roomNo) => {
        try {
            const ordersRef = collection(db, "orders");
            const q = query(ordersRef, where("roomNo", "==", roomNo.toString())); // Ensure roomNo is a string
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert(`No orders found for Room ${roomNo}.`);
                return;
            }

            const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            // ✅ Remove deleted orders from UI
            setRooms((prevRooms) =>
                prevRooms.map((room) =>
                    room.id === roomNo ? { ...room, orders: [] } : room
                )
            );

            setSelectedRoomOrders(null); // Close popup
            // alert(`Checkout successful for Room ${roomNo}`);
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
            {/* More Options Button */}

            <div className="hero-section">
                <img src="/assets/1005.jpg" alt="Hotel" className="hero-image" />
                <div className="overlay">
                    <h3 style={{ color: "white" }}>Raj Mahal Rooms & Banquet Hall</h3>
                </div>
                <button className={`icon-button ${bellShake ? "shake" : ""}`}>🔔</button>
            </div>

            <div className="room-list">
                {rooms
                    .filter((room) => room.orders.length > 0)
                    .map((room) => (
                        <div key={room.id} className="room-card">
                            <img style={{ width: "100%" }} src={room.image} alt={`Room ${room.id}`} className="room-img" />
                            <div className="room-details">
                                <h3>Room {room.id}</h3>
                                <button
                                    style={{ backgroundColor: "green", width: "100%", borderRadius: "5px" }}
                                    onClick={() => handleViewOrders(room)}
                                >
                                    View Orders
                                </button>
                            </div>
                        </div>
                    ))}
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
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedRoomOrders.orders.map((order, orderIndex) =>
                                    order.items.map((item, itemIndex) => (
                                        <tr key={`${orderIndex}-${itemIndex}`}>
                                            <td>
                                                {editingItem?.orderIndex === orderIndex && editingItem?.itemIndex === itemIndex ? (
                                                    <input
                                                        type="text"
                                                        value={item.name}
                                                        onChange={(e) => handleEditChange(orderIndex, itemIndex, "name", e.target.value)}
                                                    />
                                                ) : (
                                                    item.name
                                                )}
                                            </td>
                                            <td>
                                                {editingItem?.orderIndex === orderIndex && editingItem?.itemIndex === itemIndex ? (
                                                    <input
                                                        type="number"
                                                        value={item.qty}
                                                        onChange={(e) => handleEditChange(orderIndex, itemIndex, "qty", Number(e.target.value))}
                                                    />
                                                ) : (
                                                    item.qty
                                                )}
                                            </td>
                                            <td>
                                                {editingItem?.orderIndex === orderIndex && editingItem?.itemIndex === itemIndex ? (
                                                    <input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => handleEditChange(orderIndex, itemIndex, "price", Number(e.target.value))}
                                                    />
                                                ) : (
                                                    `₹${item.price}`
                                                )}
                                            </td>
                                            <td>₹{item.qty * item.price}</td>
                                            <td>
                                                {editingItem?.orderIndex === orderIndex && editingItem?.itemIndex === itemIndex ? (
                                                    <button onClick={() => setEditingItem(null)}>Save</button>
                                                ) : (
                                                    <FaEdit className="edit-icon" onClick={() => setEditingItem({ orderIndex, itemIndex })} />
                                                )}
                                                <FaTrash className="delete-icon" onClick={() => handleDelete(orderIndex, itemIndex)} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <h3>
                            Total Amt: ₹
                            {selectedRoomOrders.orders.reduce(
                                (total, order) => total + order.items.reduce((sum, item) => sum + item.qty * item.price, 0),
                                0
                            )}
                        </h3>
                        <button className="close-popup" onClick={closePopup}>Close</button>
                        <button className="checkout-button" onClick={() => handleCheckout(selectedRoomOrders.id)}>Checkout</button>
                    </div>
                </div>
            )}



            <div className="bottom-nav">
                <Link to="/allOrders" state={{ orders: rooms.filter((room) => room.orders.length > 0) }} className="nav-icon">
                    <span className="material-icons">restaurant</span>
                    <span>All Orders</span>
                </Link>

                <Link to="/" className={`nav-icon ${window.location.pathname === "/" ? "active" : ""}`}>
                    <span className="material-icons" style={{ color: "orange" }}>home</span>
                    <span>Home</span>
                </Link>

                <Link to="/edit" state={{ orders: rooms?.filter((room) => room.orders.length > 0) }} className="nav-icon">
                    <span className="material-icons">edit</span>
                    <span>Add Orders</span>
                </Link>

                <div className="more-button" onClick={toggleMoreMenu}>
                    {isMoreOpen ? <FaTimes className="more-icon-close" /> : <FaBars className="more-icon" />}

                </div>

            </div>

            {/* More Menu */}
            {isMoreOpen && (
                <div className="more-menu">
                    <Link className="more-item">
                        <FaCalendarCheck className="more-icon" />
                        <span>Pre-bookings</span>
                    </Link>

                    <Link to="/bill" className="more-item">
                        <FaPrint className="more-icon" />
                        <span>Print Bill</span>
                    </Link>
                    <Link to="/inventory" className="more-item">
                        <FaBoxOpen className="more-icon" />
                        <span>Inventory</span>
                    </Link>
                    <Link to="/menu" className="more-item">
                        <FaList className="more-icon" />
                        <span>Menu</span>
                    </Link>
                </div>
            )}

        </div>
    );
};

export default Home;
