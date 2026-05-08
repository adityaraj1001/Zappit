import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Pages
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Track from "./pages/Track";

// ✅ Context (IMPORTANT)
import { CartProvider } from "./context/CartContext";

// Optional styles
import "./App.css";

function App() {
  return (
    <CartProvider>   {/* 🔥 Wrap entire app */}
      <Router>
        <Routes>

          {/* 🏠 Homepage */}
          <Route path="/" element={<Home />} />

          {/* 🛒 Cart */}
          <Route path="/cart" element={<Cart />} />

          {/* 🚗 Tracking (Map + Delivery) */}
          <Route path="/track" element={<Track />} />

          {/* ❌ 404 Page */}
          <Route path="*" element={
            <div style={{ padding: "20px" }}>
              <h2>404 - Page Not Found</h2>
            </div>
          } />

        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;