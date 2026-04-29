import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useProductStore, Product } from '../store/useProductStore';
import { useOrderStore, Order } from '../store/useOrderStore';
import { Navigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Box, ShoppingCart, Video, Image as ImageIcon, CheckCircle, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { orders, updateOrderStatus, deleteOrder } = useOrderStore();
  
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', description: '', price: 0, category: '', image: '', videoUrl: ''
  });

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateProduct(isEditing, formData);
      setIsEditing(null);
    } else {
      addProduct({
        name: formData.name || '',
        description: formData.description || '',
        price: formData.price || 0,
        category: formData.category || '',
        image: formData.image || '',
        videoUrl: formData.videoUrl || '',
      });
    }
    setFormData({ name: '', description: '', price: 0, category: '', image: '', videoUrl: '' });
  };

  const handleEdit = (product: Product) => {
    setIsEditing(product.id);
    setFormData(product);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-900 text-white min-h-[calc(100vh-5rem)] fixed left-0 flex flex-col p-6 hidden md:flex">
        <h2 className="text-xl font-bold mb-10 text-orange-500">Admin Panel</h2>
        <nav className="space-y-4">
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <Box className="h-5 w-5" /> Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <ShoppingCart className="h-5 w-5" /> Orders
          </button>
        </nav>
      </aside>

      {/* Mobile Tab selector */}
      <div className="md:hidden fixed z-40 bottom-0 left-0 w-full bg-navy-900 flex text-white shadow-2xl">
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex-1 p-4 flex justify-center border-t-2 ${activeTab === 'products' ? 'border-orange-500 text-orange-500' : 'border-transparent'}`}
        >
          <Box className="h-6 w-6" />
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex-1 p-4 flex justify-center border-t-2 ${activeTab === 'orders' ? 'border-orange-500 text-orange-500' : 'border-transparent'}`}
        >
          <ShoppingCart className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-navy-900">
            {activeTab === 'products' ? 'Manage Products' : 'Sales Orders'}
          </h1>
        </div>

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add/Edit Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1 h-fit">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="h-5 w-5 text-orange-500" /> 
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleSubmitProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (NGN)</label>
                  <input required type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-blue-600 font-medium">Click to upload image</span>
                    </label>
                  </div>
                  {formData.image && (
                    <div className="mt-2 h-20 w-20 rounded-lg overflow-hidden border">
                      <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video Link (Optional)</label>
                  <div className="flex relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Video className="h-4 w-4 text-gray-400" />
                    </div>
                    <input type="url" value={formData.videoUrl || ''} onChange={e => setFormData({...formData, videoUrl: e.target.value})} className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="https://youtube.com/..." />
                  </div>
                </div>
                <div className="pt-4 flex gap-2">
                  <button type="submit" className="flex-1 bg-navy-900 text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors">
                    {isEditing ? 'Update' : 'Publish'}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={() => {setIsEditing(null); setFormData({name:'',description:'',price:0,category:'',image:'',videoUrl:''})}} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Product List */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-4 font-semibold text-gray-600">Product</th>
                      <th className="p-4 font-semibold text-gray-600">Price</th>
                      <th className="p-4 font-semibold text-gray-600">Category</th>
                      <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                            <span className="font-bold text-navy-900">{product.name}</span>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-gray-600">₦{product.price.toLocaleString()}</td>
                        <td className="p-4"><span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold">{product.category}</span></td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              {orders.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No orders yet.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-4 font-semibold text-gray-600">Customer</th>
                      <th className="p-4 font-semibold text-gray-600">Item</th>
                      <th className="p-4 font-semibold text-gray-600">Amount</th>
                      <th className="p-4 font-semibold text-gray-600">Ref</th>
                      <th className="p-4 font-semibold text-gray-600">Status</th>
                      <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-4 font-medium text-navy-900">{order.customerEmail}</td>
                        <td className="p-4 text-gray-600">{order.productName}</td>
                        <td className="p-4 font-bold text-gray-900">₦{order.amount.toLocaleString()}</td>
                        <td className="p-4 font-mono text-xs text-gray-500">{order.reference}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max ${
                            order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {order.status === 'Completed' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button 
                            onClick={() => updateOrderStatus(order.id, order.status === 'Pending' ? 'Completed' : 'Pending')}
                            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors border"
                          >
                            Toggle Status
                          </button>
                          <button onClick={() => deleteOrder(order.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex align-middle">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
