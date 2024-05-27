import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';

const SalesOrderForm = ({ open, handleClose, handleSave, order: initialOrder }) => {
  const [order, setOrder] = useState({
    id: '',
    company_id: 1,
    branch_id: 1,
    salesman_id: 1,
    customer_id: 1,
    code: '',
    date: '',
    disc: 0,
    created_by: 1,
    updated_by: 1,
    SalesOrderDetails: [
      { ID: '', Product: '', Price: 0, Disc: 0, Qty: 0 },
    ],
  });

  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
    }
  }, [initialOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let modifiedValue = value;
    let fieldName = name;

    if (['company_id', 'branch_id', 'salesman_id', 'customer_id', 'disc', 'created_by', 'updated_by'].includes(name)) {
      modifiedValue = parseFloat(value) || 0;
    } else if (name.startsWith('SalesOrderDetails')) {
      const matches = name.match(/^SalesOrderDetails\[(\d+)\]\.(.*)$/);
      if (matches) {
        const index = parseInt(matches[1], 10);
        const detailName = matches[2];
        const newDetails = [...order.SalesOrderDetails];
        let detailValue = value;
        if (['Price', 'Disc'].includes(detailName)) {
          detailValue = parseFloat(value) || 0;
        } else if (detailName === 'Qty') {
          detailValue = parseInt(value, 10) || 0;
        }
        newDetails[index] = { ...newDetails[index], [detailName]: detailValue };
        modifiedValue = newDetails;
        fieldName = 'SalesOrderDetails';
      }
    }

    setOrder(prevOrder => ({
      ...prevOrder,
      [fieldName]: modifiedValue,
    }));
  };

  const handleSubmit = () => {
    handleSave(order);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ backgroundColor: '#3f51b5', color: 'white' }}>
        {order.id ? 'Update Order' : 'Create Order'}
      </DialogTitle>
      <DialogContent sx={{ padding: '24px' }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* General Order Details */}
          <TextField label="Order Code" variant="outlined" name="code" value={order.code} onChange={handleChange} />
          <TextField label="Order Date" variant="outlined" name="date" type="date" value={order.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField label="Discount" variant="outlined" name="disc" type="number" value={order.disc} onChange={handleChange} />
          {/* Sales Order Details */}
          {order.SalesOrderDetails.map((detail, index) => (
            <React.Fragment key={index}>
              <TextField label="Product" variant="outlined" name={`SalesOrderDetails[${index}].Product`} value={detail.Product} onChange={handleChange} />
              <TextField label="Quantity" variant="outlined" name={`SalesOrderDetails[${index}].Qty`} type="number" value={detail.Qty} onChange={handleChange} />
              <TextField label="Price" variant="outlined" name={`SalesOrderDetails[${index}].Price`} type="number" value={detail.Price} onChange={handleChange} />
              <TextField label="Discount" variant="outlined" name={`SalesOrderDetails[${index}].Disc`} type="number" value={detail.Disc} onChange={handleChange} />
            </React.Fragment>
          ))}
          <Button onClick={() => setOrder(prevOrder => ({
            ...prevOrder,
            SalesOrderDetails: [...prevOrder.SalesOrderDetails, { ID: '', Product: '', Price: 0, Disc: 0, Qty: 0 }]
          }))} variant="contained" color="primary">
            Add Detail
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          {order.id ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SalesOrderForm;
