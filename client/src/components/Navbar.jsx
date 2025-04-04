import React, { useState, useContext, useRef, useEffect } from 'react';
import { FaSearch, FaUser, FaShoppingCart, FaHeart, FaChevronDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext';
import axios from 'axios'; 
import milandaLogo from '../assets/img/milanda-logo.png';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, setShowLogin, logout } = useContext(LoginContext);
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const categoryRef = useRef(null);

  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null);

  // Fetch all products (to extract unique categories)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/product`);
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
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle category dropdown visibility
  const toggleCategoryDropdown = () => {
    setOpenDropdown(openDropdown === 'category' ? null : 'category');
  };

  return (
    <div className="w-full sticky top-5 z-10 bg-[#C24952] bg-opacity-70">
      {/* Top Bar */}
      <div className="flex justify-end p-2 text-white text-sm">
        <span className="cursor-pointer hover:underline">Join us</span>
      </div>

      {/* Main Navbar */}
      <div className="flex items-center justify-between px-10 py-2">
        {/* Left - Navigation Links */}
        <ul className="flex gap-10 text-lg cursor-pointer mb-9 list-none">
          <li className="text-white no-underline hover:underline" onClick={() => navigate("/")}>Home</li>

          {/* Category Dropdown */}
          <li className="relative" ref={categoryRef}>
            <button
              onClick={toggleCategoryDropdown}
              className="flex items-center gap-2 text-white"
            >
              Category <FaChevronDown className={`${openDropdown === "category" ? "rotate-180" : ""} transition-transform`} />
            </button>

            {openDropdown === "category" && (
              <ul className="absolute left-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 text-sm list-none">
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
            <button onClick={() => navigate('/Contact')} className='text-white no-underline hover:underline'>Contact Us</button>
          </li>
        </ul>

        {/* Center - Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 mb-9">
          <Link to="/">
            <img src={milandaLogo} alt="Logo" className="w-28 sm:w-30 lg:w-25" />
          </Link>
        </div>

        {/* Right - Search Bar and Icons */}
        <div className="flex items-center gap-4 text-white mb-8">
          {/* Search Button */}
          <div className="flex items-center bg-white text-black px-2 py-1 rounded-full">
            <input
              type="text"
              placeholder="Search pastries"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none px-1 py-1 text-sm"
            />
            <button onClick={() => navigate(`/search?q=${searchQuery}`)} className="p-2">
              <FaSearch className="text-gray-500" />
            </button>
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
                <div className="absolute right-0 mt-2 p-2 bg-white rounded-md shadow-md w-40">
                  <p className="text-sm text-gray-600">Hi, {user.name}</p>
                  <button
                    onClick={logout}
                    className="mt-2 text-sm text-red-500 w-full text-left hover:bg-gray-100 py-1 px-2 rounded"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Icons */}
          <FaShoppingCart onClick={() => navigate('/ShoppingCart')} className="text-xl cursor-pointer" />
          <FaHeart onClick={() => navigate('/Wishlist')} className="text-xl cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
