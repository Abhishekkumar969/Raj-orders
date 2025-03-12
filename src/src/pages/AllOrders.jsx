import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig"; // Ensure correct Firebase import
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const AllOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "orders"));
                const fetchedOrders = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedOrders.push({
                        id: doc.id,
                        roomNo: data.roomNo,
                        items: data.items,
                        totalAmount: data.totalAmount,
                        delivered: data.delivered || false, // Get delivery status from Firebase
                    });
                });

                setOrders(fetchedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    // Function to mark order as delivered in Firebase
    const markAsDelivered = async (orderId) => {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { delivered: true }); // Update Firebase

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, delivered: true } : order
                )
            );
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    // Styles
    const containerStyle = {
        minHeight: "100vh",
        backgroundColor: "#f7f7f7",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
    };

    const cardStyle = {
        maxWidth: "900px",
        width: "100%",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    };

    const headerStyle = {
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "20px",
    };

    const orderTitleStyle = {
        fontSize: "18px",
        fontWeight: "bold",
        backgroundColor: "#e3f2fd",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "0px",
    };

    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
    };

    const thTdStyle = {
        border: "1px solid #ddd",
        padding: "10px",
        textAlign: "center",
    };

    const totalStyle = {
        fontWeight: "bold",
        color: "#27ae60",
    };

    const buttonStyle = {
        backgroundColor: "#27ae60",
        color: "white",
        padding: "8px 12px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        display: "block",
        margin: "10px auto",
    };

    const disabledButtonStyle = {
        ...buttonStyle,
        backgroundColor: "#aaa",
        cursor: "not-allowed",
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={headerStyle}>🍽️ All Orders</h2>

                {orders.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#666" }}>No orders found.</p>
                ) : (
                    [...orders]
                        .sort((a, b) => a.delivered - b.delivered) // Sorting: Undelivered first
                        .map((order, index) => (
                            <div key={index} style={{ marginBottom: "20px" }}>
                                <h3 style={orderTitleStyle}>
                                    {order.roomNo || "Unknown Order"}
                                    {order.delivered && " ✅"} {/* Add ✅ for delivered orders */}
                                </h3>
                                <div style={{ overflowX: "auto" }}>
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr style={{ backgroundColor: "#2196F3", color: "white" }}>
                                                <th style={thTdStyle}>Item</th>
                                                <th style={thTdStyle}>Qty</th>
                                                <th style={thTdStyle}>Price</th>
                                                <th style={thTdStyle}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items &&
                                                order.items.map((item, i) => (
                                                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                                                        <td style={thTdStyle}>{item.name}</td>
                                                        <td style={thTdStyle}>{item.qty}</td>
                                                        <td style={thTdStyle}>₹{item.price}</td>
                                                        <td style={{ ...thTdStyle, ...totalStyle }}>
                                                            ₹{item.qty * item.price}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>

                                    {/* Mark as Delivered Button */}
                                    <button
                                        style={order.delivered ? disabledButtonStyle : buttonStyle}
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
