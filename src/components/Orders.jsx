import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Orders = () => {
    const location = useLocation();
    const item = location.state?.item;
    const printRef = useRef();

    // State for stay duration and per-day rate
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [daysStayed, setDaysStayed] = useState(1);
    const [ratePerDay, setRatePerDay] = useState(0);

    // Automatically calculate daysStayed when fromDate & toDate are set
    useEffect(() => {
        if (fromDate && toDate) {
            const start = new Date(fromDate);
            const end = new Date(toDate);
            const differenceInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            setDaysStayed(differenceInDays > 0 ? differenceInDays : 1);
        }
    }, [fromDate, toDate]);

    if (!item) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <p style={{ fontSize: "18px", color: "#777" }}>No orders available.</p>
                </div>
            </div>
        );
    }

    // Calculate total amount from food orders
    const foodTotal = item.orders.reduce((sum, order) => sum + order.qty * order.price, 0);
    const stayTotal = daysStayed * ratePerDay;
    const totalAmount = foodTotal + stayTotal;

    const handlePrint = () => window.print();

    return (
        <div style={styles.container}>
            <div style={styles.card} ref={printRef}>
                <h2 style={styles.header}>{item.name || `Room ${item.id}`} Orders</h2>

                {/* Stay Details Inputs */}
                <div className="no-print">
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>From Date:</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>To Date:</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Days Stayed:</label>
                        <input
                            type="number"
                            value={daysStayed || ""}
                            min="1"
                            onFocus={() => setDaysStayed("")}
                            onChange={(e) => setDaysStayed(Number(e.target.value) || 0)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Room Rate (₹):</label>
                        <input
                            type="number"
                            value={ratePerDay || ""}
                            min="0"
                            onFocus={() => setRatePerDay("")}
                            onChange={(e) => setRatePerDay(Number(e.target.value) || 0)}
                            style={styles.input}
                        />
                    </div>
                </div>

                {/* Orders Table */}
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Item</th>
                            <th style={styles.th}>Qty</th>
                            <th style={styles.th}>Price</th>
                            <th style={styles.th}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {item.orders.length > 0 ? (
                            item.orders.map((order, index) => (
                                <tr key={index}>
                                    <td style={styles.td}>{order.name}</td>
                                    <td style={styles.td}>{order.qty}</td>
                                    <td style={styles.td}>₹{order.price}</td>
                                    <td style={styles.td}>₹{order.qty * order.price}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center", padding: "10px", color: "#777" }}>
                                    No orders placed yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Display Stay Cost */}
                <div style={styles.summary}>
                    <p><strong>Stay Total:</strong> ₹{stayTotal}</p>
                    <p><strong>Order Total:</strong> ₹{foodTotal}</p>
                </div>

                {/* Final Total & Print */}
                <div style={styles.totalContainer} onClick={handlePrint}>
                    <span style={styles.totalLabel}>Total Amount:</span>
                    <span style={styles.totalPrice}>₹{totalAmount}</span>
                </div>
            </div>

            {/* Hide inputs and buttons in print mode */}
            <style>
                {`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        text-align: center;
                        font-size: 16px;
                    }
                    h2 {
                        margin-bottom: 10px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 8px;
                    }
                    .summary {
                        text-align: left;
                        margin-top: 10px;
                    }
                }
                `}
            </style>
        </div>
    );
};

// Styles (unchanged)
const styles = {
    container: { minHeight: "100vh", backgroundColor: "#f8f9fa", padding: "30px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
    card: { maxWidth: "600px", width: "100%", backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)", textAlign: "center", marginBottom: "20px" },
    header: { fontSize: "24px", fontWeight: "bold", color: "#333", marginBottom: "15px" },
    inputGroup: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
    label: { fontSize: "16px", fontWeight: "bold", color: "#333" },
    input: { width: "120px", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc", textAlign: "center" },
    table: { width: "100%", borderCollapse: "collapse", marginBottom: "15px" },
    th: { backgroundColor: "#007bff", color: "white", padding: "10px", textAlign: "left", fontWeight: "bold" },
    td: { padding: "10px", borderBottom: "1px solid #ddd", textAlign: "left" },
    summary: { textAlign: "left", marginBottom: "10px", fontSize: "16px" },
    totalContainer: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", backgroundColor: "#f1f1f1", borderRadius: "8px", fontWeight: "bold", fontSize: "18px", color: "#222" },
    totalLabel: { fontSize: "18px" },
    totalPrice: { color: "#28a745" }
};

export default Orders;
