import React, { useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom';
import bg2 from './assets/img/second-bg.png';

import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import Home from './pages/Home';
import ShoppingCart from './pages/ShoppingCart';
import Wishlist from './pages/Wishlist';
import CategoryProducts from './components/categoryProducts';
import ContactUs from './pages/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import { LoginContext } from './context/LoginContext';
import Checkout from './pages/Checkout';
import OrderManagement from './components/AdminDashboard/OrderManagment';
import OrderDetails from './components/AdminDashboard/OrderDetails';
import ProductDetails from "./pages/ProductDetails";
import AnalyticsDashboard from './components/AdminDashboard/Analytics';

 

const App = () => {
  const { showLogin } = useContext(LoginContext);
  

  return (
    <div className="relative min-h-screen bg-[#490206]">
      <div
        className="absolute top-[80px] left-0 w-full h-[calc(100%-80px)] bg-repeat-y bg-cover"
        style={{
          backgroundImage: `url(${bg2})`,
          backgroundPosition: "top",
          backgroundSize: "85% auto",
        }}
      ></div>

      <Navbar />

      <div className="relative">
        <ToastContainer position="bottom-right" />
        
        {showLogin && <Login />} {/* Show login modal when triggered */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin//*"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/ShoppingCart" element={<ShoppingCart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/category/:categoryName" element={<CategoryProducts />} />
          <Route path="/contact" element={<ContactUs />} />
         
          <Route path="/order-managment" exact element={<OrderManagement />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />

        </Routes>
        
        <Footer />
      </div>
    </div>
  );
};

export default App;
