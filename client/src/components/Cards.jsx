import React, { useContext, useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaInfo } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import axios from 'axios';


const Cards = () => {
  const navigate = useNavigate();
  const { addItemToCart } = useContext(CartContext);
  const { addItemToWishlist, removeItem, isInWishlist } = useContext(WishlistContext);
  const [cartMessage, setCartMessage] = useState({});
  const [wishlistMessage, setWishlistMessage] = useState({});
  const [showTooltip, setShowTooltip] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/product/trending`);
        setProducts(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle Wishlist Toggle
  const handleWishlistToggle = (product) => {
    const item = {
      id: product._id,  // Use MongoDB's unique ID
      name: product.name,
      price: product.price,
      image: product.image,
    };

    if (isInWishlist(product._id)) {
      removeItem(product._id);
      setWishlistMessage((prev) => ({ ...prev, [product._id]: "Removed from Wishlist ❌" }));
    } else {
      addItemToWishlist(item);
      setWishlistMessage((prev) => ({ ...prev, [product._id]: "Added to Wishlist ❤️" }));
    }

    setTimeout(() => {
      setWishlistMessage((prev) => ({ ...prev, [product._id]: "" }));
    }, 2000);
  };

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    const item = {
      id: product._id,  // Use MongoDB's unique ID
      name: product.name,
      price: product.price,
      image: product.image,
    };

    addItemToCart(item);
    setCartMessage((prev) => ({ ...prev, [product._id]: "Added to Cart ✅" }));
    setTimeout(() => {
      setCartMessage((prev) => ({ ...prev, [product._id]: "" }));
    }, 2000);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center">Error: {error}</div>;
  }

  return (

    <div className="d-flex flex-wrap justify-content-between gap-4 mt-2">
      {products.map((product) => (
        <Card key={product._id} style={{ width: '14rem', height: '430px' }} className="mt-3">
          <Card.Img
            variant="top"
            src={product.image}
            alt={product.name}
            style={{ objectFit: 'cover', width: '100%', height: '250px' }}
          />
          <Card.Body className="d-flex flex-column">
            <Card.Title>{product.name}</Card.Title>
            <Card.Text>{product.price} TND</Card.Text>
            <div className="d-flex justify-content-center gap-3 mt-auto">
              {/* Details Button */}
              <Button
                onClick={() => navigate(`/product/${product._id}`)}
                style={{ backgroundColor: "#bc6c25", borderColor: "#bc6c25" }}
                className="rounded-circle p-2"
              >
                <FaInfo size={20} />
              </Button>

              {/* Add to Cart Button with Tooltip */}
              <div
                className="position-relative"
                onMouseEnter={() => setShowTooltip(`cart-${product._id}`)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <Button
                  onClick={() => handleAddToCart(product)}
                  style={{ backgroundColor: "#bc6c25", borderColor: "#bc6c25" }}
                  className="rounded-circle p-2"
                >
                  <FaShoppingCart size={20} />
                </Button>
                {showTooltip === `cart-${product._id}` && (
                  <span className="tooltip-custom position-absolute top-[-25px] start-50 translate-middle bg-dark text-white text-xs px-2 py-1 rounded">
                    Add to Cart
                  </span>
                )}
              </div>

              {/* Wishlist Button with Tooltip */}
              <div
                className="position-relative"
                onMouseEnter={() => setShowTooltip(`wishlist-${product._id}`)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <FaHeart
                  onClick={() => handleWishlistToggle(product)}
                  style={{ backgroundColor: "#bc6c25", borderColor: "#bc6c25" }}
                  className={`rounded-circle p-2 cursor-pointer ${isInWishlist(product._id) ? "text-danger" : "text-white"}`}
                  size={37}
                />
                {showTooltip === `wishlist-${product._id}` && (
                  <span className="tooltip-custom position-absolute top-[-25px] start-50 translate-middle bg-dark text-white text-xs px-2 py-1 rounded">
                    {isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  </span>
                )}
              </div>
            </div>

            {/* Display Messages */}
            {cartMessage[product._id] && <p className="text-success mt-2 text-center">{cartMessage[product._id]}</p>}
            {wishlistMessage[product._id] && <p className="text-success mt-2 text-center">{wishlistMessage[product._id]}</p>}
          </Card.Body>
        </Card>
      ))}
    </div>

  );
};

export default Cards;
