import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Users, MessageSquare, Plus, Link as LinkIcon, Building2, FlaskConical, GraduationCap, Stethoscope, Copy, ExternalLink, Check, UserCheck, QrCode, X } from 'lucide-react';

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
  const [copiedDoc, setCopiedDoc] = useState<string | null>(null);
  const [selectedQrModal, setSelectedQrModal] = useState<{ name: string; url: string } | null>(null);
  const [createdClinic, setCreatedClinic] = useState<Clinic | null>(null);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'Kishore Bhavana Clinic') {
      setFormData({
        name: 'Kishore Bhavana Clinic',
        logo_url: '',
        category: 'Kishore Bhavana Clinic',
        google_review_url: 'https://search.google.com/local/writereview?placeid=ChIJ_kishore_bhavana_clinic',
        theme_color: '#0284c7'
      });
    } else {
      setFormData({
        ...formData,
        category: val,
        name: formData.name === 'Kishore Bhavana Clinic' ? '' : formData.name,
        google_review_url: formData.google_review_url === 'https://search.google.com/local/writereview?placeid=ChIJ_kishore_bhavana_clinic' ? '' : formData.google_review_url,
        theme_color: formData.theme_color === '#0284c7' ? '#0ea5e9' : formData.theme_color
      });
    }
  };

  const copyDoctorLink = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedDoc(key);
    setTimeout(() => setCopiedDoc(null), 2000);
  };

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
    setFormData({ name: '', logo_url: '', category: 'Dentist', google_review_url: '', theme_color: '#0ea5e9' });
  };

  const handleCreateClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category === 'Kishore Bhavana Clinic') {
      alert("Kishore Bhavana Clinic is already active and configured in the database (ID: b0101010-b010-b010-b010-b01010101010). No duplicate record was created.");
      return;
    }
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
                {medicalClinics.map(clinic => {
                  const isKishoreBhavana = clinic.qr_identifier === 'kishore-bhavana' || clinic.id === 'b0101010-b010-b010-b010-b01010101010';
                  return (
                    <tr key={clinic.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-800">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-3 shrink-0" style={{ backgroundColor: clinic.theme_color }}></div>
                          <div>
                            <div>{clinic.name}</div>
                            {isKishoreBhavana && (
                              <span className="text-[11px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-semibold border border-sky-200 mt-1 inline-block">
                                2 Doctors Configured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        <div>{clinic.category}</div>
                        {isKishoreBhavana && (
                          <div className="text-xs text-sky-700 font-medium mt-0.5">Specialties: Orthopedics &amp; Pediatrics</div>
                        )}
                      </td>
                      <td className="p-4">
                        {isKishoreBhavana ? (
                          <div className="space-y-2">
                            {/* Single Patient-Facing Review URL */}
                            <div className="flex items-center space-x-2">
                              <a 
                                href="/review/kishore-bhavana" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-primary hover:underline flex items-center text-sm font-semibold"
                              >
                                <LinkIcon className="h-4 w-4 mr-1 shrink-0" />
                                {window.location.origin}/review/kishore-bhavana
                              </a>
                            </div>

                            {/* One Copy Link and One QR Code for the single shared URL */}
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => copyDoctorLink(`${window.location.origin}/review/kishore-bhavana`, 'kb-table-copy')}
                                className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 flex items-center transition-colors shadow-xs"
                              >
                                {copiedDoc === 'kb-table-copy' ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                                {copiedDoc === 'kb-table-copy' ? 'Copied' : 'Copy Link'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedQrModal({ name: clinic.name, url: `${window.location.origin}/review/kishore-bhavana` })}
                                className="text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium px-2.5 py-1.5 rounded-lg border border-sky-200 flex items-center transition-colors shadow-xs"
                              >
                                <QrCode className="w-3.5 h-3.5 mr-1" />
                                QR Code
                              </button>
                            </div>

                            {/* Admin-only direct preview links */}
                            <div className="text-[11px] text-gray-400 flex items-center space-x-2 pt-1 border-t border-gray-100">
                              <span>Admin preview:</span>
                              <a href="/review/kishore" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-sky-600 underline">Dr. Kishore</a>
                              <span>•</span>
                              <a href="/review/bhavana" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-rose-600 underline">Dr. Bhavana</a>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <a href={`/review/${clinic.qr_identifier}`} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center text-sm font-medium">
                              <LinkIcon className="h-4 w-4 mr-1" />
                              {window.location.origin}/review/{clinic.qr_identifier}
                            </a>
                            <button
                              type="button"
                              onClick={() => setSelectedQrModal({ name: clinic.name, url: `${window.location.origin}/review/${clinic.qr_identifier}` })}
                              className="text-xs text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                              title="View QR Code"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    value={formData.category} 
                    onChange={handleCategoryChange} 
                    className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 bg-gray-50 font-medium"
                  >
                    <option value="Dentist">Dentist</option>
                    <option value="IVF">IVF</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="General Hospital">General Hospital</option>
                    <option value="Kishore Bhavana Clinic">Kishore Bhavana Clinic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className={`w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 ${formData.category === 'Kishore Bhavana Clinic' ? 'bg-gray-100 cursor-not-allowed font-semibold text-gray-800' : 'bg-gray-50'}`} 
                    placeholder="e.g. Medcy Dental Care" 
                    readOnly={formData.category === 'Kishore Bhavana Clinic'}
                  />
                  {formData.category === 'Kishore Bhavana Clinic' && (
                    <p className="text-xs text-sky-700 mt-1 font-medium">
                      Existing Clinic ID: <span className="font-mono font-semibold">b0101010-b010-b010-b010-b01010101010</span> (Active in Database)
                    </p>
                  )}
                </div>

                <LogoUrlInput 
                  value={formData.logo_url} 
                  onChange={val => setFormData({...formData, logo_url: val})} 
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Google Review URL</label>
                  <input 
                    required 
                    type="url" 
                    value={formData.google_review_url} 
                    onChange={e => setFormData({...formData, google_review_url: e.target.value})} 
                    className={`w-full border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 ${formData.category === 'Kishore Bhavana Clinic' ? 'bg-gray-100 cursor-not-allowed text-gray-700' : 'bg-gray-50'}`} 
                    placeholder="https://g.page/r/your-id" 
                    readOnly={formData.category === 'Kishore Bhavana Clinic'}
                  />
                  {formData.category === 'Kishore Bhavana Clinic' && (
                    <p className="text-xs text-emerald-700 mt-1 font-medium">
                      ✓ Shared Google Review URL across both doctors
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Theme Color (Hex)</label>
                  <div className="flex space-x-4">
                    <input 
                      type="color" 
                      value={formData.theme_color} 
                      onChange={e => setFormData({...formData, theme_color: e.target.value})} 
                      className="h-12 w-12 rounded cursor-pointer" 
                      disabled={formData.category === 'Kishore Bhavana Clinic'}
                    />
                    <input 
                      type="text" 
                      value={formData.theme_color} 
                      onChange={e => setFormData({...formData, theme_color: e.target.value})} 
                      className={`flex-1 border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary p-3 ${formData.category === 'Kishore Bhavana Clinic' ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'}`} 
                      readOnly={formData.category === 'Kishore Bhavana Clinic'}
                    />
                  </div>
                </div>

                {/* When Kishore Bhavana Clinic is selected: Load full existing configuration */}
                {formData.category === 'Kishore Bhavana Clinic' && (
                  <div className="space-y-4 pt-3 border-t border-gray-200 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center">
                        <Stethoscope className="w-4 h-4 mr-2 text-sky-600" />
                        Associated Doctors &amp; Configuration
                      </h3>
                      <span className="text-xs bg-sky-100 text-sky-800 font-semibold px-2.5 py-0.5 rounded-full">
                        2 Doctors Configured
                      </span>
                    </div>

                    {/* Single Shared Patient-Facing Review URL */}
                    <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Single Patient QR / Review Form Link
                        </label>
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                          Single Link for Both Doctors
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-sky-100 shadow-xs">
                        <span className="font-mono text-primary font-bold text-xs truncate">
                          {window.location.origin}/review/kishore-bhavana
                        </span>
                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => copyDoctorLink(`${window.location.origin}/review/kishore-bhavana`, 'kb-form-copy')}
                            className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-3 py-1.5 rounded-lg border border-gray-200 flex items-center transition-colors shadow-xs"
                          >
                            {copiedDoc === 'kb-form-copy' ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                            {copiedDoc === 'kb-form-copy' ? 'Copied' : 'Copy Link'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedQrModal({ name: 'Kishore Bhavana Clinic', url: `${window.location.origin}/review/kishore-bhavana` })}
                            className="text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium px-3 py-1.5 rounded-lg border border-sky-200 flex items-center transition-colors shadow-xs"
                          >
                            <QrCode className="w-3.5 h-3.5 mr-1" /> QR Code
                          </button>
                          <a
                            href="/review/kishore-bhavana"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs bg-sky-600 hover:bg-sky-700 text-white font-medium px-3 py-1.5 rounded-lg flex items-center transition-colors shadow-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1" /> Preview Form
                          </a>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        Patients open this single link or scan the QR code to select their consulting doctor and submit their review.
                      </p>
                    </div>

                    {/* Doctor 1: Dr. Kishore */}
                    <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
                            DK
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">Dr. Kishore</h4>
                            <p className="text-xs text-sky-700 font-medium">Orthopedician</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a 
                            href="/review/kishore" 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs bg-sky-600 hover:bg-sky-700 text-white font-medium px-3 py-1.5 rounded-lg flex items-center shadow-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1" /> Admin Preview
                          </a>
                        </div>
                      </div>

                      {/* Questions & Services preview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-xs border-t border-sky-100">
                        <div className="bg-white p-3 rounded-xl border border-sky-100">
                          <p className="font-semibold text-gray-700 mb-1.5">Doctor-Specific Questions:</p>
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>How satisfied are you with Dr. Kishore's consultation &amp; treatment plan?</li>
                            <li>Did Dr. Kishore listen attentively to your symptoms and concerns?</li>
                            <li>Was the clinic clean, well-maintained and hygienic during your visit?</li>
                            <li>Did the staff assist you smoothly with your appointment and inquiries?</li>
                          </ul>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-sky-100">
                          <p className="font-semibold text-gray-700 mb-1.5">Doctor-Specific Services:</p>
                          <div className="flex flex-wrap gap-1">
                            {["Joint & Knee Pain", "Fracture Care", "Spine & Back Care", "Arthritis Treatment", "Sports Injury", "Bone Density Check", "General Orthopedic Consultation"].map((s, idx) => (
                              <span key={idx} className="bg-sky-50 text-sky-800 px-2 py-0.5 rounded text-[11px] border border-sky-200">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Doctor 2: Dr. Bhavana */}
                    <div className="bg-pink-50/70 border border-pink-200 rounded-2xl p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold text-sm">
                            DB
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">Dr. Bhavana</h4>
                            <p className="text-xs text-pink-700 font-medium">Pediatrician</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a 
                            href="/review/bhavana" 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs bg-pink-600 hover:bg-pink-700 text-white font-medium px-3 py-1.5 rounded-lg flex items-center shadow-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1" /> Admin Preview
                          </a>
                        </div>
                      </div>

                      {/* Questions & Services preview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-xs border-t border-pink-100">
                        <div className="bg-white p-3 rounded-xl border border-pink-100">
                          <p className="font-semibold text-gray-700 mb-1.5">Doctor-Specific Questions:</p>
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>Did Dr. Bhavana make your child feel comfortable and well-cared for during the visit?</li>
                            <li>Did the doctor explain your child's diagnosis and treatment clearly?</li>
                            <li>Was the clinic environment child-friendly, clean and hygienic?</li>
                            <li>Were the reception and nursing staff gentle, polite and helpful?</li>
                          </ul>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-pink-100">
                          <p className="font-semibold text-gray-700 mb-1.5">Doctor-Specific Services:</p>
                          <div className="flex flex-wrap gap-1">
                            {["Child Vaccination", "Newborn & Infant Care", "Growth & Nutrition", "Fever & Infection Care", "Asthma & Allergy Care", "Child Health Checkup", "General Pediatric Consultation"].map((s, idx) => (
                              <span key={idx} className="bg-pink-50 text-pink-800 px-2 py-0.5 rounded text-[11px] border border-pink-200">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit / Action Button */}
                {formData.category === 'Kishore Bhavana Clinic' ? (
                  <div className="pt-2">
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('clinics')} 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
                    >
                      <Check className="w-5 h-5 mr-1" />
                      <span>Existing Clinic Active (No Duplicate Created) • View in Clinics</span>
                    </button>
                  </div>
                ) : (
                  <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-md hover:bg-primary/90 transition-colors">
                    {loading ? 'Creating...' : 'Create Clinic'}
                  </button>
                )}
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

      {/* QR Code Modal */}
      {selectedQrModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 relative">
            <button 
              type="button" 
              onClick={() => setSelectedQrModal(null)} 
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{selectedQrModal.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Scan with phone camera to open review form</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedQrModal.url)}`} 
                alt="QR Code" 
                className="w-48 h-48 rounded-xl shadow-xs" 
              />
            </div>
            <div className="bg-gray-100 p-2.5 rounded-xl text-xs font-mono text-gray-700 truncate">
              {selectedQrModal.url}
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(selectedQrModal.url);
                  alert("Link copied to clipboard!");
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center transition-colors"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Link
              </button>
              <button
                type="button"
                onClick={() => setSelectedQrModal(null)}
                className="flex-1 bg-primary text-white font-semibold py-2.5 rounded-xl text-xs hover:bg-primary/90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
