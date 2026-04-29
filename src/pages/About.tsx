import React from 'react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-navy-900 mb-6">
              Our Story
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              At <strong className="text-orange-500">Abu Nasir Wealth Hub</strong>, we believe that an unforgettable scent is the ultimate accessory. Founded on the principles of luxury, variety, and uncompromising quality, our store has become a trusted destination for perfume connoisseurs.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We carefully curate our collection from the world's most prestigious fragrance houses, ensuring that whether you seek a subtle daytime aroma or a bold evening statement, you'll find exactly what you desire.
            </p>
            <div className="grid grid-cols-2 gap-8 mt-12 py-8 border-t border-gray-100">
              <div>
                <div className="text-4xl font-black text-blue-600 mb-2">100+</div>
                <div className="text-gray-500 font-medium">Premium Scents</div>
              </div>
              <div>
                <div className="text-4xl font-black text-blue-600 mb-2">10k+</div>
                <div className="text-gray-500 font-medium">Happy Customers</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-600 rounded-[2rem] transform translate-x-6 translate-y-6 opacity-20"></div>
            <img 
              src="https://images.unsplash.com/photo-1594035910387-fea477242680?auto=format&fit=crop&q=80&w=1000" 
              alt="About Us" 
              referrerPolicy="no-referrer"
              className="relative rounded-[2rem] shadow-2xl object-cover h-[600px] w-full"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
