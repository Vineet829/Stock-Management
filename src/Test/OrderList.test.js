import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import OrderList from '../OrderList';
import '@testing-library/jest-dom/extend-expect';


const mock = new axiosMock(axios);

describe('OrderList Component', () => {
  const orders = [
    { id: 1, customer: { firstName: 'John', lastName: 'Doe', mobile: '1234567890' }, total: 100 },
    { id: 2, customer: { firstName: 'Jane', lastName: 'Smith', mobile: '0987654321' }, total: 200 },
  ];

  beforeEach(() => {
    mock.reset();
  });

  test('fetches and displays orders', async () => {
    mock.onGet('http://localhost:9000/sales-orders').reply(200, { data: orders });
    render(<OrderList />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('creates a new order', async () => {
    mock.onGet('http://localhost:9000/sales-orders').reply(200, { data: orders });
    mock.onPost('http://localhost:9000/sales-orders').reply(201, { id: 3, customer: { firstName: 'New', lastName: 'Customer', mobile: '1112223333' }, total: 300 });

    render(<OrderList />);

    fireEvent.click(screen.getByText(/add order/i));

    fireEvent.change(screen.getByLabelText(/customer first name/i), { target: { value: 'New' } });
    fireEvent.change(screen.getByLabelText(/customer last name/i), { target: { value: 'Customer' } });
    fireEvent.change(screen.getByLabelText(/mobile/i), { target: { value: '1112223333' } });
    fireEvent.change(screen.getByLabelText(/total amount/i), { target: { value: 300 } });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText('New Customer')).toBeInTheDocument();
    });
  });

  test('updates an existing order', async () => {
    mock.onGet('http://localhost:9000/sales-orders').reply(200, { data: orders });
    mock.onPut('http://localhost:9000/sales-orders/1').reply(200, { id: 1, customer: { firstName: 'Updated', lastName: 'Customer', mobile: '1234567890' }, total: 150 });

    render(<OrderList />);

    fireEvent.click(screen.getAllByLabelText(/edit/i)[0]);

    fireEvent.change(screen.getByLabelText(/customer first name/i), { target: { value: 'Updated' } });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText('Updated Customer')).toBeInTheDocument();
    });
  });

  test('deletes an order', async () => {
    mock.onGet('http://localhost:9000/sales-orders').reply(200, { data: orders });
    mock.onDelete('http://localhost:9000/sales-orders/1').reply(200);

    render(<OrderList />);

    fireEvent.click(screen.getAllByLabelText(/delete/i)[0]);

    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });
});
