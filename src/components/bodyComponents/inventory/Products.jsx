import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import ProductForm from "./ProductForm";

export default function Products() {
  const [productList, setProductList] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const Token = localStorage.getItem('Token');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get("http://localhost:9000/products", {
        headers: {
          Token: Token,
        },
      })
      .then((response) => {
        setProductList(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the product data!", error);
      });
  };

  const handleCreateProduct = (product) => {
    axios
      .post("http://localhost:9000/products", product, {
        headers: {
          Token: Token,
        },
      })
      .then(() => {
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error creating product:", error);
      });
  };

  const handleUpdateProduct = (product) => {
    
    axios
      .put(`http://localhost:9000/products/${currentProduct.id}`, (product), {
        headers: {
          Token: Token,
        },
      })
      .then(() => {
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  const handleDeleteProduct = (id) => {
    axios
      .delete(`http://localhost:9000/products/${id}`, {
        headers: {
          Token: Token,
        },
      })
      .then(() => {
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  const handleOpenForm = (product) => {
    setIsUpdating(!!product);
    setCurrentProduct(product);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setCurrentProduct(null);
  };

  const handleSaveProduct = (product) => {
    if (isUpdating) {
      handleUpdateProduct(product);
    } else {
      handleCreateProduct(product);
    }
    handleCloseForm();
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "code", headerName: "Code", width: 200 },
    { field: "name", headerName: "Name", width: 400 },
    { field: "price", headerName: "Sale Price", width: 150 },
    { field: "minimum_stock", headerName: "Minimum Stock", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (cellData) => {
        return (
          <div>
            <Button variant="contained" color="primary"  onClick={() => handleOpenForm(cellData.row)} sx={{marginRight:"15px"}}>
              Update
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleDeleteProduct(cellData.row.id)}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenForm(null)}>
        Create Product
      </Button>
      <DataGrid rows={productList} columns={columns} pageSize={10} checkboxSelection />
      <ProductForm open={formOpen} handleClose={handleCloseForm} handleSave={handleSaveProduct} product={currentProduct} />
    </div>
  );
}
