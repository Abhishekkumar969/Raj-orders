import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProfileLink.css'; // Import CSS for styling

const ProfileLink = ({ rooms = [] }) => {  // Default to an empty array if rooms is undefined
    const [showMenu, setShowMenu] = useState(false);

    const handleProfileClick = () => {
        setShowMenu(!showMenu); // Toggle the visibility of the popup
    };

    // Safely access flatMap by checking if rooms is defined and has the required structure
    const orders = rooms?.flatMap((room) => room.orders) || [];  // Fallback to an empty array if rooms is undefined or empty

    return (
        <div className="profile-container">
            <Link to="/bill" className="nav-icon" state={{ orders }} onClick={handleProfileClick}>
                <span className="material-icons">account_circle</span>
                <span>Profile</span>
            </Link>

            {/* Profile menu (popup) */}
            {showMenu && (
                <div className="popup-menu">
                    <Link to="/bill" className="popup-item">Bill</Link>
                    <Link to="/inventory" className="popup-item">Inventory</Link>
                    <Link to="/pre-booking" className="popup-item">Pre-booking</Link>
                </div>
            )}
        </div>
    );
};

export default ProfileLink;
