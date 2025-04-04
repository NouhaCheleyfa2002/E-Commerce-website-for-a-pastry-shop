import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { eventItems } from "../assets/assets"; // Update the path if needed
import { FaShoppingCart, FaHeart, FaInfo } from "react-icons/fa";

const EventProducts = () => {
  const { eventName } = useParams(); // Get event name from URL
  const navigate = useNavigate();

  // State for products & loading indicator
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Find the matching event in eventItems
    const eventKey = Object.keys(eventItems).find(
      (key) => key.toLowerCase().replace(/\s+/g, "-") === eventName.toLowerCase()
    );

    if (eventKey) {
      setProducts(eventItems[eventKey]);
    } else {
      setProducts([]); // Empty array if event not found
    }

    setTimeout(() => setLoading(false), 300); // Small delay for smoother UI
  }, [eventName]); // Re-run effect when eventName changes

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-lg">
      <h1 className="text-5xl font-bold mb-5 text-center capitalize text-[#bc6c25] mt-5">
        {eventName} Special Treats 🎉
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded-lg shadow-md bg-gray-50 text-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-40 h-40 mx-auto object-cover rounded-md"
              />

              <h2 className="text-lg font-semibold mt-3 min-h-[3rem] flex items-center justify-center">
                {product.name}
              </h2>

              <p
                className={`text-sm font-semibold mt-2 min-h-[2rem] ${
                  product.inStock ? "text-green-500" : "text-red-500"
                }`}
              >
                {product.inStock ? "In Stock ✅" : "Out of Stock ❌"}
              </p>

              <div className="flex items-center justify-between mt-2 px-2">
                <span className="text-gray-600 text-base font-semibold">
                  {product.price} TND
                </span>
                <div className="flex items-center gap-2">
                  <FaInfo
                    onClick={() => navigate("/Details")}
                    className="text-lg cursor-pointer text-gray-600 hover:text-blue-500"
                  />
                  <FaShoppingCart
                    onClick={() => navigate("/ShoppingCart")}
                    className="text-lg cursor-pointer text-gray-600 hover:text-blue-500"
                  />
                  <FaHeart
                    onClick={() => navigate("/Favorites")}
                    className="text-lg cursor-pointer text-gray-600 hover:text-red-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          No products found for this event. 🎂🎁
        </p>
      )}
    </div>
  );
};

export default EventProducts;
