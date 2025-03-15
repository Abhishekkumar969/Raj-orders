import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Orders from "./components/Orders";
import Bill from "./pages/Bill";
import Menu from "./components/Menu"
import Bookings from "./pages/Bookings";
import AllOrders from "./pages/AllOrders";
import Edit from "./pages/Edit";
import ProfileLink from "./pages/ProfileLink";
import Inventory from "./pages/Inventory";
import Room1001 from "./pages/Room1001";
import Room1002 from "./pages/Room1002";
import Room1003 from "./pages/Room1003";
import Room1004 from "./pages/Room1004";
import Room1005 from "./pages/Room1005";
import Room1006 from "./pages/Room1006";
import Room1007 from "./pages/Room1007";
import Room1008 from "./pages/Room1008";
import Room1009 from "./pages/Room1009";
import Room1010 from "./pages/Room1010";

// import Menu from "../src/components/Menu";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<Orders />} /> {/* Orders Page */}
        <Route path="/bill" element={<Bill />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/bookings" element={<Bookings />} /> {/* Bookings Page */}
        <Route path="/allOrders" element={<AllOrders />} /> {/* Bookings Page */}
        <Route path="/edit" element={<Edit />} /> {/* edit Page */}
        <Route path="/profileLink" element={<ProfileLink />} />
        <Route path="/inventory" element={<Inventory />} /> {/* ProfileLink Page */}
        <Route path="/room1001" element={<Room1001 />} /> {/* Bookings Page */}
        <Route path="/room1002" element={<Room1002 />} /> {/* Bookings Page */}
        <Route path="/room1003" element={<Room1003 />} /> {/* Bookings Page */}
        <Route path="/room1004" element={<Room1004 />} /> {/* Bookings Page */}
        <Route path="/room1005" element={<Room1005 />} /> {/* Bookings Page */}
        <Route path="/room1006" element={<Room1006 />} /> {/* Bookings Page */}
        <Route path="/room1007" element={<Room1007 />} /> {/* Bookings Page */}
        <Route path="/room1008" element={<Room1008 />} /> {/* Bookings Page */}
        <Route path="/room1009" element={<Room1009 />} /> {/* Bookings Page */}
        <Route path="/Room1010" element={<Room1010 />} /> {/* Bookings Page */}
        {/* <Route path="/menu" element={<Menu />} /> Bookings Page */}
      </Routes>
    </Router>
  );
}

export default App;
