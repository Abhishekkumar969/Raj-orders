import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PlaceOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const roomId = queryParams.get("roomId"); // Get room ID from URL

    const [order, setOrder] = useState([{ item: "", qty: 1 }]);

    // Handle order input change
    const handleChange = (index, field, value) => {
        const updatedOrder = [...order];
        updatedOrder[index][field] = field === "qty" ? Number(value) : value;
        setOrder(updatedOrder);
    };

    // Add new order row
    const addRow = () => {
        setOrder([...order, { item: "", qty: 1 }]);
    };

    // Remove last order row
    const removeRow = () => {
        if (order.length > 1) {
            setOrder(order.slice(0, -1));
        }
    };

    // Submit order
    const handleSubmit = () => {
        const orderData = {
            roomId,
            orders: order
        };

        // Save order to localStorage (temporary) or send to backend
        let existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
        existingOrders.push(orderData);
        localStorage.setItem("orders", JSON.stringify(existingOrders));

        alert("Order placed successfully!");
        navigate("/orders"); // Redirect to Orders page
    };

    return (
        <div style={styles.container}>
            <h2>Place Order</h2>
            <p><strong>Room / Hall:</strong> {roomId}</p>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Qty</th>
                    </tr>
                </thead>
                <tbody>
                    {order.map((o, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    value={o.item}
                                    onChange={(e) => handleChange(index, "item", e.target.value)}
                                    style={styles.input}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={o.qty}
                                    min="1"
                                    onChange={(e) => handleChange(index, "qty", e.target.value)}
                                    style={styles.input}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={styles.buttonContainer}>
                <button onClick={removeRow} style={styles.button}>➖ Remove</button>
                <button onClick={addRow} style={styles.button}>➕ Add Item</button>
            </div>

            <button onClick={handleSubmit} style={styles.submitButton}>✅ Place Order</button>
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        maxWidth: "500px",
        margin: "auto",
        textAlign: "center",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9"
    },
    input: {
        width: "100%",
        padding: "8px",
        textAlign: "center",
        border: "1px solid #ccc",
        borderRadius: "5px"
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px"
    },
    button: {
        padding: "8px 15px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },
    submitButton: {
        padding: "10px 20px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px"
    }
};

export default PlaceOrder;
