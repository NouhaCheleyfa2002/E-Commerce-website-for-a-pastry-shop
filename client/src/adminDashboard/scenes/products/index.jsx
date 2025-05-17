import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardActions, CardContent, Collapse,
  Button, Typography, IconButton, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  useTheme, useMediaQuery, MenuItem, InputLabel, Select, FormControl
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Header from '../../components/Header';
import { useGetProductsQuery } from '../../state/api';

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
          <Box component="img" src={product.image} alt={product.name}
            sx={{ width: "100%", height: 200, objectFit: "cover", borderRadius: "0.5rem", mb: 1 }} />
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

const Products = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const { data = [], isLoading } = useGetProductsQuery();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // New state for selected category

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [formState, setFormState] = useState({
    name: "", description: "", price: "", category: "", image: null,
    ingredients: "", stock: ""
  });
  

  useEffect(() => {
    setProducts(data);
  }, [data]);



  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    try {
      await fetch(`/api/product/${productToDelete._id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleAddClick = () => {
    setFormState({ name: "", description: "", price: "", category: "", image: null, ingredients: "", stock: "" });
    setOpenAddDialog(true);
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setFormState({
      ...product,
      ingredients: product.ingredients?.join(", ") || "",
      image: null
    });
    setOpenEditDialog(true);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const submitProduct = async (method, url, onSuccess) => {
    const formData = new FormData();
    for (const key in formState) {
      if (key === "ingredients") {
        formData.append("ingredients", JSON.stringify(formState.ingredients.split(",").map(i => i.trim())));
      } else {
        formData.append(key, formState[key]);
      }
    }

    try {
      const res = await fetch(url, {
        method,
        body: formData
      });
      const saved = await res.json();
      onSuccess(saved);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = () => {
    submitProduct('POST', '/api/product', (newProd) => {
      setProducts(prev => [...prev, newProd]);
      setOpenAddDialog(false);
    });
  };

  const handleEditProduct = () => {
    submitProduct('PUT', `/api/product/${productToEdit._id}`, (updated) => {
      setProducts(prev => prev.map(p => (p._id === updated._id ? updated : p)));
      setOpenEditDialog(false);
    });
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory ? p.category === selectedCategory : true) // Filter based on selected category
  );

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
        <>Loading...</>
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
              key={product._id}
              product={product}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </Box>
      )}

      {/* Reusable Add/Edit Dialog */}
      <Dialog open={openAddDialog || openEditDialog} onClose={() => {
        setOpenAddDialog(false); setOpenEditDialog(false);
      }} maxWidth="sm" fullWidth>
        <DialogTitle>{openAddDialog ? "Add Product" : "Edit Product"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>

          <TextField name="name" label="Name" value={formState.name} onChange={handleFormChange} />
          <TextField name="description" label="Description" value={formState.description} onChange={handleFormChange} />
          <TextField name="price" label="Price" type="number" value={formState.price} onChange={handleFormChange} />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select name="category" value={formState.category} onChange={handleFormChange} label="Category">
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField name="ingredients" label="Ingredients (comma separated)" value={formState.ingredients} onChange={handleFormChange} />
          <TextField name="stock" label="Stock" type="number" value={formState.stock} onChange={handleFormChange} />
          <input name="image" type="file" accept="image/*" onChange={handleFormChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenAddDialog(false); setOpenEditDialog(false);
          }}>Cancel</Button>
          <Button variant="contained" onClick={openAddDialog ? handleAddProduct : handleEditProduct}>
            {openAddDialog ? "Add" : "Save"}
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
          <Button onClick={handleDeleteProduct} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
