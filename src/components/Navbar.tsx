import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ShoppingBag, ShoppingCart, Menu, X, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, login, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAdminClick = () => {
    navigate('/admin');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Track Order', path: '/track' },
  ];

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex flex-shrink-0 items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl md:text-2xl text-navy-900 tracking-tight">
                ABU NASIR <span className="text-orange-500">WEALTH HUB</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
              </Link>
            ))}

            <div className="flex items-center gap-5 border-l border-gray-200 pl-6 ml-2">
              <button onClick={handleAdminClick} className="text-gray-600 hover:text-blue-600 transition-colors" title="Admin Dashboard">
                <ShieldCheck className="h-5 w-5" />
              </button>

              <Link to="/cart" className="text-gray-600 hover:text-blue-600 transition-colors relative group">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="flex items-center gap-2 relative group cursor-pointer">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                  
                  {/* Dropdown */}
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center md:hidden gap-4">
            <button onClick={handleAdminClick} className="text-gray-600 hover:text-blue-600">
              <ShieldCheck className="h-6 w-6" />
            </button>
            <Link to="/cart" className="text-gray-600 hover:text-blue-600 relative">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 ml-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  {link.name}
                </Link>
              ))}
              {!user ? (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium"
                >
                  Sign In
                </Link>
              ) : (
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="block w-full text-center mt-4 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-medium"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}
