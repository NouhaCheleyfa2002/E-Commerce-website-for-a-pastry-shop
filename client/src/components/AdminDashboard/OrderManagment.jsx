import React, { useState, useEffect } from "react";
import axios from "axios"; // You'll need to install axios

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); // Orders per page
  const [orderDetails, setOrderDetails] = useState(null); // Store order details for the modal
  const [notification, setNotification] = useState(null); // For order status update notifications
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/orders`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Handle searching orders
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter orders based on the search term
  const filteredOrders = orders.filter((order) => {
    return (
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order._id && order._id.toString().includes(searchTerm))
    );
  });

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Open modal to view order details
  const openOrderDetails = (order) => {
    setOrderDetails(order);
  };

  // Close modal
  const closeModal = () => {
    setOrderDetails(null);
  };

  // Handle order status update (for demo purposes, simulate a status change)
  const updateOrderStatus = (orderId, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: status } : order
      )
    );
    setNotification(`Order ${orderId} status updated to ${status}.`);
    setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by customer name or order ID"
        value={searchTerm}
        onChange={handleSearch}
        className="border p-2 rounded mb-4 w-full"
      />

      {/* Display notification if there is an order status update */}
      {notification && (
        <div className="bg-green-500 text-white p-2 rounded mb-4">{notification}</div>
      )}

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order._id}>
                <td className="p-2 border">{order._id}</td>
                <td className="p-2 border">{order.customerName}</td>
                <td className="p-2 border">{order.status}</td>
                <td className="p-2 border">${order.total}</td>
                <td className="p-2 border">{order.date}</td>
                <td className="p-2 border">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => openOrderDetails(order)}
                  >
                    View Details
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => updateOrderStatus(order._id, "Shipped")}
                  >
                    Mark as Shipped
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => updateOrderStatus(order._id, "Cancelled")}
                  >
                    Mark as Cancelled
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal for Order Details */}
      {orderDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Order Details</h3>
            <p><strong>Order ID:</strong> {orderDetails._id}</p>
            <p><strong>Customer:</strong> {orderDetails.customerName}</p>
            <p><strong>Status:</strong> {orderDetails.status}</p>
            <p><strong>Total:</strong> ${orderDetails.total}</p>
            <p><strong>Date:</strong> {orderDetails.date}</p>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
