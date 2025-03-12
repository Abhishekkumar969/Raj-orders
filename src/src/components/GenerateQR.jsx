// import React from "react";
// import QRCode from "qrcode.react";

// const GenerateQR = () => {
//     const rooms = [
//         { id: "101", type: "Room" },
//         { id: "102", type: "Room" },
//         { id: "103", type: "Room" },
//         { id: "S-Hall", type: "Hall" },
//         { id: "B-Hall", type: "Hall" }
//     ];

//     return (
//         <div style={styles.container}>
//             <h2>QR Codes for Ordering</h2>
//             <div style={styles.grid}>
//                 {rooms.map((room) => (
//                     <div key={room.id} style={styles.card}>
//                         <QRCode value={`https://yourwebsite.com/place-order?roomId=${room.id}`} size={128} />
//                         <p>{room.type} {room.id}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// const styles = {
//     container: {
//         textAlign: "center",
//         padding: "20px"
//     },
//     grid: {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
//         gap: "20px",
//         justifyContent: "center"
//     },
//     card: {
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         padding: "15px",
//         border: "1px solid #ddd",
//         borderRadius: "10px",
//         backgroundColor: "#f9f9f9"
//     }
// };

// export default GenerateQR;





// import QRCode from "qrcode.react";

// const QRGenerator = ({ id, type }) => {
//     const url = `https://yourwebsite.com/placeOrder?${type}=${id}`;

//     return (
//         <div style={{ textAlign: "center", marginBottom: "20px" }}>
//             <h4>{type} {id} - Scan to Order</h4>
//             <QRCode value={url} size={150} />
//         </div>
//     );
// };

// // Usage Example:
// <QRGenerator id="101" type="roomId" />  // Room 101
// <QRGenerator id="S1" type="hallId" />  // S-Hall 1
// <QRGenerator id="B1" type="hallId" />  // B-Hall 1
