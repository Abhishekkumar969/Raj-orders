import React, { useState } from "react";

const Bill = () => {
    const [items, setItems] = useState([{ name: "", qty: 1, price: 0, total: 0 }]);
    const [includeGST, setIncludeGST] = useState(false);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    const handleChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = field === "name" ? value : Number(value) || 0;
        if (field === "qty" || field === "price") {
            updatedItems[index].total = updatedItems[index].qty * updatedItems[index].price;
        }
        setItems(updatedItems);
    };

    const addRow = () => setItems([...items, { name: "", qty: 1, price: 0, total: 0 }]);
    const deleteLastRow = () => items.length > 1 && setItems(items.slice(0, -1));

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const gst = includeGST ? subtotal * 0.18 : 0;
    const totalAmount = subtotal + gst;

    const handlePrint = () => window.print();

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={{ marginBottom: "5px" }}>RAJ MAHAL</h2>
                <p style={{ marginTop: "0px", marginBottom: "3px" }}>Rooms & Banquet Hall</p>
                <p style={{ marginTop: "0px", marginBottom: "3px" }}>6123597647, 9386348962</p>
            </div>

            <div style={styles.invoiceInfo}>
                <p><strong>Invoice Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Invoice Time:</strong> {new Date().toLocaleTimeString()}</p>
            </div>

            {/* Check-in and Check-out */}
            <div style={styles.dateContainer} className="date-container">
                <label>
                    <strong>Check-in:</strong>
                    <input type="datetime-local" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={styles.dateInput} />
                </label>
                <label>
                    <strong>Check-out:</strong>
                    <input type="datetime-local" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={styles.dateInput} />
                </label>
            </div>

            <div className="no-print">
                <input type="checkbox" checked={includeGST} onChange={() => setIncludeGST(!includeGST)} /> Include GST
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Item Description</th>
                        <th style={styles.th}>Qty</th>
                        <th style={styles.th}>Unit Price</th>
                        <th style={styles.th}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td><input type="text" value={item.name} onFocus={(e) => e.target.value = ""} onChange={(e) => handleChange(index, "name", e.target.value)} style={styles.input} /></td>
                            <td><input type="number" value={item.qty} min="1" onFocus={(e) => e.target.value = ""} onChange={(e) => handleChange(index, "qty", e.target.value)} style={styles.input} /></td>
                            <td><input type="number" value={item.price} min="0" onFocus={(e) => e.target.value = ""} onChange={(e) => handleChange(index, "price", e.target.value)} style={styles.input} /></td>
                            <td style={styles.td}>₹{item.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="no-print" onClick={addRow} style={styles.button}>+ Add Item</button>
            <button className="no-print" onClick={deleteLastRow} style={styles.deleteButton}>🗑 Delete Row</button>

            <div style={styles.summary}>
                <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
                {includeGST && <p><strong>GST (18%):</strong> ₹{gst.toFixed(2)}</p>}
                <p style={styles.total}><strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}</p>
            </div>

            <button className="no-print" onClick={handlePrint} style={styles.printButton}>🖨 Print Bill</button>

            <style>
                {`
                @media print {
                    .no-print { display: none !important; }
                }
            
               
                           
                `}

            </style>
        </div>
    );
};

const styles = {
    container: { padding: "30px", maxWidth: "800px", margin: "auto", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" },
    header: { textAlign: "center", marginBottom: "20px" },
    invoiceInfo: { marginBottom: "20px", fontSize: "14px", },
    dateContainer: {
        display: "flex",
        flexDirection: "column",  // Default to column (for mobile)
        gap: "10px",
        marginBottom: "15px",
    },
    dateInput: { padding: "5px", fontSize: "14px", border: "1px solid #ccc", borderRadius: "5px" },
    table: { width: "100%", borderCollapse: "collapse", marginBottom: "20px", },
    th: { backgroundColor: "#007bff", color: "white", padding: "10px" },
    input: { width: "100%", padding: "8px", textAlign: "center", border: "1px solid #ccc", borderRadius: "5px", margin: "5px px", boxSizing: "border-box" },
    td: { padding: "10px", borderBottom: "1px solid #ddd" },
    button: { padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", marginRight: "10px" },
    deleteButton: { backgroundColor: "#dc3545", padding: "10px 20px", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
    printButton: { padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", marginTop: "15px" },
    summary: { textAlign: "right", marginTop: "20px", fontSize: "16px" },
    total: { fontSize: "20px", fontWeight: "bold" }
};

export default Bill;
