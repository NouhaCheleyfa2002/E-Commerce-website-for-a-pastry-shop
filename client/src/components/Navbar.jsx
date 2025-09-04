import React, { useState, useContext, useRef, useEffect } from 'react';
import { FaSearch, FaUser, FaShoppingCart, FaHeart, FaChevronDown,FaInstagram, FaFacebookF  } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext';
import axios from 'axios'; 
import milandaLogo from '../assets/img/milanda-logo.png';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user, setShowLogin, logout } = useContext(LoginContext);
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const categoryRef = useRef(null);
  const searchRef = useRef(null);

  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null);

   // Social media links
   const socialLinks = {
    instagram: 'https://www.instagram.com/milanda_sweets',
    facebook: 'https://www.facebook.com/patisseriemilanda/'
  };

  // Fetch all products (to extract unique categories)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/product");
        setProducts(response.data); // Set product data
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError(err.message || "Something went wrong"); // Set error message
        setLoading(false); // Set loading to false after error
      }
    };
    fetchProducts();
  }, []);

 // Extract unique categories
const categories = products ? 
[...new Set(products.map((product) => product.category.toLowerCase()))] : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchInput(false);
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle category dropdown visibility
  const toggleCategoryDropdown = () => {
    setOpenDropdown(openDropdown === 'category' ? null : 'category');
  };

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchInput(false);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  // Handle search input change and show suggestions
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length > 0) {
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.category.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      
      setSearchSuggestions(filteredProducts);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  };

  // Handle clicking on a suggestion
  const handleSuggestionClick = (product) => {
    navigate(`/product/${product._id}`);
    setShowSearchInput(false);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    if (!showSearchInput) {
      // Focus on input when it becomes visible
      setTimeout(() => {
        if (searchRef.current) {
          const input = searchRef.current.querySelector('input');
          if (input) input.focus();
        }
      }, 100);
    } else {
      setShowSuggestions(false);
    }
  };
// Handle social media link clicks
const handleSocialClick = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
  return (
    <div className="w-full sticky top-5 z-10 bg-[#C24952] bg-opacity-70">
      {/* Main Navbar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-1 h-20 relative">
        
        {/* Left - Logo */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img src={milandaLogo} alt="Logo" className="w-[70px] object-contain" />
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <div className="mb-4">
          <ul className="absolute left-1/2 transform -translate-x-1/2 flex gap-10 text-lg text-white list-none cursor-pointer mb-9">
            <li className="hover:underline" onClick={() => navigate("/")}>Home</li>
      
            <li className="relative" ref={categoryRef}>
              <button onClick={toggleCategoryDropdown} className="flex items-center gap-1">
                Category
                <FaChevronDown className={`${openDropdown === "category" ? "rotate-180" : ""} transition-transform`} />
              </button>
              {openDropdown === "category" && (
                <ul className="absolute left-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 text-sm list-none z-20">
                  {loading ? (
                    <li className="px-4 py-2">Loading...</li>
                  ) : error ? (
                    <li className="px-4 py-2 text-red-500">Error loading categories</li>
                  ) : (
                    categories.map((category, index) => (
                      <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <Link to={`/category/${category}`} className="block w-full h-full text-black font-semibold no-underline">
                          {category}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </li>
      
            <li>
              <button onClick={() => navigate('/Contact')} className='hover:underline'>Contact Us</button>
            </li>
          </ul>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-4 text-white relative">
           {/* Social Media Icons */}
           <div className="flex items-center gap-3 border-r border-white/30 pr-4">
            <FaInstagram
              onClick={() => handleSocialClick(socialLinks.instagram)}
              className="text-xl cursor-pointer hover:text-pink-300 transition-colors duration-200"
              title="Follow us on Instagram"
            />
            <FaFacebookF
              onClick={() => handleSocialClick(socialLinks.facebook)}
              className="text-xl cursor-pointer hover:text-blue-300 transition-colors duration-200"
              title="Follow us on Facebook"
            />
            </div>
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <FaSearch
              onClick={toggleSearchInput}
              className="text-xl cursor-pointer hover:text-gray-200 transition-colors"
            />
            
            {/* Search Input - appears when search icon is clicked */}
            {showSearchInput && (
              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg w-80 z-30">
                <form onSubmit={handleSearch} className="p-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      placeholder="Search products..."
                      className="flex-1 px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-[#C24952]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#C24952] text-white rounded-md hover:bg-[#a63c45] transition-colors"
                    >
                      <FaSearch />
                    </button>
                  </div>
                </form>
                
                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="border-t border-gray-200 max-h-64 overflow-y-auto">
                    {searchSuggestions.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleSuggestionClick(product)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                       
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {product.category} • {product.price} TND
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {showSuggestions && searchSuggestions.length === 0 && searchQuery.trim() && (
                  <div className="border-t border-gray-200 p-3 text-center text-gray-500 text-sm">
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sign In / Profile */}
          {!user ? (
            <button onClick={() => setShowLogin(true)} className="cursor-pointer hover:underline">
              Sign in
            </button>
          ) : (
            <div className="relative">
              <FaUser className="text-xl cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)} />
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 p-2 bg-white rounded-md shadow-md w-44 z-30">
                  <p className="text-sm text-gray-600 mb-2">Hi, {user.name}</p>

                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsProfileOpen(false);
                    }}
                    className="text-sm text-gray-800 text-left hover:bg-gray-100 w-full py-1 px-2 rounded"
                  >
                    Profile
                  </button>
                  
                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setIsProfileOpen(false);
                      }}
                      className="text-sm text-gray-600 text-left hover:bg-gray-100 w-full py-1 px-2 rounded"
                    >Go to Admin Dashboard
                    </button>
                  )}

                  <button
                    onClick={logout}
                    className="mt-1 text-sm text-[#5f3c1c] text-left hover:bg-gray-100 w-full py-1 px-2 rounded"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Cart and Wishlist Icons */}
          <FaShoppingCart onClick={() => navigate('/ShoppingCart')} className="text-xl cursor-pointer" />
          <FaHeart onClick={() => navigate('/Wishlist')} className="text-xl cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;