import React, { useState, useEffect } from 'react';
import { Typography, Button, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import CustomerForm from './CustomerForm'; 

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const Token = localStorage.getItem('Token');

  useEffect(() => {
    fetchCustomers();
  }, []);
  const fetchCustomers = async () => {
    try {

      const response = await axios.get('http://localhost:9000/customers', {
        headers: {
          Token: Token,
        },
      });
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleCreateCustomer = (customer) => {
    axios
      .post("http://localhost:9000/customers", customer, {
        headers: {
          Token: Token,
        },
      })
      .then(() => {
        fetchCustomers();
      })
      .catch((error) => {
        console.error("Error creating customer:", error);
      });
  };

  const handleUpdateCustomer = (customer) => {
    axios
      .put(`http://localhost:9000/customers/${currentCustomer.id}`, customer, {
        headers: {
          Token: Token,
        },
      })
      .then(() => {
        fetchCustomers();
      })
      .catch((error) => {
        console.error("Error updating customer:", error);
      });
  };

  const handleDeleteCustomer = (id) => {
    axios
      .delete(`http://localhost:9000/customers/${id}`, {
        headers: {
          Token: Token,
        },
      })
      .then(() => {
        fetchCustomers();
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  };

  const handleOpenForm = (customer) => {
    setIsUpdating(!!customer);
    setCurrentCustomer(customer);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setCurrentCustomer(null);
  };

  const handleSaveCustomer = (customer) => {
    if (isUpdating) {
      handleUpdateCustomer(customer);
    } else {
      handleCreateCustomer(customer);
    }
    handleCloseForm();
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (cellData) => {
        return (
          <div>
            <Button variant="contained" color="primary" onClick={() => handleOpenForm(cellData.row)} sx={{marginRight:"15px"}}>
              Update
            </Button>
            <Button variant="contained" color="error" onClick={() => handleDeleteCustomer(cellData.row.id)}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

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
        Customers
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenForm(null)}>
        Create Customer
      </Button>
      <DataGrid
        sx={{
          borderLeft: 0,
          borderRight: 0,
          borderRadius: 0,
          marginTop: 2,
        }}
        rows={customers}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[15, 20, 30]}
        rowSelection={false}
      />
      <CustomerForm open={formOpen} handleClose={handleCloseForm} handleSave={handleSaveCustomer} customer={currentCustomer} />
    </Box>
  );
};

export default CustomerList;
