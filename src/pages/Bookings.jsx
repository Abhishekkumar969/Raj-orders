import React from "react";

const rooms = [
    { id: 1001, type: "Deluxe", isBooked: true },
    { id: 1002, type: "Semi-Deluxe", isBooked: true },
    { id: 1003, type: "Standard", isBooked: false },
    { id: 1004, type: "Semi-Deluxe", isBooked: false }
];

const halls = {
    "S-Hall": { name: "Small Hall", isBooked: true },
    "B-Hall": { name: "Big Hall", isBooked: true },
    "L-Hall": { name: "Large Hall", isBooked: false }
};

const Bookings = () => {
    const bookedRooms = rooms.filter(room => room.isBooked);
    const bookedHalls = Object.entries(halls).filter(([_, hall]) => hall.isBooked);

    // Styles
    const containerStyle = {
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
    };

    const cardStyle = {
        maxWidth: "700px",
        width: "100%",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    };

    const headerStyle = {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "20px",
    };

    const sectionTitleStyle = {
        fontSize: "18px",
        fontWeight: "bold",
        backgroundColor: "#e3f2fd",
        padding: "10px",
        borderRadius: "5px",
        marginTop: "15px",
    };

    const listStyle = {
        listStyleType: "none",
        padding: "0",
        margin: "10px 0",
    };

    const listItemStyle = {
        backgroundColor: "#fafafa",
        padding: "12px",
        margin: "5px 0",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    };

    const badgeStyle = {
        padding: "5px 10px",
        borderRadius: "5px",
        fontSize: "14px",
        fontWeight: "bold",
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={headerStyle}>📌 Current Bookings</h2>

                {bookedRooms.length === 0 && bookedHalls.length === 0 ? (
                    <p style={{ color: "#666", fontSize: "16px" }}>No bookings available.</p>
                ) : (
                    <>
                        {bookedRooms.length > 0 && (
                            <div>
                                <h3 style={sectionTitleStyle}>🏨 Booked Rooms</h3>
                                <ul style={listStyle}>
                                    {bookedRooms.map(room => (
                                        <li key={room.id} style={listItemStyle}>
                                            <span>Room {room.id} - {room.type}</span>
                                            <span style={{ ...badgeStyle, backgroundColor: "#4CAF50", color: "white" }}>
                                                Confirmed
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {bookedHalls.length > 0 && (
                            <div>
                                <h3 style={sectionTitleStyle}>🎉 Booked Halls</h3>
                                <ul style={listStyle}>
                                    {bookedHalls.map(([key, hall]) => (
                                        <li key={key} style={listItemStyle}>
                                            <span>{hall.name}</span>
                                            <span style={{ ...badgeStyle, backgroundColor: "#FF9800", color: "white" }}>
                                                Reserved
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Bookings;
