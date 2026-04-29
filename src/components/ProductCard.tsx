import React, { useEffect, useState } from 'react';
import { Clock, Info, ShoppingCart, Video, Plus } from 'lucide-react';
import { Product } from '../store/useProductStore';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { useCartStore } from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const { user } = useAuthStore();
  const { addOrder } = useOrderStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  // Generate Urgency logic
  useEffect(() => {
    if (!product.timerEndsAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = product.timerEndsAt! - now;

      if (distance < 0) {
        // Reset timer to a random time between 30m and 2h for continuous urgency
        product.timerEndsAt = now + (Math.floor(Math.random() * 90) + 30) * 60 * 1000;
        setTimeLeft('00:00:00');
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [product]);

  const handleBuyNow = () => {
    if (!user) {
      alert("Please Sign In first to make a purchase.");
      navigate('/auth');
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      key: 'pk_live_e5b70f1b56437bb00b89ba158b1958a2d6176214', // LIVE KEY as provided
      email: user.email,
      amount: product.price * 100, // in kobo
      currency: 'NGN',
      callback: function (response: any) {
        alert('Payment Successful! Reference: ' + response.reference);
        
        // Save Order
        addOrder({
          id: response.reference,
          customerEmail: user.email,
          productName: product.name,
          amount: product.price,
          reference: response.reference,
          status: 'Completed',
          date: new Date().toISOString(),
        });

        // Redirect to WhatsApp
        const waText = encodeURIComponent(`Hello I just paid for ${product.name} Amount: ₦${product.price.toLocaleString()} Reference: ${response.reference}`);
        window.open(`https://wa.me/2349135670770?text=${waText}`, '_blank');
      },
      onClose: function () {
        alert("Payment failed or cancelled. Try again.");
      },
    });
    handler.openIframe();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
      <div className="relative overflow-hidden aspect-[4/5]">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Urgency Badge */}
        <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg animate-pulse">
          <Info className="h-3 w-3" />
          Limited Stock!
        </div>
        
        {/* Timer floating */}
        {product.timerEndsAt && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold text-slate-800 shadow-xl flex items-center gap-2 min-w-[140px] justify-center scale-95 group-hover:scale-100 transition-transform">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="font-mono">{timeLeft}</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="text-xs font-semibold tracking-wider text-blue-600 uppercase mb-2">
          {product.category}
        </div>
        <h3 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className="text-xs text-gray-400 line-through mb-1">
              ₦{(product.price * 1.5).toLocaleString()}
            </div>
            <div className="text-2xl font-black text-navy-900">
              ₦{product.price.toLocaleString()}
            </div>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="bg-navy-900 hover:bg-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center transition-colors group/btn shadow-md hover:shadow-blue-500/30"
            title="Add to Cart"
          >
            <Plus className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
        
        {product.videoUrl && (
          <a 
            href={product.videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-navy-900 py-2.5 rounded-xl font-semibold transition-colors"
          >
            <Video className="h-4 w-4 text-red-500" /> Watch Promo Video
          </a>
        )}
        <button 
          onClick={handleBuyNow}
          className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-colors shadow-md hover:shadow-orange-500/30 active:scale-[0.98]"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
