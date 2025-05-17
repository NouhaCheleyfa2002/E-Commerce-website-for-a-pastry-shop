import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { FaShoppingCart, FaHeart, FaInfo } from "react-icons/fa";
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import axios from 'axios';


const CategoryProducts = () => {
  const { categoryName } = useParams(); // Get category name from URL
  const navigate = useNavigate();
  const { addItemToCart } = useContext(CartContext);
  const { wishlist, addItemToWishlist, removeItem, isInWishlist } = useContext(WishlistContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterInStock, setFilterInStock] = useState(false);
  const [sortByPrice, setSortByPrice] = useState(""); // "asc" or "desc"


  // Using useFetch to get products for the selected category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/product/category/${encodeURIComponent(categoryName)}`);
        setProducts(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);


  const [cartMessage, setCartMessage] = useState({});
  const [wishlistMessage, setWishlistMessage] = useState({});
  const [showTooltip, setShowTooltip] = useState(null);

  const handleAddToCart = (product) => {
    const item = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    };

    console.log("Adding to cart:", item);
    addItemToCart(item);

    setCartMessage((prev) => ({ ...prev, [product._id]: "Added to Cart ✅" }));
    setTimeout(() => {
      setCartMessage((prev) => ({ ...prev, [product._id]: "" }));
    }, 2000);
  };

  const handleWishlistToggle = (product) => {
    const item = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    };

    if (isInWishlist(product._id)) {
      removeItem(product._id);
      setWishlistMessage((prev) => ({ ...prev, [product._id]: "Removed from Wishlist" }));
    } else {
      addItemToWishlist(item);
      setWishlistMessage((prev) => ({ ...prev, [product._id]: "Added to Wishlist ❤️" }));
    }

    setTimeout(() => {
      setWishlistMessage((prev) => ({ ...prev, [product._id]: "" }));
    }, 2000);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const filteredProducts = products
  .filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter((product) => (filterInStock ? product.stock > 0 : true))
  .sort((a, b) => {
    if (sortByPrice === "asc") return a.price - b.price;
    if (sortByPrice === "desc") return b.price - a.price;
    return 0;
  });


  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-lg ">
      <h1 className="text-5xl font-bold mb-5 text-center capitalize text-[#5f3c1c] mt-5">
        Products of {categoryName}
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search products..."
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Filters */}
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={filterInStock}
                onChange={() => setFilterInStock(!filterInStock)}
              />
              In Stock Only
            </label>

            <select
              value={sortByPrice}
              onChange={(e) => setSortByPrice(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">Sort by Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-5">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg shadow-md bg-gray-50 text-center"
            >
              {/* Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-40 h-40 mx-auto object-cover rounded-md"
              />
              {/* Product Name */}
              <h2 className="text-lg font-semibold mt-3 min-h-[3rem] flex items-center justify-center">
                {product.name}
              </h2>

              {/* Stock Status */}
              <p
                className={`text-sm font-semibold mt-2 min-h-[2rem] ${
                  product.stock ? "text-[#5f3c1c]" : "text-red-500"
                }`}
              >
                {product.stock ? "In Stock ✅" : "Out of Stock ❌"}
              </p>

              {/* Price + Icons */}
              <div className="flex items-center justify-between mt-2 px-2">
                <span className="text-gray-600 text-base font-semibold">
                  {product.price} TND
                </span>
                <div  className="flex items-center gap-2">
                  <FaInfo onClick={() => navigate(`/product/${product._id}`)}
                    className="text-lg cursor-pointer text-gray-600 hover:text-[#5f3c1c]"
                  />
                  <div
                    className="position-relative"
                    onMouseEnter={() => setShowTooltip(product._id + '-cart')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <FaShoppingCart onClick={() => handleAddToCart(product)} className="text-lg cursor-pointer text-gray-600 hover:text-[#5f3c1c]" size={20} />
                    {showTooltip === product._id + '-cart' && (
                      <span className="position-absolute top-[-25px] start-50 translate-middle bg-dark text-white text-xs px-2 py-1 rounded">
                        Add to Cart
                      </span>
                    )}
                  </div>

                  <div
                    className="position-relative"
                    onMouseEnter={() => setShowTooltip(product._id + '-wishlist')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <FaHeart
                      onClick={() => handleWishlistToggle(product)}
                      className={`text-lg cursor-pointer ${
                        isInWishlist(product._id) ? "text-[#5f3c1c]" : "text-gray-600 hover:text-[#5f3c1c]"
                      }`}
                      size={20}
                    />
                    {showTooltip === product._id + '-wishlist' && (
                      <span className="position-absolute top-[-25px] start-50 translate-middle bg-dark text-white text-xs px-2 py-1 rounded">
                        {isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Display Cart Message */}
              {cartMessage[product._id] && (
                <p className="text-success mt-2 text-center">{cartMessage[product._id]}</p>
              )}

              {/* Display Wishlist Message */}
              {wishlistMessage[product._id] && (
                <p className="text-success mt-2 text-center">{wishlistMessage[product._id]}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No products found in this category.</p>
      )}
    </div>
  );
};



export default CategoryProducts;
