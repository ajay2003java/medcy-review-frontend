import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Sparkles, Baby, Smile, Building2, GraduationCap, FlaskConical, Stethoscope, X, UserCheck } from 'lucide-react';

const categories = [
  { id: 'ivf', name: 'IVF Clinic', icon: Baby, color: '#ec4899', desc: 'Test the IVF patient flow' },
  { id: 'dermatology', name: 'Dermatology', icon: Sparkles, color: '#8b5cf6', desc: 'Test the skin care flow' },
  { id: 'gynecology', name: 'Gynecology', icon: Activity, color: '#f43f5e', desc: 'Test the women\'s health flow' },
  { id: 'dentist', name: 'Dentist', icon: Smile, color: '#0ea5e9', desc: 'Test the dental care flow' },
  { id: 'general-hospital', name: 'General Hospital', icon: Building2, color: '#10b981', desc: 'Test the hospital flow' },
  { id: 'laboratory', name: 'Laboratory', icon: FlaskConical, color: '#10b981', desc: 'Test the laboratory feedback flow' },
  { id: 'kishore-bhavana', name: 'Kishore Bhavana Clinic', icon: Stethoscope, color: '#0284c7', desc: 'Dr. Kishore (Ortho) & Dr. Bhavana (Pedia)', isMultiDoctor: true },
  { id: 'junior-college', name: 'Junior College', icon: GraduationCap, color: '#f59e0b', desc: 'Test the student feedback flow', isInstitute: true },
];

export default function DemoPage() {
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Medcy Review Engine</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to the internal testing dashboard. Below are the core categories we support. 
            Click any card to preview exactly what a user will experience when they scan a QR code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;

            if (cat.isMultiDoctor) {
              return (
                <div 
                  key={cat.id} 
                  onClick={() => setDoctorModalOpen(true)}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center hover:-translate-y-1 cursor-pointer"
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
                    style={{ backgroundColor: cat.color }}
                  />
                  
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{cat.name}</h3>
                  <p className="text-gray-500 text-sm">{cat.desc}</p>
                  
                  <div className="mt-6 w-full py-3 rounded-xl text-sm font-semibold transition-colors duration-300 group-hover:text-white"
                       style={{ backgroundColor: '#f3f4f6' }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.backgroundColor = cat.color;
                         e.currentTarget.style.color = '#fff';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.backgroundColor = '#f3f4f6';
                         e.currentTarget.style.color = 'inherit';
                       }}
                  >
                    Preview Form &rarr;
                  </div>
                </div>
              );
            }

            return (
              <Link 
                key={cat.id} 
                to={cat.isInstitute ? `/institute/demo-${cat.id}` : `/review/demo-${cat.id}`}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center hover:-translate-y-1"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  style={{ backgroundColor: cat.color }}
                />
                
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                >
                  <Icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">{cat.name}</h3>
                <p className="text-gray-500 text-sm">{cat.desc}</p>
                
                <div className="mt-6 w-full py-3 rounded-xl text-sm font-semibold transition-colors duration-300 group-hover:text-white"
                     style={{ backgroundColor: '#f3f4f6' }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.backgroundColor = cat.color;
                       e.currentTarget.style.color = '#fff';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.backgroundColor = '#f3f4f6';
                       e.currentTarget.style.color = 'inherit';
                     }}
                >
                  Preview Form &rarr;
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Doctor Selection Preview Modal */}
      {doctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setDoctorModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">Kishore Bhavana Clinic</h2>
                <p className="text-xs text-gray-500">Select doctor form to preview</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 my-4">
              Both doctors share the same clinic ID and Google Business Profile review URL, with separate patient URLs and feedback storage.
            </p>

            <div className="space-y-3 mt-4">
              {/* Doctor 1: Dr. Kishore */}
              <Link
                to="/institute/kishore"
                onClick={() => setDoctorModalOpen(false)}
                className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-sky-50 rounded-2xl border border-gray-200 hover:border-sky-300 transition-all duration-200"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-base font-bold text-gray-800 group-hover:text-sky-700 transition-colors">
                      Dr. Kishore
                    </h4>
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 bg-sky-100 text-sky-700 rounded-md">
                      Orthopedician
                    </span>
                    <p className="text-[11px] text-gray-400 mt-0.5">/institute/kishore</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-sky-600 group-hover:translate-x-1 transition-transform">
                  Preview &rarr;
                </span>
              </Link>

              {/* Doctor 2: Dr. Bhavana */}
              <Link
                to="/institute/bhavana"
                onClick={() => setDoctorModalOpen(false)}
                className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-rose-50 rounded-2xl border border-gray-200 hover:border-rose-300 transition-all duration-200"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
                    <Baby className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-base font-bold text-gray-800 group-hover:text-rose-700 transition-colors">
                      Dr. Bhavana
                    </h4>
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-md">
                      Pediatrician
                    </span>
                    <p className="text-[11px] text-gray-400 mt-0.5">/institute/bhavana</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-rose-600 group-hover:translate-x-1 transition-transform">
                  Preview &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
