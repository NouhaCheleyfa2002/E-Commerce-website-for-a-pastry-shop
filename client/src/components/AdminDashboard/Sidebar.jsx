import { Link } from "react-router-dom";
import { FaBox, FaClipboardList, FaUsers, FaChartBar } from "react-icons/fa";
import "./AdminDashboard.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      
      <nav>
        <ul>
          <li><Link to="/admin/products"><FaBox /> Product Management</Link></li>
          <li><Link to="/admin/orders"><FaClipboardList /> Order Management</Link></li>
          <li><Link to="/admin/users"><FaUsers /> User Management</Link></li>
          <li><Link to="/admin/analytics"><FaChartBar /> Analytics</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
