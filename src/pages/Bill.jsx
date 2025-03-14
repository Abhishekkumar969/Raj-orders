import React, { useState } from "react";

const Bill = () => {
    const [items, setItems] = useState([{ name: "", qty: 1, price: 0, total: 0 }]);
    const [includeGST, setIncludeGST] = useState(false);
    const getCurrentDateTime = () => new Date().toISOString().slice(0, 16);
    const [checkIn, setCheckIn] = useState(getCurrentDateTime);
    const [checkOut, setCheckOut] = useState(getCurrentDateTime);

    // const [gstDetails, setYourGST] = useState(null);
    // const [yourGST, setYourGST] = useState("");
    const [yourGST, setYourGST] = useState("");
    const [guestGST, setGuestGST] = useState("");

    const handleChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = field === "name" ? value : Number(value) || 0;
        if (field === "qty" || field === "price") {
            updatedItems[index].total = updatedItems[index].qty * updatedItems[index].price;
        }
        setItems(updatedItems);
        // 7e5ae9256dmsh44f5f0554a70578p1ffd1ejsn1cc60b597d51
    };
    const fetchGSTDetails = async (gstNumber) => {
        if (!gstNumber) {
            alert("Please enter a GST number!");
            return;
        }

        try {
            const response = await fetch(
                `https://gst-verification-api-get-profile-returns-data.p.rapidapi.com/v1/gstin/${gstNumber}/return/2024-25`,
                {
                    method: "GET",
                    headers: {
                        "X-RapidAPI-Key": "7e5ae9256dmsh44ff50554a70578p1ffd1ejsn1cc60b597d51",
                        "X-RapidAPI-Host": "gst-verification-api-get-profile-returns-data.p.rapidapi.com"
                    }
                }
            );

            const data = await response.json();
            console.log(data);

            if (data) {
                alert("GST details fetched successfully!");
            } else {
                alert("Invalid GST number!");
            }
        } catch (error) {
            alert("Error fetching GST details");
            console.error(error);
        }
    };

    const verifyGST = async (gstNumber) => {
        if (!gstNumber) {
            alert("Please enter a GST number!");
            return;
        }

        try {
            const response = await fetch(
                `https://gst-verification-api-get-profile-returns-data.p.rapidapi.com/v1/gstin/${gstNumber}/profile`,
                {
                    method: "GET",
                    headers: {
                        "X-RapidAPI-Key": "7e5ae9256dmsh44ff50554a70578p1ffd1ejsn1cc60b597d51",
                        "X-RapidAPI-Host": "gst-verification-api-get-profile-returns-data.p.rapidapi.com"
                    }
                }
            );

            const data = await response.json();
            console.log(data);

            if (data && data.valid) {
                alert("GST Number is valid!");
            } else {
                alert("GST Number is invalid!");
            }
        } catch (error) {
            alert("Error verifying GST");
            console.error(error);
        }
    };

    const addRow = () => setItems([...items, { name: "", qty: 1, price: 0, total: 0 }]);
    const deleteLastRow = () => items.length > 1 && setItems(items.slice(0, -1));

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const gst = includeGST ? subtotal * (18 / 118) : 0;
    const totalAmount = subtotal + gst;

    const handlePrint = () => window.print();

    const handleFocus = (index, field) => {
        const updatedItems = [...items];
        updatedItems[index][field] = ""; // Clear the input field completely
        setItems(updatedItems);
    };

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

            {/* Show GST input and buttons if GST is included */}
            {includeGST && (
                <div className="no-print">
                    <input
                        type="text"
                        placeholder="Enter your GST Number"
                        value={yourGST}
                        onChange={(e) => setYourGST(e.target.value)}
                        style={styles.input}
                    />
                    <button onClick={() => fetchGSTDetails(yourGST, setYourGST)} style={styles.gstButton}>GST Details</button>
                    <button onClick={() => verifyGST(yourGST)} style={styles.verifyButton}>Verify GST</button>
                    <input
                        type="text"
                        placeholder="Enter guest GST Number"
                        value={guestGST}
                        onChange={(e) => setGuestGST(e.target.value)}
                        style={styles.input}
                    />
                    <button onClick={() => fetchGSTDetails(guestGST, setGuestGST)} style={styles.gstButton}>Guest GST Details</button>
                    <button onClick={() => verifyGST(guestGST)} style={styles.verifyButton}>Verify Guest GST</button>

                </div>
            )}

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
                            <td>
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleChange(index, "name", e.target.value)}
                                    onFocus={() => handleFocus(index, "name")}
                                    style={styles.input}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={item.qty}
                                    onChange={(e) => handleChange(index, "qty", e.target.value)}
                                    onFocus={() => handleFocus(index, "qty")}
                                    style={styles.input}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => handleChange(index, "price", e.target.value)}
                                    onFocus={() => handleFocus(index, "price")}
                                    style={styles.input}
                                />
                            </td>
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

            {includeGST && (
                <div style={styles.gstInfo}>
                    <p><strong>Your GST Number:</strong> {yourGST}</p>
                    <p><strong>Guest GST Number:</strong> {guestGST}</p>
                </div>
            )}

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
    total: { fontSize: "20px", fontWeight: "bold" },
    gstButton: { backgroundColor: "#28a745", padding: "8px 15px", margin: "5px", color: "white", border: "none", borderRadius: "5px" },
    verifyButton: { backgroundColor: "#007bff", padding: "8px 15px", margin: "5px", color: "white", border: "none", borderRadius: "5px" },
    popup: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: "20px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" },
    closeButton: { backgroundColor: "#dc3545", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px", cursor: "pointer" }
};

export default Bill;
