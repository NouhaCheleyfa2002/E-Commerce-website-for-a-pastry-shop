import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios"; 


const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null); // State to store product data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null);
 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/product/${id}`);
        setProduct(response.data); // Set product data to state
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError(err.message || "Something went wrong"); // Set error message
        setLoading(false); // Set loading to false after error
      }
    };
    
    fetchProduct();
  }, [id]); // Re-run effect when `id` changes
 


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <img src={product.image} alt={product.name} className="w-85 h-64 object-cover rounded" />
      <h2 className="text-3xl font-bold mt-4">{product.name}</h2>
      <p className="text-gray-700 mt-2">{product.description}</p>
      <p className="text-lg font-semibold mt-2">Price: ${product.price}</p>
      <p className="text-sm text-gray-500">Category: {product.category}</p>
      <p className="mt-2">Ingredients: {product.ingredients.join(", ")}</p>
      <p className="mt-2 font-semibold">{product.stock ? "In Stock" : "Out of Stock"}</p>
    </div>
  );
};

export default ProductDetails;
