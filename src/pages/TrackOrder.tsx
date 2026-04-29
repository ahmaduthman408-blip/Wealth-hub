import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Package, CheckCircle, Clock } from 'lucide-react';

export default function TrackOrder() {
  const [reference, setReference] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference) return;

    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('reference', reference)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          setError('Order completely not found. Please verify your reference ID.');
        } else {
          setError('Failed to fetch order. Try again.');
        }
        setOrder(null);
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-16 min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-2xl px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 text-center">
          <Package className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-navy-900 mb-2">Track Your Order</h1>
          <p className="text-gray-500 mb-8">Enter your order reference ID below to see the current status of your package.</p>
          
          <form onSubmit={handleTrack} className="relative max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. tx_123456789"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full pl-4 pr-12 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-50 outline-none text-lg"
              />
              <button 
                type="submit"
                disabled={loading || !reference}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-navy-900 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {loading && <p className="text-gray-500 animate-pulse font-medium">Searching...</p>}
          {error && <p className="text-red-500 font-medium bg-red-50 p-4 rounded-xl">{error}</p>}

          {order && (
            <div className="text-left mt-8 pt-8 border-t border-gray-100 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Order Reference</p>
                  <p className="text-xl font-mono font-bold text-navy-900">{order.reference}</p>
                </div>
                <div className="mt-4 sm:mt-0 text-right">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 ${
                    ['Completed', 'Delivered'].includes(order.status) ? 'bg-green-100 text-green-700' :
                    ['Cancelled'].includes(order.status) ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {['Completed', 'Delivered'].includes(order.status) ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <div className="flex justify-between border-b border-gray-200 pb-4">
                  <span className="text-gray-600">Product</span>
                  <span className="font-bold text-navy-900">{order.product_name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-4">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-navy-900">₦{order.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-4">
                  <span className="text-gray-600">Date Ordered</span>
                  <span className="font-bold text-navy-900">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                {order.tracking_number && (
                  <div className="pt-2">
                    <span className="block text-gray-600 text-sm mb-1 uppercase tracking-wider font-bold">Tracking ID / Link</span>
                    <div className="font-mono bg-white p-3 rounded border border-gray-200 text-blue-600 select-all">
                      {order.tracking_number.startsWith('http') ? (
                         <a href={order.tracking_number} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">{order.tracking_number}</a>
                      ) : (
                         order.tracking_number
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
