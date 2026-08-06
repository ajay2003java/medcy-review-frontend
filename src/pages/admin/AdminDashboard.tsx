import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Users, MessageSquare, Plus, Link as LinkIcon, Building2 } from 'lucide-react';

interface Clinic {
  id: string;
  name: string;
  category: string;
  google_review_url: string;
  qr_identifier: string;
  theme_color: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'clinics' | 'add-clinic' | 'feedback'>('clinics');
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dentist',
    google_review_url: '',
    theme_color: '#0ea5e9'
  });
  const [createdClinic, setCreatedClinic] = useState<Clinic | null>(null);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await axios.get(`${API_URL}/api/v1/management/`);
      setClinics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'clinics') {
      fetchClinics();
    }
  }, [activeTab]);

  const handleCreateClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await axios.post(`${API_URL}/api/v1/management/`, formData);
      setCreatedClinic(res.data);
      setFormData({ name: '', category: 'Dentist', google_review_url: '', theme_color: '#0ea5e9' });
    } catch (err) {
      alert("Failed to create clinic. Make sure the backend is running and the database is connected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-screen sticky top-0">
        <div className="flex items-center mb-10 text-primary font-bold text-2xl">
          <Building2 className="mr-2 h-8 w-8" />
          Medcy Admin
        </div>
        
        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => { setActiveTab('clinics'); setCreatedClinic(null); }}
            className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'clinics' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" /> Clinics
          </button>
          <button 
            onClick={() => { setActiveTab('add-clinic'); setCreatedClinic(null); }}
            className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'add-clinic' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Plus className="mr-3 h-5 w-5" /> Add New Clinic
          </button>
          <button 
            onClick={() => { setActiveTab('feedback'); setCreatedClinic(null); }}
            className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'feedback' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <MessageSquare className="mr-3 h-5 w-5" /> All Feedback
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 capitalize">
          {activeTab.replace('-', ' ')}
        </h1>

        {activeTab === 'clinics' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-600">Clinic Name</th>
                  <th className="p-4 font-semibold text-gray-600">Category</th>
                  <th className="p-4 font-semibold text-gray-600">Patient Link (QR)</th>
                </tr>
              </thead>
              <tbody>
                {clinics.map(clinic => (
                  <tr key={clinic.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800 flex items-center">
                      <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: clinic.theme_color }}></div>
                      {clinic.name}
                    </td>
                    <td className="p-4 text-gray-600">{clinic.category}</td>
                    <td className="p-4">
                      <a href={`/review/${clinic.qr_identifier}`} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center text-sm font-medium">
                        <LinkIcon className="h-4 w-4 mr-1" />
                        /review/{clinic.qr_identifier}
                      </a>
                    </td>
                  </tr>
                ))}
                {clinics.length === 0 && !loading && (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-500">No clinics onboarded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'add-clinic' && (
          <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            {createdClinic ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LayoutDashboard className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Clinic Created!</h2>
                <p className="text-gray-600 mb-6">You can now generate a QR code for the link below.</p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                  <span className="font-mono text-primary font-bold">http://localhost:5173/review/{createdClinic.qr_identifier}</span>
                  <button onClick={() => navigator.clipboard.writeText(`http://localhost:5173/review/${createdClinic.qr_identifier}`)} className="text-sm bg-white border px-3 py-1 rounded-lg hover:bg-gray-50 text-gray-700">Copy Link</button>
                </div>
                <button onClick={() => setCreatedClinic(null)} className="mt-8 text-primary font-medium hover:underline">Add another clinic</button>
              </div>
            ) : (
              <form onSubmit={handleCreateClinic} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 bg-gray-50" placeholder="e.g. Medcy Dental Care" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 bg-gray-50">
                    <option value="IVF">IVF</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Dentist">Dentist</option>
                    <option value="General Hospital">General Hospital</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Google Review URL</label>
                  <input required type="url" value={formData.google_review_url} onChange={e => setFormData({...formData, google_review_url: e.target.value})} className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 bg-gray-50" placeholder="https://g.page/r/your-id" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Theme Color (Hex)</label>
                  <div className="flex space-x-4">
                    <input type="color" value={formData.theme_color} onChange={e => setFormData({...formData, theme_color: e.target.value})} className="h-12 w-12 rounded cursor-pointer" />
                    <input type="text" value={formData.theme_color} onChange={e => setFormData({...formData, theme_color: e.target.value})} className="flex-1 border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 bg-gray-50" />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-md hover:bg-primary/90 transition-colors">
                  {loading ? 'Creating...' : 'Create Clinic'}
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p>Feedback analytics will appear here once patients start submitting reviews.</p>
          </div>
        )}
      </div>
    </div>
  );
}
