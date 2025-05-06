import React, { useState } from 'react';
import { Order, OrderFilters } from '../types/order';
import { Download, Search } from 'lucide-react';
import * as XLSX from 'xlsx';

interface OrderTableProps {
  orders: Order[];
}

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  const [filters, setFilters] = useState<OrderFilters>({
    orderId: '',
    startDate: '',
    endDate: '',
  });

  const filteredOrders = orders.filter(order => {
    const matchesId = order.id.toLowerCase().includes(filters.orderId.toLowerCase());
    const orderDate = new Date(order.date);
    const afterStartDate = !filters.startDate || orderDate >= new Date(filters.startDate);
    const beforeEndDate = !filters.endDate || orderDate <= new Date(filters.endDate);

    return matchesId && afterStartDate && beforeEndDate;
  });

  const totalValue = filteredOrders.reduce((sum, order) => sum + order.price * order.quantity, 0);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const exportToCSV = () => {
    const rows = filteredOrders.map(order => ({
      'Order ID': order.id,
      Date: order.date,
      'Customer Name': order.customerName,
      Email: order.email,
      Phone: order.phone,
      'Product Name': order.productName,
      'Product Code': order.productCode,
      Size: order.size,
      'Fit Type': order.fitType,
      Color: order.color,
      Qty: order.quantity,
      Price: formatCurrency(order.price),
      'Total Price': `"${formatCurrency(order.price * order.quantity)}"` // Wrap in quotes
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, `orders_${new Date().toISOString().split('T')[0]}.csv`);
  };
  

  const exportToExcel = () => {
    const formattedData = filteredOrders.map(order => ({
      'Order ID': order.id,
      'Date': new Date(order.date).toLocaleDateString(),
      'Customer Name': order.customerName,
      'Email': order.email,
      'Phone': order.phone,
      'Product Name': order.productName,
      'Product Code': order.productCode,
      'Size': order.size,
      'Fit Type': order.fitType,
      'Color': order.color,
      'Quantity': order.quantity,
      'Price': order.price,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
  
    XLSX.writeFile(workbook, `orders_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No orders have been submitted yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
              Search Order ID
            </label>
            <div className="relative">
              <input
                type="text"
                id="orderId"
                value={filters.orderId}
                onChange={(e) => setFilters(prev => ({ ...prev, orderId: e.target.value }))}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm"
                placeholder="Search by Order ID..."
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={exportToExcel}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Displaying {filteredOrders.length} of {orders.length} total orders
          </p>
          <p className="text-lg font-semibold">
            Total Value: {formatCurrency(totalValue)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Product</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Code</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Size</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fit</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Color</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Qty</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Price</th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredOrders.map((order, index) => (
                <tr
                  key={`${order.id}-${index}`}
                  className="animate-fade-in"
                >
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{order.id}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.date}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.customerName}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.email}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.phone}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.productName}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.productCode}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.size}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.fitType}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className="inline-flex items-center">
                      {order.color && (
                        <span
                          className="mr-2 h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: order.color.toLowerCase(),
                            display: /^#([0-9A-F]{3}){1,2}$/i.test(order.color) ? 'inline-block' : 'none'
                          }}
                        />
                      )}
                      {order.color}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.quantity}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {formatCurrency(order.price)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {formatCurrency(order.price * order.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;