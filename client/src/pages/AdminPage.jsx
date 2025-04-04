import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/AdminDashboard/Sidebar";
import Dashboard from "../components/AdminDashboard/AdminDashboard";
import ProductManagement from "../components/AdminDashboard/ProductManagment";
import OrderManagement from "../components/AdminDashboard/OrderManagment";
import UserManagement from "../components/AdminDashboard/UserManagment";
import Analytics from "../components/AdminDashboard/Analytics";
import "../components/AdminDashboard/AdminDashboard.css";

const AdminPage = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="analytics" element={<Analytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;
