import "./AdminDashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-overview">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-cards">
        <div className="card">
          <h2>Products</h2>
          <p>120</p>
        </div>
        <div className="card">
          <h2>Orders</h2>
          <p>45</p>
        </div>
        <div className="card">
          <h2>Users</h2>
          <p>302</p>
        </div>
        <div className="card">
          <h2>Revenue</h2>
          <p>$12,340</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
