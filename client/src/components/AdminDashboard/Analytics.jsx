import React from "react";
import useSocket from "../../hooks/useSocket"; // Import the useSocket hook

const AnalyticsDashboard = () => {
  const { sales, traffic, inventory, userActivity } = useSocket(); // Get real-time data

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Real-Time Analytics Dashboard</h1>

      {/* Sales Analytics */}
      <div className="analytics-section bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold">Sales Analytics</h2>
        <ul>
          {sales.length > 0 ? (
            sales.map((data, index) => <li key={index}>{JSON.stringify(data)}</li>)
          ) : (
            <p>No sales data yet...</p>
          )}
        </ul>
      </div>

      {/* Traffic Analytics */}
      <div className="analytics-section bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold">Traffic Analytics</h2>
        <ul>
          {traffic.length > 0 ? (
            traffic.map((data, index) => <li key={index}>{JSON.stringify(data)}</li>)
          ) : (
            <p>No traffic data yet...</p>
          )}
        </ul>
      </div>

      {/* Inventory Analytics */}
      <div className="analytics-section bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold">Inventory Analytics</h2>
        <ul>
          {inventory.length > 0 ? (
            inventory.map((data, index) => <li key={index}>{JSON.stringify(data)}</li>)
          ) : (
            <p>No inventory data yet...</p>
          )}
        </ul>
      </div>

      {/* User Activity Analytics */}
      <div className="analytics-section bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold">User Activity Analytics</h2>
        <ul>
          {userActivity.length > 0 ? (
            userActivity.map((data, index) => <li key={index}>{JSON.stringify(data)}</li>)
          ) : (
            <p>No user activity data yet...</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
