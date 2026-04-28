// App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/routes";
import CartSidebar from "./components/CartSidebar";
import { CartProvider } from "./context/cartcontext"; // Import CartProvider

function App() {
  return (
    <CartProvider> 
      <ToastContainer 
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 1000004 }}
      />
      <Toaster position="top-right" />
      <Router>
        <AppRoutes />
        <CartSidebar /> 
      </Router>
    </CartProvider>
  );
}

export default App;
