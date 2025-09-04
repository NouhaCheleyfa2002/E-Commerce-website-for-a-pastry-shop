import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardActions, CardContent, Collapse,
  Button, Typography, IconButton, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  useTheme, useMediaQuery, MenuItem, InputLabel, Select, FormControl,
  CircularProgress, Alert
} from '@mui/material';
import { Add, Edit, Delete, CloudUpload, Image } from '@mui/icons-material';
import Header from '../../components/Header';
import { useGetProductsQuery, useGetProductCategoriesQuery } from '../../state/api';

const Product = ({ product, onEdit, onDelete }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card sx={{
      backgroundImage: "none",
      backgroundColor: theme.palette.background.alt,
      borderRadius: "0.55rem"
    }}>
      <CardContent>
        {product.isTrending && (
          <Typography color={theme.palette.error.main} fontWeight="bold">🔥 Trending</Typography>
        )}
        {product.image && (
          <Box 
            component="img" 
            src={product.image} 
            alt={product.name}
            sx={{ 
              width: "100%", 
              height: 200, 
              objectFit: "cover", 
              borderRadius: "0.5rem", 
              mb: 1 
            }} 
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <Typography fontSize={14} color={theme.palette.secondary[700]}>{product.category}</Typography>
        <Typography variant="h5">{product.name}</Typography>
        <Typography color={theme.palette.secondary[400]}>${Number(product.price).toFixed(2)}</Typography>
        <Typography variant="body2">{product.description}</Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button variant="contained" size="small" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Hide Details" : "See More"}
        </Button>
        <Box>
          <IconButton onClick={() => onEdit(product)}><Edit /></IconButton>
          <IconButton onClick={() => onDelete(product)}><Delete /></IconButton>
        </Box>
      </CardActions>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>ID: {product._id}</Typography>
          <Typography>Stock: {product.stock}</Typography>
          <Typography>Sales: {product.stat?.yearSalesTotal}</Typography>
          {product.ingredients?.length > 0 && (
            <>
              <Typography>Ingredients:</Typography>
              <ul>{product.ingredients.map((i, idx) => (
                <li key={idx}><Typography>{i}</Typography></li>
              ))}</ul>
            </>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

// Enhanced Image Upload Component
const ImageUpload = ({ currentImage, onImageChange, isUploading }) => {
  const [preview, setPreview] = useState(currentImage || null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
      
      // Pass file to parent
      onImageChange(file);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>Product Image</Typography>
      
      {/* Current/Preview Image */}
      {preview && (
        <Box mb={2}>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ 
              width: '100%', 
              maxHeight: 200, 
              objectFit: 'cover', 
              borderRadius: 8,
              border: '1px solid #ddd'
            }} 
          />
        </Box>
      )}

      {/* Upload Area */}
      <Box
        sx={{
          border: `2px dashed ${dragActive ? '#1976d2' : '#ccc'}`,
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: dragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('image-upload-input').click()}
      >
        {isUploading ? (
          <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
            <CircularProgress size={24} />
            <Typography variant="body2">Uploading image...</Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
            <CloudUpload sx={{ fontSize: 48, color: 'text.secondary' }} />
            <Typography variant="body1">
              Drop image here or click to browse
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supports: JPG, PNG, GIF (Max 5MB)
            </Typography>
          </Box>
        )}
        
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
          disabled={isUploading}
        />
      </Box>
    </Box>
  );
};

const Products = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const { data = [], isLoading, refetch } = useGetProductsQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [formState, setFormState] = useState({
    name: "", 
    description: "", 
    price: "", 
    category: "", 
    image: null,
    imageFile: null, // Separate field for file object
    ingredients: "", 
    stock: ""
  });
  
  const { data: categoriesData = [] } = useGetProductCategoriesQuery();

  // Initialize products when data changes from API
  useEffect(() => {
    if (data && data.length > 0 && !hasLocalChanges) {
      setProducts(data);
    }
  }, [data, hasLocalChanges]);

  useEffect(() => {
    if (JSON.stringify(categoriesData) !== JSON.stringify(categories)) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/product/${productToDelete._id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
      setHasLocalChanges(true);
      
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleAddClick = () => {
    setFormState({ 
      name: "", 
      description: "", 
      price: "", 
      category: "", 
      image: null,
      imageFile: null,
      ingredients: "", 
      stock: "" 
    });
    setSubmitError('');
    setOpenAddDialog(true);
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setFormState({
      ...product,
      ingredients: product.ingredients?.join(", ") || "",
      imageFile: null, // No file initially for edits
      image: product.image || null // Keep existing image URL
    });
    setSubmitError('');
    setOpenEditDialog(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (file) => {
    setFormState(prev => ({
      ...prev,
      imageFile: file
    }));
  };

  const submitProduct = async (method, url, onSuccess) => {
    setSubmitError('');
    
    try {
      // If there's a new image file, upload it first
      let imageUrl = formState.image; // Keep existing image URL for edits
      
      if (formState.imageFile) {
        setIsImageUploading(true);
        const imageFormData = new FormData();
        imageFormData.append('image', formState.imageFile);
        
        // Upload image to your backend Cloudinary endpoint
        const imageResponse = await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          body: imageFormData
        });
        
        if (!imageResponse.ok) {
          throw new Error('Failed to upload image');
        }
        
        const imageResult = await imageResponse.json();
        imageUrl = imageResult.imageUrl; // Use your API response structure
        setIsImageUploading(false);
      }

      // Prepare product data
      const productData = {
        name: formState.name,
        description: formState.description,
        price: Number(formState.price),
        category: formState.category,
        stock: Number(formState.stock),
        ingredients: formState.ingredients 
          ? formState.ingredients.split(',').map(i => i.trim()).filter(i => i)
          : [],
        ...(imageUrl && { image: imageUrl }) // Only include image if we have one
      };

      console.log("Submitting product data:", productData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const savedProduct = await response.json();
      console.log("API Response:", savedProduct);
      onSuccess(savedProduct);
      
    } catch (err) {
      console.error("Error submitting product:", err);
      setSubmitError(err.message);
      setIsImageUploading(false);
    }
  };

  const handleAddProduct = () => {
    submitProduct('POST', 'http://localhost:3000/api/product', (newProduct) => {
      setProducts(prev => [...prev, newProduct]);
      setHasLocalChanges(true);
      setOpenAddDialog(false);
    });
  };

  const handleEditProduct = () => {
    if (!productToEdit) return;
    
    const url = `http://localhost:3000/api/product/${productToEdit._id}`;
    submitProduct("PUT", url, async (updatedProduct) => {
      setHasLocalChanges(false);
      await refetch();
      setOpenEditDialog(false);
      setProductToEdit(null);
      setRefreshKey(prev => prev + 1);
    });
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory ? p.category === selectedCategory : true)
  );

  const closeDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setProductToEdit(null);
    setSubmitError('');
    setIsImageUploading(false);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PRODUCTS" subtitle="See your list of products." />

      <Box display="flex" justifyContent="space-between" mb="1.5rem" gap="1rem" flexWrap="wrap">
        <TextField
          label="Search products..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
        />
        <FormControl variant="outlined" size="small" fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            {categories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddClick}>
          Add Product
        </Button>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          gap="1.5rem"
          sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
        >
          {filteredProducts.map((product) => (
            <Product
              key={`${product._id}-${refreshKey}`}
              product={product}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openAddDialog || openEditDialog} 
        onClose={closeDialogs} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>{openAddDialog ? "Add Product" : "Edit Product"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          
          <TextField 
            name="name" 
            label="Name" 
            value={formState.name} 
            onChange={handleFormChange} 
            required
            fullWidth
          />
          
          <TextField 
            name="description" 
            label="Description" 
            value={formState.description} 
            onChange={handleFormChange} 
            multiline
            rows={3}
            fullWidth
          />
          
          <Box display="flex" gap={2}>
            <TextField 
              name="price" 
              label="Price" 
              type="number" 
              value={formState.price} 
              onChange={handleFormChange} 
              required
              sx={{ flex: 1 }}
            />
            <TextField 
              name="stock" 
              label="Stock" 
              type="number" 
              value={formState.stock} 
              onChange={handleFormChange} 
              required
              sx={{ flex: 1 }}
            />
          </Box>
          
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select 
              name="category" 
              value={formState.category} 
              onChange={handleFormChange} 
              label="Category"
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField 
            name="ingredients" 
            label="Ingredients (comma separated)" 
            value={formState.ingredients} 
            onChange={handleFormChange}
            fullWidth
          />
          
          <ImageUpload 
            currentImage={formState.image}
            onImageChange={handleImageChange}
            isUploading={isImageUploading}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={closeDialogs} disabled={isImageUploading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={openAddDialog ? handleAddProduct : handleEditProduct}
            disabled={isImageUploading}
          >
            {isImageUploading ? <CircularProgress size={20} /> : (openAddDialog ? "Add" : "Save")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{productToDelete?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteProduct} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;