import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';

const CustomerForm = ({ open, handleClose, handleSave, customer: initialCustomer }) => {
  const [customer, setCustomer] = useState({
    id: "",
    company_id: 1,
    name: '',
    email: '',
    address: '',
    hp: ''
  });

  useEffect(() => {
    if (initialCustomer) {
      setCustomer(initialCustomer);
    }
  }, [initialCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    handleSave(customer);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ backgroundColor: '#3f51b5', color: 'white', padding: '16px 24px' }}>
        {customer.id ? 'Update Customer' : 'Create Customer'}
      </DialogTitle>
      <DialogContent sx={{ padding: '24px' }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="ID"
            name="id"
            value={customer.id}
            onChange={handleChange}
            fullWidth
            disabled
          />
          <TextField
            label="Company ID"
            name="company_id"
            type="number"
            value={customer.company_id}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Name"
            name="name"
            value={customer.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Address"
            name="address"
            value={customer.address}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Phone"
            name="hp"
            value={customer.hp}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          {customer.id ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerForm;
