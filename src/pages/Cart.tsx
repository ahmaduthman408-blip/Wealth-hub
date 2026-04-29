import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { addOrder } = useOrderStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      alert("Please Sign In first to checkout.");
      navigate('/auth');
      return;
    }

    if (items.length === 0) return;

    const total = getCartTotal();

    const handler = (window as any).PaystackPop.setup({
      key: 'pk_live_e5b70f1b56437bb00b89ba158b1958a2d6176214',
      email: user.email,
      amount: total * 100, // in kobo
      currency: 'NGN',
      callback: function (response: any) {
        alert('Payment Successful! Reference: ' + response.reference);
        
        // Save Order logic for each item
        const productNames = items.map(item => `${item.name} (x${item.quantity})`).join(', ');

        addOrder({
          customerEmail: user.email,
          productName: productNames,
          amount: total,
          reference: response.reference,
          status: 'Completed',
        });

        // Redirect to WhatsApp
        const waText = encodeURIComponent(`Hello I just paid for the following cart items: ${productNames}. Total Amount: ₦${total.toLocaleString()} Reference: ${response.reference}`);
        
        clearCart();
        window.open(`https://wa.me/2349135670770?text=${waText}`, '_blank');
        navigate('/');
      },
      onClose: function () {
        alert("Payment failed or cancelled. Try again.");
      },
    });
    handler.openIframe();
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-black text-navy-900 mb-8 flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-orange-500" /> Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
            <Link 
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
            >
              Continue Shopping <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
                  <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-24 h-24 object-cover rounded-xl" />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-navy-900">{item.name}</h3>
                    <p className="text-blue-600 font-bold mb-2">₦{item.price.toLocaleString()}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors font-bold"
                      >-</button>
                      <span className="font-bold w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors font-bold"
                      >+</button>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-4 min-w-[100px]">
                    <div className="text-lg font-black text-navy-900">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-semibold"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                <h3 className="text-xl font-bold text-navy-900 mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">₦{getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">Calculated at checkout</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-lg font-bold text-navy-900">Total</span>
                    <span className="text-2xl font-black text-orange-500">₦{getCartTotal().toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-navy-900 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-navy-900/20 active:scale-[0.98]"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
