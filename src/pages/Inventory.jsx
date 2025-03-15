import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { FaTrash, FaTimes, FaPlus } from "react-icons/fa";
import "./Inventory.css";

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });
    const [showPopup, setShowPopup] = useState(false);

    // Fetch inventory items from Firestore
    useEffect(() => {
        const inventoryCollection = collection(db, "inventory");
        const unsubscribe = onSnapshot(inventoryCollection, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setInventory(items);
        });
        return () => unsubscribe();
    }, []);

    // Handle adding a new item
    const handleAddItem = async () => {
        if (!newItem.name.trim() || isNaN(newItem.quantity) || isNaN(newItem.price)) {
            alert("Please enter valid details!");
            return;
        }

        try {
            await addDoc(collection(db, "inventory"), {
                name: newItem.name.trim(),
                quantity: parseInt(newItem.quantity, 10),
                price: parseFloat(newItem.price),
                timestamp: new Date(),
            });
            setNewItem({ name: "", quantity: "", price: "" });
            setShowPopup(false);
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    // Handle updating an item
    const handleEditItem = async (id, field, value) => {
        const updatedInventory = inventory.map(item =>
            item.id === id ? { ...item, [field]: field === "name" ? value : Number(value) } : item
        );
        setInventory(updatedInventory);

        try {
            await updateDoc(doc(db, "inventory", id), { [field]: field === "name" ? value : Number(value) });
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    // Handle deleting an item
    const handleDeleteItem = async (id) => {
        try {
            await deleteDoc(doc(db, "inventory", id));
            setInventory(prevInventory => prevInventory.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <div className="inventory-container">
            <button className="add-btn" onClick={() => setShowPopup(true)}>
                <FaPlus /> Add Item
            </button>

            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price/Unit</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.length > 0 ? (
                        inventory.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => handleEditItem(item.id, "name", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        value={item.quantity}
                                        onChange={(e) => handleEditItem(item.id, "quantity", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.price}
                                        onChange={(e) => handleEditItem(item.id, "price", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <FaTrash className="delete-icon" onClick={() => handleDeleteItem(item.id)} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="no-items">No inventory items found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showPopup && (
                // <div className="popup">
                <div className="popup-contentpage ">
                    <h2>Add Inventory Item</h2>
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Item Name"
                                        value={newItem.name}
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        placeholder="Quantity"
                                        min="0"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        min="0"
                                        step="0.01"
                                        value={newItem.price}
                                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button className="add-item-btn" onClick={handleAddItem}>Add</button>
                    <FaTimes className="close-popup" onClick={() => setShowPopup(false)} />
                </div>
                // </div>
            )}


        </div>
    );
};

export default Inventory;
