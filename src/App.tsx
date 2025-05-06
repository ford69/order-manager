import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import Header from './components/Header';
import OrderForm from './components/OrderForm';
import OrderTable from './components/OrderTable';
import Auth from './components/Auth';
import { Order } from './types/order';
import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchOrders();
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchOrders();
      } else {
        setOrders([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedOrders: Order[] = data.map(order => ({
          id: order.order_id,
          date: order.date,
          customerName: order.customer_name,
          email: order.email,
          phone: order.phone || '',
          productName: order.product_name || '',
          productCode: order.product_code || '',
          size: order.size || '',
          fitType: order.fit_type || '',
          color: order.color || '',
          quantity: Number(order.quantity) || 1, 
          price: Number(order.price)
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOrderSubmit = async (newOrder: Order) => {
    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          order_id: newOrder.id,
          date: newOrder.date,
          customer_name: newOrder.customerName,
          email: newOrder.email,
          phone: newOrder.phone,
          product_name: newOrder.productName,
          product_code: newOrder.productCode,
          size: newOrder.size,
          fit_type: newOrder.fitType,
          color: newOrder.color,
          quantity: newOrder.quantity, 
          price: newOrder.price,
          user_id: session?.user.id
        });

      if (error) {
        throw error;
      }

      await fetchOrders();
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header session={session} />
        <Auth />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header session={session} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <section className="animate-fade-in">
            <OrderForm onSubmit={handleOrderSubmit} />
          </section>
          
          <section>
            <div className="border-b border-gray-200 pb-2 mb-4">
              <h2 className="text-xl font-bold text-gray-800">Order History</h2>
              <p className="text-sm text-gray-500">
                {loading ? 'Loading orders...' : `Displaying ${orders.length} total orders`}
              </p>
            </div>
            
            <OrderTable orders={orders} />
          </section>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Noble Fit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;