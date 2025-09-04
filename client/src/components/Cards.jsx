import React, { useContext, useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaChevronCircleRight} from 'react-icons/fa';

import { WishlistContext } from '../context/WishlistContext';
import axios from 'axios';


const Cards = () => {
  const navigate = useNavigate();

  const { addItemToWishlist, removeItem, isInWishlist } = useContext(WishlistContext);
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

    if (isInWishlist(product._id)) {
      removeItem(product._id);
      setWishlistMessage((prev) => ({ ...prev, [product._id]: "Removed from Wishlist ❌" }));
    } else {
      addItemToWishlist(product);
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
    return <div className="text-center">Error: {error}</div>;
  }

  return (

    <div className="d-flex flex-wrap justify-content-between gap-4 mt-2">
      {products.map((product) => (
        <Card key={product._id} style={{ width: '15rem', height: '430px' }} className="mt-3">
          <Card.Img
            variant="top"
            src={product.image}
            alt={product.name}
            style={{ objectFit: 'cover', width: '100%', height: '223px' }}
          />
          <Card.Body className="d-flex flex-column">
            <Card.Title className='text-[#231508]'>{product.name}</Card.Title>
            <Card.Text>{product.description}.</Card.Text>
            <div className="d-flex justify-content-between align-items-center mt-3">
            <Card.Text className="fw-bold text-[#231508] mb-0">{product.price} TND</Card.Text>
             <div className="d-flex gap-2">
              <Button
                onClick={() => navigate(`/product/${product._id}`)}
                style={{
                  backgroundColor: "#8B5E3C",
                  borderColor: "#8B5E3C",
                  width: "36px",
                  height: "36px",
                  padding: "0",
                }}
                className="rounded-circle d-flex align-items-center justify-content-center"
              >
                <FaChevronCircleRight size={20} />
              </Button>

              <Button
                variant="light"
                onClick={() => handleWishlistToggle(product)}
                style={{
                  backgroundColor: "#8B5E3C",
                  borderColor: "#8B5E3C",
                  width: "36px",
                  height: "36px",
                  padding: "0",
                }}
                className={`rounded-circle d-flex align-items-center justify-content-center ${isInWishlist(product._id) ? "text-danger" : "text-white"}`}
                onMouseEnter={() => setShowTooltip(`wishlist-${product._id}`)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <FaHeart
                  size={20}
                />
                {showTooltip === `wishlist-${product._id}` && (
                  <span className="tooltip-custom position-absolute top-[-25px] start-50 translate-middle bg-dark text-white text-xs px-2 py-1 rounded">
                    {isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  </span>
                )}
              </Button>
            </div>
          </div>

            {/* Display Messages */}
            {wishlistMessage[product._id] && <p className="text-success mt-2 text-center">{wishlistMessage[product._id]}</p>}
          </Card.Body>
        </Card>
      ))}
    </div>

  );
};

export default Cards;
