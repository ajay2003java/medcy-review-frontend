import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import WelcomeScreen from './pages/WelcomeScreen';
import FeedbackForm from './pages/FeedbackForm';
import ResultScreen from './pages/ResultScreen';
import DemoPage from './pages/DemoPage';
import { useState, useEffect } from 'react';
import axios from 'axios';

// A simple global state for the clinic flow context
export interface ClinicContextData {
  id: string;
  name: string;
  logo_url: string;
  theme_color: string;
  category: string;
  questions: string[];
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/" element={<DemoPage />} />
        <Route path="/review/:qr_identifier" element={<ClinicFlowWrapper />} />
      </Routes>
    </Router>
  );
}

function ClinicFlowWrapper() {
  const { qr_identifier } = useParams();
  const [clinicData, setClinicData] = useState<ClinicContextData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Flow State
  const [step, setStep] = useState<'feedback' | 'result'>('feedback');
  const [feedbackResult, setFeedbackResult] = useState<any>(null);

  useEffect(() => {
    // If it's a demo route, we mock the backend response instantly!
    if (qr_identifier?.startsWith('demo-')) {
      const catStr = qr_identifier.replace('demo-', '');
      const colorMap: Record<string, string> = {
        'ivf': '#ec4899', 'dermatology': '#8b5cf6', 'gynecology': '#f43f5e', 'dentist': '#0ea5e9', 'general-hospital': '#10b981'
      };

      const questionsMap: Record<string, string[]> = {
        'ivf': ['Did you feel fully supported by our fertility specialists during your visit?', 'Were our staff empathetic and clear about your treatment options?', 'Did you feel comfortable asking questions during your consultation?', 'Was the facility clean, private, and comfortable for you?'],
        'dermatology': ['Were you satisfied with your consultation and skin treatment plan?', 'Did the doctor explain the procedures and expected outcomes clearly?', 'Was the clinic environment welcoming and hygienic?', 'Was it easy to schedule and check-in for your appointment?'],
        'gynecology': ['Did you feel that your privacy and comfort were respected during your visit?', 'Did the doctor address all your concerns regarding women\'s health?', 'Was the nursing staff supportive and gentle?', 'Would you recommend our facility to your friends and family?'],
        'dentist': ['Did the dentist make sure you were comfortable during the procedure?', 'Was the clinic environment clean and welcoming?', 'Did the dentist explain the treatment plan clearly?', 'Were our front-desk staff polite and helpful?'],
        'general-hospital': ['Were you seen by a doctor within a reasonable waiting time?', 'Did you feel well taken care of by the nursing and medical staff?', 'Was the admission and discharge process smooth?', 'Did you find the hospital rooms and facilities completely clean?']
      };
      
      const mockData: ClinicContextData = {
        id: `demo-${catStr}`,
        name: `Demo ${catStr.toUpperCase()} Clinic`,
        logo_url: '',
        theme_color: colorMap[catStr] || '#3498db',
        category: catStr,
        questions: questionsMap[catStr] || questionsMap['general-hospital']
      };
      
      setClinicData(mockData);
      document.documentElement.style.setProperty('--primary-color', mockData.theme_color);
      setLoading(false);
      return;
    }

    // Fetch real clinic data from backend
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    axios.get(`${API_URL}/api/v1/patient/clinic/${qr_identifier}`)
      .then(res => {
        setClinicData(res.data);
        // Apply theme color
        document.documentElement.style.setProperty('--primary-color', res.data.theme_color);
      })
      .catch(err => {
        setError('Clinic not found or deactivated.');
      })
      .finally(() => setLoading(false));
  }, [qr_identifier]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  if (!clinicData) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans max-w-md mx-auto shadow-xl relative overflow-hidden flex flex-col">
      {/* Brand Header */}
      <div className="bg-primary text-white p-6 flex flex-col items-center justify-center rounded-b-3xl shadow-md z-10 transition-colors duration-300">
        {clinicData.logo_url ? (
          <img src={clinicData.logo_url} alt={clinicData.name} className="h-16 w-16 rounded-full object-cover mb-3 shadow-lg bg-white p-1" />
        ) : (
          <div className="h-16 w-16 rounded-full bg-white/20 mb-3 flex items-center justify-center text-2xl font-bold">
            {clinicData.name.charAt(0)}
          </div>
        )}
        <h1 className="text-xl font-bold text-center tracking-tight">{clinicData.name}</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 flex flex-col relative z-0">
        {step === 'feedback' && (
          <FeedbackForm 
            clinicId={clinicData.id}
            questions={clinicData.questions}
            onComplete={(result) => {
              setFeedbackResult(result);
              setStep('result');
            }}
          />
        )}
        {step === 'result' && (
          <ResultScreen result={feedbackResult} />
        )}
      </div>
    </div>
  );
}
