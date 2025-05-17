import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios"; 
import { CartContext } from '../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItemToCart } = useContext(CartContext);
  const [cartMessage, setCartMessage] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/product/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Something went wrong");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = (product) => {
    addItemToCart(product);
    setCartMessage((prev) => ({
      ...prev,
      [product._id]: "Item added to cart!",
    }));
    setTimeout(() => {
      setCartMessage((prev) => ({
        ...prev,
        [product._id]: null,
      }));
    }, 2000);
  };

  if (loading) return <p className="text-center py-10 text-lg">Loading...</p>;
  if (error) return <p className="text-center py-10 text-[#5f3c1c]">{error}</p>;
  if (!product) return <p className="text-center py-10">Product not found</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[350px] object-cover rounded-xl"
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
          <p className="text-gray-600 mt-4">{product.description}</p>

          <div className="mt-6">
            <p className="text-lg font-semibold text-[#5f3c1c]">
              Price: {product.price} TND
            </p>
            <p className="text-sm text-gray-500 mt-1">Category: {product.category}</p>
            <p className="text-sm text-gray-500 mt-1">Ingredients: {product.ingredients.join(", ")}</p>
            <p className={`mt-2 font-semibold ${product.stock ? "text-[#5f3c1c]" : "text-red-500"}`}>
              {product.stock ? "In Stock" : "Out of Stock"}
            </p>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-6 relative group">
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-[#8B5E3C] hover:bg-[#a25b1f] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition duration-300"
            >
              <FaShoppingCart />
              Add to Cart
            </button>

            <span className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity text-sm bg-black text-white py-1 px-2 rounded shadow-md">
              Add to Cart
            </span>
          </div>

          {cartMessage[product._id] && (
            <p className="text-[#5f3c1c] mt-4 text-sm">{cartMessage[product._id]}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
