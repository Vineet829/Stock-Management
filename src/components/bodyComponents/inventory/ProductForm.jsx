import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';

const ProductForm = ({ open, handleClose, handleSave, product: initialProduct }) => {
  const [product, setProduct] = useState({
    id: "",
    company_id: 1,
    brand: '1',
    product_category: '1',
    code: 'PROD-03',
    name: 'Product Dua',
    price: 500,
    minimum_stock: 1000,
  });

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
    }
  }, [initialProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let modifiedValue = value;

    if (name === 'price' || name === 'minimum_stock') {
      modifiedValue = parseFloat(value);
      if (isNaN(modifiedValue)) {
        modifiedValue = name === 'price' ? 0 : ''; 
      }
    }

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: modifiedValue,
    }));
  };

  const handleSubmit = () => {
    const processedProduct = { ...product };

    if (processedProduct.minimum_stock !== '') {
      processedProduct.minimum_stock = processedProduct.minimum_stock.toString();
    }

    handleSave(processedProduct);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ backgroundColor: '#3f51b5', color: 'white', padding: '16px 24px' }}>
        {product.id ? 'Update Product' : 'Create Product'}
      </DialogTitle>
      <DialogContent sx={{ padding: '24px' }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="ID"
            name="id"
            value={product.id}
            onChange={handleChange}
            fullWidth
            disabled
          />
          <TextField
            label="Company ID"
            name="company_id"
            type="number"
            value={product.company_id}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Brand"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Product Category"
            name="product_category"
            value={product.product_category}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Code"
            name="code"
            value={product.code}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Name"
            name="name"
            value={product.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Minimum Stock"
            name="minimum_stock"
            type="number"
            value={product.minimum_stock}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          {product.id ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;

