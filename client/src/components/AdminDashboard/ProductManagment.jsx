import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const ProductManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]); // Ensure it's an array
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); 
  const [message, setMessage] = useState("");

  const [editedProductDetails, setEditedProductDetails] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    ingredients: [""],
    stock: true,
  });

  const [newProductDetails, setNewProductDetails] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    ingredients: [""],
    stock: true,
  });

  // Fetch Products from Database
  useEffect(() => {
    axios.get("http://localhost:3000/api/product")
      .then((response) => {
        console.log("Fetched products:", response.data);
        setProducts(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  //Filter Products by Category
  const filteredProducts = selectedCategory === "all"
  ? products
  : products.filter((product) => product.category === selectedCategory);


   // Handle delete confirmation modal
   const confirmDelete = (id) => {
    setProductToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Add a new product
  const handleSubmitNewProduct = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/api/product", newProductDetails)
      .then((response) => {
        setProducts([...products, response.data]);
        setNewProductDetails({  name: "",
          description: "",
          price: "",
          category: "",
          image: "",
          ingredients: [""],
          stock: true, });
      })
      .catch((error) => console.error("Error adding product:", error));
  };

  // Delete a product
  const handleDelete = () => {
    axios.delete(`http://localhost:3000/api/product/${productToDelete}`)
      .then(() => {
        setProducts(products.filter((product) => product._id !== productToDelete));
        setShowDeleteConfirm(false);
      })
      .catch((error) => console.error("Error deleting product:", error));
  };

  // Edit a product
  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setEditedProductDetails({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      ingredients: product.ingredients,
      stock: product.stock, 
    });
    setShowEditModal(true);
  };

  // Submit edited product
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/api/product/${editingProduct}`, editedProductDetails)
      .then((response) => {
        setProducts(products.map((product) =>
          product._id === editingProduct ? response.data : product
        ));
        setEditingProduct(null);
        setShowEditModal(false);
        
        setMessage("Product updated successfully!"); // ✅ Show success message

        setTimeout(() => setMessage(""), 3000); // ✅ Clear message after 3 seconds
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        setMessage("Failed to update product."); // ✅ Show error message
      });
};
  

  return (
    <div className="p-4 w-[950px]">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>
      {message && <p className="text-green-600 font-bold">{message}</p>}
      <div className="mb-4 ">
        <label className="font-bold mr-2">Filter by Category:</label>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded hover:cursor-pointer"
        >
          <option value="all">All</option>
          <option value="arabesque">Arabesque</option>
          <option value="artisanal">artisanal</option>
          <option value="healthy">Healthy</option>
          <option value="salé">salé</option>
          <option value="vénoiseries">Vénoiseries</option>
          <option value="gateaux personnalisés">Gateaux Personnalisés</option>
          <option value="coffrets personnalisés">coffrets Personnalisés</option>
        </select>
      </div>

      <button
        onClick={() => setNewProductDetails({name: "",
          description: "",
          price: "",
          category: "",
          image: "",
          ingredients: [""],
          stock: true,})}
        className="bg-green-500 text-white px-3 py-2 rounded mb-4"
      >
        Add New Product
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Ingredients</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="text-center border">
                <td className="p-2 border">
                  <img src={product.image} alt={product.name} className="h-12 mx-auto" />
                </td>
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">{product.description}</td>
                <td className="p-2 border">${product.price}</td>
                <td className="p-2 border">{product.category}</td>
                <td className="p-2 border">{product.ingredients}</td>
                <td className="p-2 border">{product.stock ? "In Stock" : "Out of Stock"}</td>
                <td className="p-2 border">
                <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEdit(product)}
                  >
                    <FaEdit size={15} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 "
                    onClick={() => confirmDelete(product._id)}
                  >
                    <FaTrash size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 p-4">
                  No products found in this category.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-bold mb-4">Are you sure you want to delete this product?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Form */}
      {newProductDetails.name !== "" && (
        <form onSubmit={handleSubmitNewProduct} className="mt-4">
          <input type="text" name="name" placeholder="Name" value={newProductDetails.name} onChange={(e) => setNewProductDetails({ ...newProductDetails, name: e.target.value })} required />
          <input type="number" name="price" placeholder="Price" value={newProductDetails.price} onChange={(e) => setNewProductDetails({ ...newProductDetails, price: e.target.value })} required />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
        </form>
      )}

           {/* Edit Product Modal */}
           {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Edit Product</h3>
            <form onSubmit={handleSubmitEdit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Product Name"
                value={editedProductDetails.name}
                onChange={(e) => setEditedProductDetails({ ...editedProductDetails, name: e.target.value })}
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Description"
                value={editedProductDetails.description}
                onChange={(e) => setEditedProductDetails({ ...editedProductDetails, description: e.target.value })}
                required
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={editedProductDetails.price}
                onChange={(e) => setEditedProductDetails({ ...editedProductDetails, price: e.target.value })}
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={editedProductDetails.image}
                onChange={(e) => setEditedProductDetails({ ...editedProductDetails, image: e.target.value })}
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Category"
                value={editedProductDetails.category}
                onChange={(e) => setEditedProductDetails({ ...editedProductDetails, category: e.target.value })}
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Ingredients (comma separated)"
                value={editedProductDetails.ingredients.join(", ")}
                onChange={(e) => setEditedProductDetails({ ...editedProductDetails, ingredients: e.target.value.split(",") })}
                required
                className="border p-2 rounded"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedProductDetails.stock}
                  onChange={(e) => setEditedProductDetails({ ...editedProductDetails, stock: e.target.checked })}
                />
                In Stock
              </label>
              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Update
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
