import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { FaTrash } from "react-icons/fa"; // Importing bin icon from react-icons
import "./Home.css";

const allRooms = [
    { id: 1001, type: "Deluxe", image: "/assets/1001.jpg" },
    { id: 1002, type: "Semi-Deluxe", image: "/assets/1002.jpg" },
    { id: 1003, type: "Semi-Deluxe", image: "/assets/1003.jpg" },
    { id: 1004, type: "Standard", image: "/assets/1004.jpg" },
    { id: 1005, type: "Semi-Deluxe", image: "/assets/1005.jpg" },
    { id: 1006, type: "Standard", image: "/assets/1001.jpg" },
    { id: 1007, type: "Semi-Deluxe", image: "/assets/1002.jpg" },
    { id: 1008, type: "Standard", image: "/assets/1003.jpg" },
    { id: 1009, type: "Semi-Deluxe", image: "/assets/1004.jpg" },
    { id: 1010, type: "Standard", image: "/assets/1005.jpg" },
];

const EditOrders = () => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [orderItems, setOrderItems] = useState([]);

    const handleAddItem = () => {
        setOrderItems([...orderItems, { name: "", qty: 1, price: 0 }]);
    };

    const handleChange = (index, field, value) => {
        const updatedItems = [...orderItems];
        updatedItems[index][field] = value;
        setOrderItems(updatedItems);
    };

    const handleDeleteRow = (index) => {
        const updatedItems = orderItems.filter((_, i) => i !== index);
        setOrderItems(updatedItems);
    };

    const handleSaveOrder = async () => {
        if (!selectedRoom) {
            alert("Please select a room before saving the order.");
            return;
        }

        if (orderItems.length === 0 || orderItems.some(item => item.name.trim() === "" || item.qty <= 0 || item.price < 0)) {
            alert("Please enter valid order details before saving.");
            return;
        }

        const newOrder = {
            roomNo: selectedRoom.id.toString(), // Convert room number to string
            items: orderItems,
            timestamp: new Date(),
        };


        try {
            await addDoc(collection(db, "orders"), newOrder);
            // alert(`Order saved for Room ${selectedRoom.id} successfully!`);
            setSelectedRoom(null);
            setOrderItems([]);
        } catch (error) {
            console.error("Error saving order:", error);
            alert("Failed to save order. Please try again.");
        }
    };

    const handleFocus = (index, field) => {
        // Clear input value on focus
        const updatedItems = [...orderItems];
        updatedItems[index][field] = "";
        setOrderItems(updatedItems);
    };

    return (
        <div className="home-container">
            <h2>Add Orders</h2>
            <div className="room-list">
                {allRooms.map((room) => (
                    <div key={room.id} className="room-card" onClick={() => setSelectedRoom(room)}>
                        <img src={room.image} alt={`Room ${room.id}`} className="room-img" />
                        <div className="room-details">
                            <h3>Room {room.id}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {selectedRoom && (
                <div className="offline-popup">
                    <div className="offline-popup-content">
                        <h2>Add Offline Orders for Room {selectedRoom.id}</h2>
                        <table className="offline-popup-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => handleChange(index, "name", e.target.value)}
                                                onFocus={() => handleFocus(index, "name")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.qty}
                                                onChange={(e) => handleChange(index, "qty", Number(e.target.value))}
                                                onFocus={() => handleFocus(index, "qty")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => handleChange(index, "price", Number(e.target.value))}
                                                onFocus={() => handleFocus(index, "price")}
                                            />
                                        </td>
                                        <td>
                                            <FaTrash
                                                className="delete-icon"
                                                onClick={() => handleDeleteRow(index)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="offline-add-item" onClick={handleAddItem}>Add Item</button>
                        <button className="offline-save-order" onClick={handleSaveOrder}>Save Order</button>
                        <button className="offline-close-popup" onClick={() => setSelectedRoom(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditOrders;
