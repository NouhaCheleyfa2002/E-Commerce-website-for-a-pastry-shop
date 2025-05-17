import React, { useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bg2 from './assets/img/second-bg.png';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles"
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { HashRouter, Route, Routes} from "react-router-dom";
import { useLocation } from 'react-router-dom';

import { themeSettings } from "./theme.js";
import Dashboard from './adminDashboard/scenes/dashboard';
import Layout from './adminDashboard/scenes/layout';
import Products from './adminDashboard/scenes/products/index.jsx';
import Customers from './adminDashboard/scenes/customers/index.jsx';
import Transactions from './adminDashboard/scenes/transactions/index.jsx';
import Geography from './adminDashboard/scenes/geography/index.jsx';
import Overview from './adminDashboard/scenes/overview/index.jsx';
import Daily from './adminDashboard/scenes/daily/index.jsx';
import Monthly from './adminDashboard/scenes/monthly/index.jsx';
import Breakdown from './adminDashboard/scenes/breakdown/index.jsx';
import Admin from './adminDashboard/scenes/admin/index.jsx';
import Performance from './adminDashboard/scenes/performance/index.jsx';

import ProtectedRoute from './components/ProtectedRoute';
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
import ProductDetails from "./pages/ProductDetails";



const App = () => {
  const { showLogin } = useContext(LoginContext);
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const location = useLocation();
  const hideNavbarOnRoutes = [
    "/dashboard",
    "/products",
    "/customers",
    "/transactions",
    "/geography",
    "/overview",
    "/daily",
    "/monthly",
    "/breakdown",
    "/admin",
    "/performance"
  ];

   // Determine if the current route is an admin route
   const isAdminRoute = hideNavbarOnRoutes.includes(location.pathname);

  return (
    <div className="relative min-h-screen ">
        {!isAdminRoute && (
        <div
          className="absolute top-[20px] left-0 w-full h-[calc(100%-80px)] bg-[#490206] bg-repeat-y bg-cover"
          style={{
            backgroundImage: `url(${bg2})`,
            backgroundPosition: "top",
            backgroundSize: "95% auto",
          }}
        ></div>
      )}
      {!hideNavbarOnRoutes.includes(location.pathname) && <Navbar />}

      <div className="relative">
        <ToastContainer position="bottom-right" />

        {showLogin && <Login />} {/* Show login modal when triggered */}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/ShoppingCart" element={<ShoppingCart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/category/:categoryName" element={<CategoryProducts />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/product/:id" element={<ProductDetails />} />


         
         <Route element={<ProtectedRoute />}>
          <Route
            element={
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Layout />
              </ThemeProvider>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/geography" element={<Geography />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/daily" element={<Daily />} />
            <Route path="/monthly" element={<Monthly />} />
            <Route path="/breakdown" element={<Breakdown />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/performance" element={<Performance />} />
          </Route>
        </Route>   

        </Routes>

        {!isAdminRoute && <Footer />}
      </div>
    </div>
  );
};

export default App;

