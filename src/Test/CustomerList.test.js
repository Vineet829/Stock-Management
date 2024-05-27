import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import CustomerList from '../CustomerList';
import '@testing-library/jest-dom/extend-expect';


const mock = new axiosMock(axios);

describe('CustomerList Component', () => {
  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  beforeEach(() => {
 
    mock.reset();
  });

  test('fetches and displays customers', async () => {
    mock.onGet('http://localhost:9000/customers').reply(200, { data: customers });
    render(<CustomerList />);

    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

   
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('creates a new customer', async () => {
    mock.onGet('http://localhost:9000/customers').reply(200, { data: customers });
    mock.onPost('http://localhost:9000/customers').reply(201);

    render(<CustomerList />);

    fireEvent.click(screen.getByText(/create customer/i));


    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Customer' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'new@example.com' } });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText('New Customer')).toBeInTheDocument();
    });
  });

  test('updates an existing customer', async () => {
    mock.onGet('http://localhost:9000/customers').reply(200, { data: customers });
    mock.onPut(`http://localhost:9000/customers/1`).reply(200);

    render(<CustomerList />);

    fireEvent.click(screen.getAllByText(/update/i)[0]);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Updated Name' } });

  
    fireEvent.click(screen.getByText(/save/i));

    
    await waitFor(() => {
      expect(screen.getByText('Updated Name')).toBeInTheDocument();
    });
  });

  test('deletes a customer', async () => {
    mock.onGet('http://localhost:9000/customers').reply(200, { data: customers });
    mock.onDelete('http://localhost:9000/customers/1').reply(200);

    render(<CustomerList />);

  
    fireEvent.click(screen.getAllByText(/delete/i)[0]);

    
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });
});
