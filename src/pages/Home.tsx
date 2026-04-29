import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Truck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { products } = useProductStore();
  const featured = products.slice(0, 4);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1615486171434-c7e6c4667a42?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Perfumes Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight"
          >
            Experience <span className="text-orange-500">Luxury</span> <br className="hidden md:block"/>
            In Every Scent
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto"
          >
            Discover our curated collection of premium fragrances designed to make you stand out and leave a lasting impression.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link 
              to="/products"
              className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 hover:scale-105 transition-all w-full sm:w-auto flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 group"
            >
              Shop Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/about"
              className="bg-white/10 text-white backdrop-blur-md border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 hover:scale-105 transition-all w-full sm:w-auto flex items-center justify-center"
            >
              Our Story
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Trusted by Many Customers
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-blue-100">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-navy-900">Original Products</h3>
              <p className="text-sm text-gray-500">100% Authentic quality</p>
            </div>
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-orange-100">
                <Truck className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-bold text-navy-900">Fast Delivery</h3>
              <p className="text-sm text-gray-500">Nationwide shipping</p>
            </div>
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-green-100">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-navy-900">24/7 Support</h3>
              <p className="text-sm text-gray-500">Always here for you</p>
            </div>
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-yellow-100">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="font-bold text-navy-900">Premium Quality</h3>
              <p className="text-sm text-gray-500">Top tier fragrances</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-navy-900 mb-4 tracking-tight">
                Trending Now
              </h2>
              <p className="text-gray-500 max-w-xl">
                Our most loved fragrances. Grab them before they sell out!
              </p>
            </div>
            <Link 
              to="/products"
              className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:text-orange-500 transition-colors group"
            >
              View All Collection
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Link 
            to="/products"
            className="md:hidden mt-8 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            View All Collection
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
