/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import WhatsAppButton from './components/WhatsAppButton';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import { useProductStore } from './store/useProductStore';
import { useOrderStore } from './store/useOrderStore';

export default function App() {
  const { fetchProducts } = useProductStore();
  const { fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
        <WhatsAppButton />
        <Footer />
      </div>
    </Router>
  );
}
