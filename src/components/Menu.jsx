import React from "react";


export const menuItems = [
    { id: 1, name: "Paneer Chilly", price: 250, currency: "INR" },
    { id: 2, name: "Mushroom Chilly", price: 240, currency: "INR" },
    { id: 3, name: "Veg Manchurian", price: 230, currency: "INR" },
    { id: 4, name: "Chicken Chilly", price: 280, currency: "INR" },
    { id: 5, name: "Chicken Lollypop", price: 300, currency: "INR" },
    { id: 6, name: "Veg Chowmein", price: 150, currency: "INR" },
    { id: 7, name: "Egg Chowmein", price: 170, currency: "INR" },
    { id: 8, name: "Mix Chowmein", price: 200, currency: "INR" },
    { id: 9, name: "Mix Fried Rice", price: 180, currency: "INR" },
    { id: 10, name: "Veg Roll", price: 100, currency: "INR" },
    { id: 11, name: "Egg Roll", price: 120, currency: "INR" },
    { id: 12, name: "Chicken Egg Roll", price: 150, currency: "INR" },
    { id: 13, name: "Paneer Roll", price: 160, currency: "INR" },
    { id: 14, name: "Veg Thali", price: 200, currency: "INR" },
    { id: 15, name: "Chicken 1KG", price: 600, currency: "INR" },
    { id: 16, name: "Mutton 1KG", price: 800, currency: "INR" },
    { id: 17, name: "Tandoori Roti", price: 30, currency: "INR" },
    { id: 18, name: "Lachha Paratha", price: 35, currency: "INR" },
    { id: 19, name: "Naan", price: 55, currency: "INR" },
    { id: 20, name: "Dal Fry with Butter", price: 145, currency: "INR" },
    { id: 21, name: "Chana Dal Tadka", price: 140, currency: "INR" },
    { id: 22, name: "Dal Makhani", price: 160, currency: "INR" },
    { id: 23, name: "Yellow Dal", price: 130, currency: "INR" },
    { id: 24, name: "Plain Rice", price: 100, currency: "INR" },
    { id: 25, name: "Jeera Rice", price: 120, currency: "INR" },
    { id: 26, name: "Veg Pulao", price: 150, currency: "INR" },
    { id: 27, name: "Veg Biryani", price: 170, currency: "INR" },
    { id: 28, name: "Chicken Biryani", price: 220, currency: "INR" },
    { id: 29, name: "Egg Biryani", price: 160, currency: "INR" },
    { id: 30, name: "Aloo Paratha (2 pcs)", price: 140, currency: "INR" },
    { id: 31, name: "Sattu Paratha (2 pcs)", price: 150, currency: "INR" },
    { id: 32, name: "Paneer Paratha (2 pcs)", price: 180, currency: "INR" },
    { id: 33, name: "Toast with Omelette (2 pcs)", price: 130, currency: "INR" },
    { id: 34, name: "Sandwich (2 pcs)", price: 120, currency: "INR" },
    { id: 35, name: "Paneer Butter Masala", price: 230, currency: "INR" },
    { id: 36, name: "Paneer Handi", price: 250, currency: "INR" },
    { id: 37, name: "Paneer Do Pyaza", price: 280, currency: "INR" },
    { id: 38, name: "Palak Paneer", price: 250, currency: "INR" },
    { id: 39, name: "Mushroom Masala", price: 230, currency: "INR" },
    { id: 40, name: "Seasonal Sabzi", price: 220, currency: "INR" },
    { id: 41, name: "Mix Veg", price: 220, currency: "INR" },
    { id: 42, name: "Chicken Curry (4 pcs)", price: 300, currency: "INR" },
    { id: 43, name: "Chicken Do Pyaza (4 pcs)", price: 320, currency: "INR" },
    { id: 44, name: "Chicken Butter Masala (4 pcs)", price: 350, currency: "INR" },
    { id: 45, name: "Chicken Handi (4 pcs)", price: 360, currency: "INR" }
];


const Menu = () => {
    return (
        <div>
            <h2>Menu</h2>
            <ul>
                {menuItems.map((item) => (
                    <li key={item.id}>
                        <strong>{item.name}</strong> - {item.price} {item.currency}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Menu;
