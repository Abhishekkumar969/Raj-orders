import React, { useState } from "react";

const Inventory = () => {
    const [items, setItems] = useState([]);

    // Add a new inventory item
    const addItem = () => {
        setItems([...items, { id: Date.now(), name: "", quantity: "", price: "" }]);
    };

    // Update item details
    const updateItem = (id, field, value) => {
        setItems(items.map(item => (item.id === id ? { ...item, [field]: value } : item)));
    };

    // Remove an item
    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <div className="inventory-container">
            <h1>Hotel Inventory</h1>
            <button onClick={addItem} className="add-btn">+ Add Item</button>

            <div className="inventory-list">
                {items.map((item) => (
                    <div key={item.id} className="inventory-card">
                        <input
                            type="text"
                            placeholder="Item Name"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, "price", e.target.value)}
                        />
                        <button onClick={() => removeItem(item.id)} className="remove-btn">🗑 Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Inventory;
