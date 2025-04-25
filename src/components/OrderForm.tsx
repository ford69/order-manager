import React, { useState } from 'react';
import { Order, FormErrors } from '../types/order';

interface OrderFormProps {
  onSubmit: (order: Order) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit }) => {
  const initialOrderState: Order = {
    id: '',
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    email: '',
    phone: '',
    productName: '',
    productCode: '',
    size: '',
    fitType: '',
    color: '',
    price: 0,
  };

  const [order, setOrder] = useState<Order>(initialOrderState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!order.id.trim()) {
      newErrors.id = 'Order ID is required';
    }
    
    if (!order.customerName.trim()) {
      newErrors.customerName = 'Customer Name is required';
    }
    
    if (!order.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(order.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (order.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrder(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
    
    if (errors[name as keyof Order]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        onSubmit(order);
        setOrder(initialOrderState);
        setIsSubmitting(false);
      }, 300);
    }
  };

  const fitTypes = ['Regular', 'Slim', 'Athletic', 'Relaxed', 'Compression'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="bg-black px-6 py-4">
        <h2 className="text-xl font-bold text-white">New Order Entry</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 border-b pb-1">Order Information</h3>
            
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                Order ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={order.id}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.id ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-black'
                } sm:text-sm focus:border-black focus:ring-1`}
              />
              {errors.id && <p className="mt-1 text-sm text-red-500">{errors.id}</p>}
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Order Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={order.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={order.price}
                  onChange={handleChange}
                  className={`pl-7 block w-full rounded-md shadow-sm ${
                    errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-black'
                  } sm:text-sm focus:border-black focus:ring-1`}
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 border-b pb-1">Customer Information</h3>
            
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={order.customerName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.customerName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-black'
                } sm:text-sm focus:border-black focus:ring-1`}
              />
              {errors.customerName && <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={order.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-black'
                } sm:text-sm focus:border-black focus:ring-1`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={order.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <h3 className="font-medium text-gray-700 border-b pb-1 mb-4">Product Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={order.productName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="productCode" className="block text-sm font-medium text-gray-700">
                Product Code
              </label>
              <input
                type="text"
                id="productCode"
                name="productCode"
                value={order.productCode}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                Size
              </label>
              <select
                id="size"
                name="size"
                value={order.size}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm"
              >
                <option value="">Select Size</option>
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="fitType" className="block text-sm font-medium text-gray-700">
                Fit Type
              </label>
              <select
                id="fitType"
                name="fitType"
                value={order.fitType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm"
              >
                <option value="">Select Fit</option>
                {fitTypes.map(fit => (
                  <option key={fit} value={fit}>{fit}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={order.color}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;