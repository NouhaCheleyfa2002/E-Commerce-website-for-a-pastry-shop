import { useState, useEffect } from "react";

const OrderDetails = ({ orderId }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      setOrderDetails(data.order);
      setStatus(data.order.status); // Set the initial status
      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    // Update the order status on the server
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
      headers: { "Content-Type": "application/json" },
    });
  };

  if (loading) {
    return <div>Loading order details...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Order Details</h2>
      
      {/* Order Information */}
      <div className="mb-4">
        <p><strong>Order ID:</strong> {orderDetails.id}</p>
        <p><strong>Customer Name:</strong> {orderDetails.customerName}</p>
        <p><strong>Address:</strong> {orderDetails.shippingAddress}</p>
        <p><strong>Total Price:</strong> ${orderDetails.totalPrice}</p>
      </div>

      {/* Product List */}
      <div className="mb-4">
        <h3 className="font-bold">Products</h3>
        <ul>
          {orderDetails.products.map((product) => (
            <li key={product.id}>
              {product.name} (x{product.quantity}) - ${product.price * product.quantity}
            </li>
          ))}
        </ul>
      </div>

      {/* Order Status */}
      <div className="mb-4">
        <label>Status: </label>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <button
        onClick={() => alert('Go back to the order list')}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        Back to Orders
      </button>
    </div>
  );
};

export default OrderDetails;
