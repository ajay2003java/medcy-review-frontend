import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Users, MessageSquare, Plus, Link as LinkIcon, Building2, FlaskConical, GraduationCap } from 'lucide-react';

interface Clinic {
  id: string;
  name: string;
  category: string;
  google_review_url: string;
  qr_identifier: string;
  theme_color: string;
}

function LogoUrlInput({ 
  value, 
  onChange, 
  placeholder = "https://example.com/logo.png or Kommodo link" 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (Optional)</label>
      <input 
        type="url" 
        value={value || ''} 
        onChange={e => onChange(e.target.value)} 
        className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 bg-gray-50" 
        placeholder={placeholder} 
      />
      {value && (
        <div className="mt-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center space-x-3">
          <img 
            src={value} 
            alt="Logo preview" 
            className="h-10 w-10 object-contain rounded-lg border bg-white p-1"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
            onLoad={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'block';
            }}
          />
          <div className="text-xs text-gray-600">
            {value.includes('kommodo') || value.includes('komodo') ? (
              <span className="text-emerald-700 font-semibold block">
                ⚡ Kommodo link detected: Backend will automatically extract the raw image URL on save.
              </span>
            ) : value.includes('drive.google.com') ? (
              <span className="text-emerald-700 font-semibold block">
                ⚡ Google Drive link detected: Backend will automatically convert to direct image stream.
              </span>
            ) : (
              <span className="text-gray-500">Image preview. Direct image URLs (.png, .jpg) recommended.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'clinics' | 'add-clinic' | 'labs' | 'add-lab' | 'institutes' | 'add-institute' | 'feedback'>('clinics');
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [institutes, setInstitutes] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);

  // Clinic Form State
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    category: 'Dentist',
    google_review_url: '',
    theme_color: '#0ea5e9'
  });
  const [createdClinic, setCreatedClinic] = useState<Clinic | null>(null);

  // Laboratory Form State
  const [labFormData, setLabFormData] = useState({
    name: '',
    logo_url: '',
    category: 'Laboratory',
    google_review_url: '',
    theme_color: '#10b981'
  });
  const [createdLab, setCreatedLab] = useState<Clinic | null>(null);

  // Institute Form State
  const [instituteFormData, setInstituteFormData] = useState({
    name: '',
    logo_url: '',
    category: 'School',
    google_review_url: '',
    theme_color: '#0ea5e9'
  });
  const [createdInstitute, setCreatedInstitute] = useState<Clinic | null>(null);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await axios.get(`${API_URL}/api/v1/management/?t=${new Date().getTime()}`);
      setClinics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await axios.get(`${API_URL}/api/v1/institute-management/?t=${new Date().getTime()}`);
      setInstitutes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'clinics' || activeTab === 'labs') {
      fetchClinics();
    } else if (activeTab === 'institutes') {
      fetchInstitutes();
    }
  }, [activeTab]);

  const resetAllCreated = () => {
    setCreatedClinic(null);
    setCreatedLab(null);
    setCreatedInstitute(null);
  };

  const handleCreateClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await axios.post(`${API_URL}/api/v1/management/`, formData);
      setCreatedClinic(res.data);
      setFormData({ name: '', logo_url: '', category: 'Dentist', google_review_url: '', theme_color: '#0ea5e9' });
      fetchClinics();
    } catch (err) {
      alert("Failed to create clinic. Make sure the backend is running and the database is connected.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLab = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await axios.post(`${API_URL}/api/v1/management/`, labFormData);
      setCreatedLab(res.data);
      setLabFormData({ name: '', logo_url: '', category: 'Laboratory', google_review_url: '', theme_color: '#10b981' });
      fetchClinics();
    } catch (err) {
      alert("Failed to create laboratory. Make sure the backend is running and the database is connected.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInstitute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await axios.post(`${API_URL}/api/v1/institute-management/`, instituteFormData);
      setCreatedInstitute(res.data);
      setInstituteFormData({ name: '', logo_url: '', category: 'School', google_review_url: '', theme_color: '#0ea5e9' });
      fetchInstitutes();
    } catch (err) {
      alert("Failed to create institute.");
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'clinics': return 'Clinics';
      case 'add-clinic': return 'Add New Clinic';
      case 'labs': return 'Laboratories';
      case 'add-lab': return 'Add New Laboratory';
      case 'institutes': return 'Institutes';
      case 'add-institute': return 'Add New Institute';
      case 'feedback': return 'All Feedback';
      default: return '';
    }
  };

  const medicalClinics = clinics.filter(c => c.category !== 'Laboratory');
  const laboratories = clinics.filter(c => c.category === 'Laboratory');

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-screen sticky top-0">
        <div className="flex items-center mb-10 text-primary font-bold text-2xl">
          <Building2 className="mr-2 h-8 w-8" />
          Medcy Admin
        </div>
        
        <nav className="space-y-2 flex-1">
          {/* Clinics Section */}
          <button 
            onClick={() => { setActiveTab('clinics'); resetAllCreated(); }}
            className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'clinics' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" /> Clinics
          </button>
          <button 
            onClick={() => { setActiveTab('add-clinic'); resetAllCreated(); }}
            className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'add-clinic' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Plus className="mr-3 h-5 w-5" /> Add New Clinic
          </button>
          
          {/* Laboratories Section */}
          <div className="pt-2 border-t border-gray-100 mt-2">
            <button 
              onClick={() => { setActiveTab('labs'); resetAllCreated(); }}
              className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'labs' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <FlaskConical className="mr-3 h-5 w-5" /> Laboratories
            </button>
            <button 
              onClick={() => { setActiveTab('add-lab'); resetAllCreated(); }}
              className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'add-lab' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Plus className="mr-3 h-5 w-5" /> Add New Lab
            </button>
          </div>

          {/* Institutes Section */}
          <div className="pt-2 border-t border-gray-100 mt-2">
            <button 
              onClick={() => { setActiveTab('institutes'); resetAllCreated(); }}
              className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'institutes' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <GraduationCap className="mr-3 h-5 w-5" /> Institutes
            </button>
            <button 
              onClick={() => { setActiveTab('add-institute'); resetAllCreated(); }}
              className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'add-institute' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Plus className="mr-3 h-5 w-5" /> Add New Institute
            </button>
          </div>

          {/* Feedback */}
          <div className="pt-2 border-t border-gray-100 mt-2">
            <button 
              onClick={() => { setActiveTab('feedback'); resetAllCreated(); }}
              className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'feedback' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <MessageSquare className="mr-3 h-5 w-5" /> All Feedback
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {getPageTitle()}
        </h1>

        {/* Clinics List */}
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
                {medicalClinics.map(clinic => (
                  <tr key={clinic.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800 flex items-center">
                      <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: clinic.theme_color }}></div>
                      {clinic.name}
                    </td>
                    <td className="p-4 text-gray-600">{clinic.category}</td>
                    <td className="p-4">
                      <a href={`/review/${clinic.qr_identifier}`} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center text-sm font-medium">
                        <LinkIcon className="h-4 w-4 mr-1" />
                        {window.location.origin}/review/{clinic.qr_identifier}
                      </a>
                    </td>
                  </tr>
                ))}
                {medicalClinics.length === 0 && !loading && (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-500">No clinics onboarded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Clinic Form */}
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
                  <span className="font-mono text-primary font-bold">{window.location.origin}/review/{createdClinic.qr_identifier}</span>
                  <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/review/${createdClinic.qr_identifier}`)} className="text-sm bg-white border px-3 py-1 rounded-lg hover:bg-gray-50 text-gray-700">Copy Link</button>
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
                    <option value="Dentist">Dentist</option>
                    <option value="IVF">IVF</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="General Hospital">General Hospital</option>
                  </select>
                </div>

                <LogoUrlInput 
                  value={formData.logo_url} 
                  onChange={val => setFormData({...formData, logo_url: val})} 
                />

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

        {/* Laboratories List */}
        {activeTab === 'labs' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-600">Laboratory Name</th>
                  <th className="p-4 font-semibold text-gray-600">Category</th>
                  <th className="p-4 font-semibold text-gray-600">Patient Link (QR)</th>
                </tr>
              </thead>
              <tbody>
                {laboratories.map(lab => (
                  <tr key={lab.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800 flex items-center">
                      <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: lab.theme_color }}></div>
                      {lab.name}
                    </td>
                    <td className="p-4 text-gray-600">{lab.category}</td>
                    <td className="p-4">
                      <a href={`/review/${lab.qr_identifier}`} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center text-sm font-medium">
                        <LinkIcon className="h-4 w-4 mr-1" />
                        {window.location.origin}/review/{lab.qr_identifier}
                      </a>
                    </td>
                  </tr>
                ))}
                {laboratories.length === 0 && !loading && (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-500">No laboratories onboarded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Laboratory Form */}
        {activeTab === 'add-lab' && (
          <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            {createdLab ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FlaskConical className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Laboratory Created!</h2>
                <p className="text-gray-600 mb-6">You can now generate a QR code for the diagnostic feedback link below.</p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                  <span className="font-mono text-primary font-bold">{window.location.origin}/review/{createdLab.qr_identifier}</span>
                  <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/review/${createdLab.qr_identifier}`)} className="text-sm bg-white border px-3 py-1 rounded-lg hover:bg-gray-50 text-gray-700">Copy Link</button>
                </div>
                <button onClick={() => setCreatedLab(null)} className="mt-8 text-primary font-medium hover:underline">Add another laboratory</button>
              </div>
            ) : (
              <form onSubmit={handleCreateLab} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Laboratory / Diagnostic Center Name</label>
                  <input required type="text" value={labFormData.name} onChange={e => setLabFormData({...labFormData, name: e.target.value})} className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 bg-gray-50" placeholder="e.g. Medcy Diagnostics & Pathology" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" disabled value="Laboratory (Diagnostic & Pathology)" className="w-full border-gray-300 rounded-xl shadow-sm p-3 bg-gray-100 text-gray-600 cursor-not-allowed" />
                </div>

                <LogoUrlInput 
                  value={labFormData.logo_url} 
                  onChange={val => setLabFormData({...labFormData, logo_url: val})} 
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Google Review URL</label>
                  <input required type="url" value={labFormData.google_review_url} onChange={e => setLabFormData({...labFormData, google_review_url: e.target.value})} className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 bg-gray-50" placeholder="https://g.page/r/your-id" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Theme Color (Hex)</label>
                  <div className="flex space-x-4">
                    <input type="color" value={labFormData.theme_color} onChange={e => setLabFormData({...labFormData, theme_color: e.target.value})} className="h-12 w-12 rounded cursor-pointer" />
                    <input type="text" value={labFormData.theme_color} onChange={e => setLabFormData({...labFormData, theme_color: e.target.value})} className="flex-1 border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 bg-gray-50" />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-md hover:bg-primary/90 transition-colors">
                  {loading ? 'Creating...' : 'Create Laboratory'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Institutes List */}
        {activeTab === 'institutes' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-600">Institute Name</th>
                  <th className="p-4 font-semibold text-gray-600">Category</th>
                  <th className="p-4 font-semibold text-gray-600">Student Link (QR)</th>
                </tr>
              </thead>
              <tbody>
                {institutes.map(inst => (
                  <tr key={inst.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800 flex items-center">
                      <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: inst.theme_color }}></div>
                      {inst.name}
                    </td>
                    <td className="p-4 text-gray-600">{inst.category}</td>
                    <td className="p-4">
                      <a href={`/institute/${inst.qr_identifier}`} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center text-sm font-medium">
                        <LinkIcon className="h-4 w-4 mr-1" />
                        {window.location.origin}/institute/{inst.qr_identifier}
                      </a>
                    </td>
                  </tr>
                ))}
                {institutes.length === 0 && !loading && (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-500">No institutes onboarded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Institute Form */}
        {activeTab === 'add-institute' && (
          <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            {createdInstitute ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LayoutDashboard className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Institute Created!</h2>
                <p className="text-gray-600 mb-6">You can now generate a QR code for the link below.</p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                  <span className="font-mono text-primary font-bold">{window.location.origin}/institute/{createdInstitute.qr_identifier}</span>
                  <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/institute/${createdInstitute.qr_identifier}`)} className="text-sm bg-white border px-3 py-1 rounded-lg hover:bg-gray-50 text-gray-700">Copy Link</button>
                </div>
                <button onClick={() => setCreatedInstitute(null)} className="mt-8 text-primary font-medium hover:underline">Add another institute</button>
              </div>
            ) : (
              <form onSubmit={handleCreateInstitute} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
                  <input required type="text" value={instituteFormData.name} onChange={e => setInstituteFormData({...instituteFormData, name: e.target.value})} className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 bg-gray-50" placeholder="e.g. Medcy Junior College" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={instituteFormData.category} onChange={e => setInstituteFormData({...instituteFormData, category: e.target.value})} className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 bg-gray-50">
                    <option value="School">School</option>
                    <option value="Junior College">Junior College</option>
                    <option value="Degree College">Degree College</option>
                    <option value="Engineering College">Engineering College</option>
                  </select>
                </div>

                <LogoUrlInput 
                  value={instituteFormData.logo_url} 
                  onChange={val => setInstituteFormData({...instituteFormData, logo_url: val})} 
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Google Review URL</label>
                  <input required type="url" value={instituteFormData.google_review_url} onChange={e => setInstituteFormData({...instituteFormData, google_review_url: e.target.value})} className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 bg-gray-50" placeholder="https://g.page/r/your-id" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Theme Color (Hex)</label>
                  <div className="flex space-x-4">
                    <input type="color" value={instituteFormData.theme_color} onChange={e => setInstituteFormData({...instituteFormData, theme_color: e.target.value})} className="h-12 w-12 rounded cursor-pointer" />
                    <input type="text" value={instituteFormData.theme_color} onChange={e => setInstituteFormData({...instituteFormData, theme_color: e.target.value})} className="flex-1 border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 bg-gray-50" />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-md hover:bg-primary/90 transition-colors">
                  {loading ? 'Creating...' : 'Create Institute'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Feedback Section */}
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
