import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Box, CircularProgress, Avatar, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Delete, Edit } from "@mui/icons-material";
import SalesOrderForm from './SalesOrderForm'; 

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const Token = localStorage.getItem('Token');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:9000/sales-orders', {
        headers: {
          Token: Token,
        },
      });
setOrders(currentOrders => currentOrders.map(o => o.id === order.id ? response.data : o));
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOrder = async (order) => {
    if (order.id) {
      // Update order
      try {
        const response = await axios.put(`http://localhost:9000/sales-orders/${order.id}`, order, {
          headers: {
            Token: Token,
          },
        });
        setOrders(orders.map(o => o.id === order.id ? response.data : o));
      } catch (error) {
        console.error("Error updating order:", error);
        setError("Failed to update order.");
      }
    } else {
      // Create new order
      try {
        const response = await axios.post('http://localhost:9000/sales-orders', order, {
          headers: {
            Token: Token,
          },
        });
        setOrders([...orders, response.data]);
      } catch (error) {
        console.error("Error creating order:", error);
        setError("Failed to create order.");
      }
    }
    setFormOpen(false);
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/sales-orders/${id}`, {
        headers: {
          Token: Token,
        },
      });
      setOrders(orders.filter(order => order.id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("Failed to delete order.");
    }
  };

  const handleOpenForm = (order) => {
    setSelectedOrder(order);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedOrder(null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "fullname",
      headerName: "Full Name",
      width: 400,
      renderCell: (params) => {
        const customer = params.row.customer || {};
        return (
          <>
            <Avatar alt="name" sx={{ width: 30, height: 30 }}>
              {customer.firstName ? customer.firstName.charAt(0) : 'N/A'}
            </Avatar>
            <Typography variant="subtitle2" sx={{ mx: 3 }}>
              {customer.firstName ? `${customer.firstName} ${customer.lastName}` : 'N/A'}
            </Typography>
          </>
        );
      },
    },
    { field: "mobile", headerName: "Mobile", width: 400, valueGetter: (params) => params.row.customer ? params.row.customer.mobile : 'N/A' },
    { field: "total", headerName: "Total Amount", width: 300, valueGetter: (params) => params.row.total ? params.row.total.toFixed(2) : '0.00' },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleOpenForm(params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="secondary" onClick={() => deleteOrder(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box
      sx={{
        margin: 3,
        bgcolor: "white",
        borderRadius: 2,
        padding: 3,
        height: "100%",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => handleOpenForm(null)} startIcon={<Add />}>
          Add Order
        </Button>
      </Box>
      <DataGrid
        sx={{
          borderLeft: 0,
          borderRight: 0,
          borderRadius: 0,
          marginTop: 2,
        }}
        rows={orders}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 15, 20]}
        rowHeight={40}
        disableSelectionOnClick
      />
      <SalesOrderForm
        open={formOpen}
        handleClose={handleCloseForm}
        handleSave={handleSaveOrder}
        order={selectedOrder}
      />
    </Box>
  );
};

export default OrderList;
