import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import Products from '../Products';
import '@testing-library/jest-dom/extend-expect';


const mock = new axiosMock(axios);

describe('Products Component', () => {
  const products = [
    { id: 1, code: 'P001', name: 'Product 1', price: 100, minimum_stock: 10 },
    { id: 2, code: 'P002', name: 'Product 2', price: 200, minimum_stock: 5 },
  ];

  beforeEach(() => {
    mock.reset();
  });

  test('fetches and displays products', async () => {
    mock.onGet('http://localhost:9000/products').reply(200, { data: products });
    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  test('creates a new product', async () => {
    mock.onGet('http://localhost:9000/products').reply(200, { data: products });
    mock.onPost('http://localhost:9000/products').reply(201);

    render(<Products />);

    fireEvent.click(screen.getByText(/create product/i));

    fireEvent.change(screen.getByLabelText(/code/i), { target: { value: 'P003' } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Product' } });
    fireEvent.change(screen.getByLabelText(/sale price/i), { target: { value: 300 } });
    fireEvent.change(screen.getByLabelText(/minimum stock/i), { target: { value: 15 } });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText('New Product')).toBeInTheDocument();
    });
  });

  test('updates an existing product', async () => {
    mock.onGet('http://localhost:9000/products').reply(200, { data: products });
    mock.onPut('http://localhost:9000/products/1').reply(200);

    render(<Products />);

    fireEvent.click(screen.getAllByText(/update/i)[0]);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Updated Product' } });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText('Updated Product')).toBeInTheDocument();
    });
  });

  test('deletes a product', async () => {
    mock.onGet('http://localhost:9000/products').reply(200, { data: products });
    mock.onDelete('http://localhost:9000/products/1').reply(200);

    render(<Products />);

    fireEvent.click(screen.getAllByText(/delete/i)[0]);

    await waitFor(() => {
      expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
    });
  });
});
