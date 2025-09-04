import React, { useEffect, useState, useContext } from 'react';
import { LoginContext } from '../context/LoginContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(LoginContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/orders/user/${user._id}`);
        setOrders(res.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchOrders();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-[#5f3c1c] mb-6">Welcome, {user.name}</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="border p-4 rounded-lg bg-gray-50 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Your Info</h2>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Points Collected:</span> {user.points ?? 0}</p>
        </div>

        <div className="border p-4 rounded-lg bg-gray-50 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Quick Links</h2>
          <Link to="/settings" className="block text-[#C24952] hover:underline">Settings</Link>
          {user.isAdmin && <Link to="/admin/dashboard" className="block text-[#C24952] hover:underline">Admin Dashboard</Link>}
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Order History</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="border p-4 rounded-md bg-white shadow-sm">
              <p><span className="font-medium">Order ID:</span> {order._id}</p>
              <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><span className="font-medium">Total:</span> ${order.total.toFixed(2)}</p>
              <p><span className="font-medium">Status:</span> {order.status}</p>
              <div className="mt-2">
                <p className="font-medium">Items:</p>
                <ul className="list-disc ml-5">
                  {order.items.map(item => (
                    <li key={item._id}>{item.name} x {item.quantity}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
