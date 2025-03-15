import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { FaTrash, FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import "./Edit.css";

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
    const [inventory, setInventory] = useState([]);
    const [showInventoryPopup, setShowInventoryPopup] = useState(false);

    useEffect(() => {
        const inventoryCollection = collection(db, "inventory");
        const unsubscribe = onSnapshot(inventoryCollection, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setInventory(items);
        });
        return () => unsubscribe();
    }, []);

    const handleAddInventoryItem = (item) => {
        const existingItemIndex = orderItems.findIndex(orderItem => orderItem.id === item.id);
        if (existingItemIndex !== -1) {
            const updatedItems = [...orderItems];
            updatedItems[existingItemIndex].qty += 1;
            setOrderItems(updatedItems);
        } else {
            setOrderItems([...orderItems, { ...item, qty: 1 }]);
        }
    };

    const handleIncreaseQty = (index) => {
        const updatedItems = [...orderItems];
        updatedItems[index].qty += 1;
        setOrderItems(updatedItems);
    };

    const handleDecreaseQty = (index) => {
        const updatedItems = [...orderItems];
        if (updatedItems[index].qty > 1) {
            updatedItems[index].qty -= 1;
        } else {
            updatedItems.splice(index, 1);
        }
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
            roomNo: selectedRoom.id.toString(),
            items: orderItems,
            timestamp: new Date(),
        };

        try {
            await addDoc(collection(db, "orders"), newOrder);
            setSelectedRoom(null);
            setOrderItems([]);
        } catch (error) {
            console.error("Error saving order:", error);
            alert("Failed to save order. Please try again.");
        }
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>
                                            <FaMinus className="icon" onClick={() => handleDecreaseQty(index)} />
                                            {item.qty}
                                            <FaPlus className="icon" onClick={() => handleIncreaseQty(index)} />
                                        </td>
                                        <td>{item.price}</td>
                                        <td>
                                            <FaTrash className="delete-icon" onClick={() => handleDecreaseQty(index)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="offline-add-item" onClick={() => setShowInventoryPopup(true)}>Inventory</button>
                        <button className="offline-close-popup" onClick={() => setSelectedRoom(null)}>Close</button>
                        <button className="offline-save-order" onClick={handleSaveOrder}>Save Order</button>
                    </div>
                </div>
            )}

            {showInventoryPopup && (
                <div className="inventory-popup">
                    <div className="inventory-popup-content">
                        <h2>Inventory Items</h2>
                        <ul>
                            {inventory.map(item => (
                                <li key={item.id}>
                                    {item.name} - {item.quantity} left - ₹{item.price}
                                    <button onClick={() => handleAddInventoryItem(item)}>Add</button>
                                </li>
                            ))}
                        </ul>
                        <FaTimes className="close-popup" onClick={() => setShowInventoryPopup(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditOrders;
