import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig"; // Ensure correct Firebase import
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState(false);

    // Function to play a notification sound
    const playNotificationSound = () => {
        const audio = new Audio("/assets/notification.mp3"); // Ensure you have a sound file in the public folder
        audio.play();
    };

    useEffect(() => {
        const ordersCollection = collection(db, "orders");
        const unsubscribe = onSnapshot(ordersCollection, (snapshot) => {
            const fetchedOrders = [];
            let newOrdersAdded = false;

            snapshot.forEach((doc) => {
                const data = doc.data();
                fetchedOrders.push({
                    id: doc.id,
                    roomNo: data.roomNo,
                    items: data.items,
                    totalAmount: data.totalAmount,
                    delivered: data.delivered || false,
                });

                if (!data.delivered) {
                    newOrdersAdded = true;
                }
            });

            setOrders(fetchedOrders);

            // Play notification sound if new orders are detected
            if (newOrdersAdded) {
                playNotificationSound();
                setNewOrder(true);
                setTimeout(() => setNewOrder(false), 2000); // Reset after 2s
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    // Function to mark order as delivered in Firebase
    const markAsDelivered = async (orderId) => {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { delivered: true });

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, delivered: true } : order
                )
            );
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f7f7f7", padding: "20px", display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: "900px", width: "100%", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>

                {/* Header with Notification Bell */}
                <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", color: "#333", marginBottom: "20px" }}>
                    🍽️ All Orders
                    <span style={{ marginLeft: "10px", fontSize: "20px", color: newOrder ? "red" : "gray", transition: "transform 0.5s", transform: newOrder ? "rotate(15deg)" : "none" }}>
                        🔔
                    </span>
                </h2>

                {orders.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#666" }}>No orders found.</p>
                ) : (
                    [...orders]
                        .sort((a, b) => a.delivered - b.delivered) // Sort: Undelivered first
                        .map((order, index) => (
                            <div key={index} style={{ marginBottom: "20px" }}>
                                <h3 style={{ fontSize: "18px", fontWeight: "bold", backgroundColor: "#e3f2fd", padding: "10px", borderRadius: "5px", marginBottom: "0px" }}>
                                    {order.roomNo || "Unknown Order"} {order.delivered && " ✅"}
                                </h3>
                                <div style={{ overflowX: "auto" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                                        <thead>
                                            <tr style={{ backgroundColor: "#2196F3", color: "white" }}>
                                                <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>Item</th>
                                                <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items && order.items.map((item, i) => (
                                                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                                                    <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>{item.name}</td>
                                                    <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>{item.qty}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Mark as Delivered Button */}
                                    <button
                                        style={{
                                            backgroundColor: order.delivered ? "#aaa" : "#27ae60",
                                            color: "white",
                                            padding: "8px 12px",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: order.delivered ? "not-allowed" : "pointer",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            display: "block",
                                            margin: "10px auto",
                                        }}
                                        onClick={() => markAsDelivered(order.id)}
                                        disabled={order.delivered}
                                    >
                                        {order.delivered ? "Delivered ✅" : "Mark as Delivered"}
                                    </button>
                                </div>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
};

export default AllOrders;
