import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Sparkles, Baby, Smile, Building2, GraduationCap } from 'lucide-react';

const categories = [
  { id: 'ivf', name: 'IVF Clinic', icon: Baby, color: '#ec4899', desc: 'Test the IVF patient flow' },
  { id: 'dermatology', name: 'Dermatology', icon: Sparkles, color: '#8b5cf6', desc: 'Test the skin care flow' },
  { id: 'gynecology', name: 'Gynecology', icon: Activity, color: '#f43f5e', desc: 'Test the women\'s health flow' },
  { id: 'dentist', name: 'Dentist', icon: Smile, color: '#0ea5e9', desc: 'Test the dental care flow' },
  { id: 'general-hospital', name: 'General Hospital', icon: Building2, color: '#10b981', desc: 'Test the hospital flow' },
  { id: 'junior-college', name: 'Junior College', icon: GraduationCap, color: '#f59e0b', desc: 'Test the student feedback flow', isInstitute: true },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
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
            )
          })}
        </div>
      </div>
    </div>
  );
}
