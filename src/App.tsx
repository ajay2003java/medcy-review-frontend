import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import WelcomeScreen from './pages/WelcomeScreen';
import FeedbackForm from './pages/FeedbackForm';
import InstituteFeedbackForm from './pages/InstituteFeedbackForm';
import LaboratoryFeedbackForm from './pages/LaboratoryFeedbackForm';
import ResultScreen from './pages/ResultScreen';
import DemoPage from './pages/DemoPage';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Stethoscope, UserCheck, Baby } from 'lucide-react';

// A simple global state for the clinic flow context
export interface ClinicContextData {
  id: string;
  name: string;
  logo_url: string | null;
  theme_color: string;
  category: string;
  questions: string[];
  services: string[];
  doctor_name?: string | null;
  specialty?: string | null;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/" element={<DemoPage />} />
        <Route path="/review/:qr_identifier" element={<ClinicFlowWrapper />} />
        <Route path="/institute/:qr_identifier" element={<InstituteFlowWrapper />} />
      </Routes>
    </Router>
  );
}

function ClinicFlowWrapper() {
  const { qr_identifier } = useParams();
  const [clinicData, setClinicData] = useState<ClinicContextData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<'kishore' | 'bhavana' | null>(null);

  // Flow State
  const [step, setStep] = useState<'feedback' | 'result'>('feedback');
  const [feedbackResult, setFeedbackResult] = useState<any>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
    // If it's Dr. Kishore or Dr. Bhavana (or generic reception QR with doctor chosen)
    if (qr_identifier === 'kishore' || qr_identifier === 'bhavana' || (qr_identifier === 'kishore-bhavana' && selectedDoctor)) {
      const activeDoc = selectedDoctor || qr_identifier;
      const isKishore = activeDoc === 'kishore';
      const doctorData: ClinicContextData = {
        id: 'b0101010-b010-b010-b010-b01010101010',
        name: 'Kishore Bhavana Clinic',
        doctor_name: isKishore ? 'Dr. Kishore' : 'Dr. Bhavana',
        specialty: isKishore ? 'Orthopedician' : 'Pediatrician',
        category: isKishore ? 'Orthopedics' : 'Pediatrics',
        theme_color: '#0284c7',
        logo_url: null,
        questions: isKishore ? [
          "Were you satisfied with Dr. Kishore's orthopedic consultation and treatment plan?",
          "Did the doctor explain your diagnosis and recovery clearly?",
          "Was the clinic environment clean, hygienic and well-maintained?",
          "Did the doctor listen attentively to your pain concerns and perform a thorough examination?"
        ] : [
          "Did Dr. Bhavana make your child feel comfortable and well-cared for during the visit?",
          "Did the doctor explain your child's diagnosis and treatment clearly?",
          "Was the clinic environment child-friendly, clean and hygienic?",
          "Were the reception and nursing staff gentle, polite and helpful?"
        ],
        services: isKishore ? [
          "Joint & Knee Pain", "Fracture Care", "Spine & Back Care",
          "Arthritis Treatment", "Sports Injury", "Bone Density Check",
          "General Orthopedic Consultation"
        ] : [
          "Child Vaccination", "Newborn & Infant Care", "Growth & Nutrition",
          "Fever & Infection Care", "Asthma & Allergy Care", "Child Health Checkup",
          "General Pediatric Consultation"
        ]
      };
      setClinicData(doctorData);
      document.documentElement.style.setProperty('--primary-color', doctorData.theme_color);
      setLoading(false);
      return;
    }

    if (qr_identifier === 'kishore-bhavana' && !selectedDoctor) {
      document.documentElement.style.setProperty('--primary-color', '#0284c7');
      setLoading(false);
      return;
    }

    // If it's a demo route, we mock the backend response instantly!
    if (qr_identifier?.startsWith('demo-')) {
      const categoryStr = qr_identifier.replace('demo-', '');
      const categoryMap: Record<string, string> = {
        'ivf': 'IVF',
        'dermatology': 'Dermatology',
        'gynecology': 'Gynecology',
        'dentist': 'Dentist',
        'general-hospital': 'General Hospital',
        'laboratory': 'Laboratory'
      };
      const demoCategory = categoryMap[categoryStr] || 'General Hospital';

      const demoQuestions: Record<string, string[]> = {
        'IVF': ['Did you feel fully supported by our fertility specialists during your visit?', 'Were our staff empathetic and clear about your treatment options?', 'Did you feel comfortable asking questions during your consultation?', 'Was the facility clean, private, and comfortable for you?'],
        'Dermatology': ['Were you satisfied with your consultation and skin treatment plan?', 'Did the doctor explain the procedures and expected outcomes clearly?', 'Was the clinic environment welcoming and hygienic?', 'Was it easy to schedule and check-in for your appointment?'],
        'Gynecology': ['Did you feel that your privacy and comfort were respected during your visit?', 'Did the doctor address all your concerns regarding women\'s health?', 'Was the nursing staff supportive and gentle?', 'Would you recommend our facility to your friends and family?'],
        'Dentist': ['Did the dentist make sure you were comfortable during the procedure?', 'Was the clinic environment clean and welcoming?', 'Did the dentist explain the treatment plan clearly?', 'Were our front-desk staff polite and helpful?'],
        'General Hospital': ['Were you seen by a doctor within a reasonable waiting time?', 'Did you feel well taken care of by the nursing and medical staff?', 'Was the admission and discharge process smooth?', 'Did you find the hospital rooms and facilities completely clean?'],
        'Laboratory': [
          "Did you receive your laboratory test reports within the promised time?",
          "Was the laboratory clean, hygienic and well-maintained?",
          "Were the reception and support staff friendly and helpful throughout your visit?",
          "Did the laboratory staff make you feel comfortable and relaxed during blood collection and other tests?"
        ]
      };

      const demoServices: Record<string, string[]> = {
        'IVF': [
          "IUI",
          "IVF",
          "ICSI",
          "IMSI",
          "TESA/TESE",
          "Oocyte Freezing",
          "Semen Banking",
          "Assisted Hatching",
          "Preimplantation Genetic Screening",
          "Vitrification",
          "Embryo Donation",
          "Oocyte Donation"
        ],
        'Dermatology': ["Acne Treatment", "Laser Hair Removal", "Skin Consultation", "Botox / Fillers", "Scar Removal"],
        'Gynecology': ["Pregnancy Checkup", "PCOS Treatment", "Ultrasound", "Menstrual Issues", "General Checkup"],
        'Dentist': ["Teeth Cleaning", "Root Canal", "Tooth Extraction", "Braces / Invisalign", "Teeth Whitening"],
        'General Hospital': ["General Consultation", "Blood Test", "Emergency Care", "Surgery", "Vaccination"],
        'Laboratory': [
          "Blood Tests",
          "Urine Tests",
          "Diabetes Tests",
          "Full Body Checkup",
          "Health Packages",
          "ECG Test",
          "X-Ray",
          "Ultrasound Scan",
          "Sample Collection at Home",
          "Hormone Tests",
          "Vitamin Tests",
          "Microbiology Tests",
          "Liver Function Test",
          "Lipid Profile",
          "Thyroid Test",
          "Kidney Function Test",
          "Pathology Tests",
          "Other"
        ]
      };

      const colors: Record<string, string> = {
        'ivf': '#ec4899', 'dermatology': '#8b5cf6', 'gynecology': '#f43f5e', 'dentist': '#0ea5e9', 'general-hospital': '#10b981', 'laboratory': '#10b981'
      };

      const mockData: ClinicContextData = {
        id: `demo-${categoryStr}`,
        name: demoCategory === 'Laboratory' ? 'Demo Diagnostic Laboratory' : `Demo ${demoCategory} Clinic`,
        logo_url: null,
        theme_color: colors[categoryStr] || '#10b981',
        category: demoCategory,
        questions: demoQuestions[demoCategory] || demoQuestions['General Hospital'],
        services: demoServices[demoCategory] || demoServices['General Hospital']
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
        const data = res.data;
        // Fallback mapping just in case the backend hasn't updated yet!
        if (!data.services || data.services.length === 0) {
          const fallbackServices: Record<string, string[]> = {
            'IVF': [
              "IUI",
              "IVF",
              "ICSI",
              "IMSI",
              "TESA/TESE",
              "Oocyte Freezing",
              "Semen Banking",
              "Assisted Hatching",
              "Preimplantation Genetic Screening",
              "Vitrification",
              "Embryo Donation",
              "Oocyte Donation"
            ],
            'Dermatology': ["Acne Treatment", "Laser Hair Removal", "Skin Consultation", "Botox / Fillers", "Scar Removal"],
            'Gynecology': ["Pregnancy Checkup", "PCOS Treatment", "Ultrasound", "Menstrual Issues", "General Checkup"],
            'Dentist': ["Teeth Cleaning", "Root Canal", "Tooth Extraction", "Braces / Invisalign", "Teeth Whitening"],
            'General Hospital': ["General Consultation", "Blood Test", "Emergency Care", "Surgery", "Vaccination"],
            'Laboratory': [
              "Blood Tests",
              "Urine Tests",
              "Diabetes Tests",
              "Full Body Checkup",
              "Health Packages",
              "ECG Test",
              "X-Ray",
              "Ultrasound Scan",
              "Sample Collection at Home",
              "Hormone Tests",
              "Vitamin Tests",
              "Microbiology Tests",
              "Liver Function Test",
              "Lipid Profile",
              "Thyroid Test",
              "Kidney Function Test",
              "Pathology Tests",
              "Other"
            ]
          };

          // Match the enum value string (e.g., "IVF" or "General Hospital")
          let matchedCategory = data.category;
          data.services = fallbackServices[matchedCategory] || fallbackServices['General Hospital'];
        }

        setClinicData(data);
        // Apply theme color
        document.documentElement.style.setProperty('--primary-color', data.theme_color);
      })
      .catch(err => {
        setError('Clinic not found or deactivated.');
      })
      .finally(() => setLoading(false));
  }, [qr_identifier, selectedDoctor]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;

  if (qr_identifier === 'kishore-bhavana' && !selectedDoctor) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans max-w-md mx-auto shadow-xl relative overflow-hidden flex flex-col justify-center p-6">
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Kishore Bhavana Clinic</h2>
              <p className="text-xs text-gray-500">Select doctor form to continue</p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {/* Doctor 1: Dr. Kishore */}
            <button
              type="button"
              onClick={() => setSelectedDoctor('kishore')}
              className="w-full group flex items-center justify-between p-4 bg-gray-50 hover:bg-sky-50 rounded-2xl border border-gray-200 hover:border-sky-300 transition-all duration-200 text-left"
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
                </div>
              </div>
              <span className="text-sm font-semibold text-sky-600 group-hover:translate-x-1 transition-transform">
                Select &rarr;
              </span>
            </button>

            {/* Doctor 2: Dr. Bhavana */}
            <button
              type="button"
              onClick={() => setSelectedDoctor('bhavana')}
              className="w-full group flex items-center justify-between p-4 bg-gray-50 hover:bg-rose-50 rounded-2xl border border-gray-200 hover:border-rose-300 transition-all duration-200 text-left"
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
                </div>
              </div>
              <span className="text-sm font-semibold text-rose-600 group-hover:translate-x-1 transition-transform">
                Select &rarr;
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!clinicData) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans max-w-md mx-auto shadow-xl relative overflow-hidden flex flex-col">
      {/* Brand Header */}
      {clinicData.logo_url && !imageError ? (
        <div className="w-full bg-white shadow-sm z-10 border-b border-gray-100/60 overflow-hidden rounded-b-3xl">
          <img
            src={clinicData.logo_url}
            alt={clinicData.name}
            className="w-full h-auto max-h-48 object-contain p-4"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="bg-primary text-white p-6 flex flex-col items-center justify-center rounded-b-3xl shadow-md z-10 transition-colors duration-300">
          <div className="h-16 w-16 rounded-full bg-white/20 mb-3 flex items-center justify-center text-2xl font-bold">
            {clinicData.name.charAt(0)}
          </div>
          <h1 className="text-xl font-bold text-center tracking-tight">{clinicData.name}</h1>
          {clinicData.doctor_name && (
            <div className="text-center mt-1">
              <p className="text-xs text-white/90 font-medium">
                {clinicData.doctor_name} • {clinicData.specialty}
              </p>
              {qr_identifier === 'kishore-bhavana' && (
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(null)}
                  className="text-[11px] text-white/80 hover:text-white underline font-medium mt-1 inline-block"
                >
                  ← Select different doctor
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-6 flex flex-col relative z-0">
        {step === 'feedback' && (
          clinicData.category === 'Laboratory' ? (
            <LaboratoryFeedbackForm
              clinicId={clinicData.id}
              clinicName={clinicData.name}
              questions={clinicData.questions}
              services={clinicData.services}
              onComplete={(result) => {
                setFeedbackResult(result);
                setStep('result');
              }}
            />
          ) : (
            <FeedbackForm
              clinicId={clinicData.id}
              clinicName={clinicData.name}
              doctorName={clinicData.doctor_name || undefined}
              specialty={clinicData.specialty || undefined}
              category={clinicData.category}
              questions={clinicData.questions}
              services={clinicData.services}
              onComplete={(result) => {
                setFeedbackResult(result);
                setStep('result');
              }}
            />
          )
        )}
        {step === 'result' && (
          <ResultScreen result={feedbackResult} />
        )}
      </div>
    </div>
  );
}

function InstituteFlowWrapper() {
  const { qr_identifier } = useParams();
  const [instituteData, setInstituteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<'kishore' | 'bhavana' | null>(null);

  // Flow State
  const [step, setStep] = useState<'feedback' | 'result'>('feedback');
  const [feedbackResult, setFeedbackResult] = useState<any>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
    // If it's Dr. Kishore or Dr. Bhavana
    if (qr_identifier === 'kishore' || qr_identifier === 'bhavana' || (qr_identifier === 'kishore-bhavana' && selectedDoctor)) {
      const activeDoc = selectedDoctor || qr_identifier;
      const isKishore = activeDoc === 'kishore';
      const doctorData = {
        id: 'b0101010-b010-b010-b010-b01010101010',
        clinic_id: 'b0101010-b010-b010-b010-b01010101010',
        name: 'Kishore Bhavana Clinic',
        doctor_name: isKishore ? 'Dr. Kishore' : 'Dr. Bhavana',
        specialty: isKishore ? 'Orthopedician' : 'Pediatrician',
        category: isKishore ? 'Orthopedics' : 'Pediatrics',
        theme_color: '#0284c7',
        logo_url: null,
        google_review_url: 'https://search.google.com/local/writereview?placeid=ChIJ_kishore_bhavana_clinic',
        isDoctorClinic: true,
        questions: isKishore ? [
          "Were you satisfied with Dr. Kishore's orthopedic consultation and treatment plan?",
          "Did the doctor explain your diagnosis and recovery clearly?",
          "Was the clinic environment clean, hygienic and well-maintained?",
          "Did the doctor listen attentively to your pain concerns and perform a thorough examination?"
        ] : [
          "Did Dr. Bhavana make your child feel comfortable and well-cared for during the visit?",
          "Did the doctor explain your child's diagnosis and treatment clearly?",
          "Was the clinic environment child-friendly, clean and hygienic?",
          "Were the reception and nursing staff gentle, polite and helpful?"
        ],
        services: isKishore ? [
          "Joint & Knee Pain", "Fracture Care", "Spine & Back Care",
          "Arthritis Treatment", "Sports Injury", "Bone Density Check",
          "General Orthopedic Consultation"
        ] : [
          "Child Vaccination", "Newborn & Infant Care", "Growth & Nutrition",
          "Fever & Infection Care", "Asthma & Allergy Care", "Child Health Checkup",
          "General Pediatric Consultation"
        ]
      };
      setInstituteData(doctorData);
      document.documentElement.style.setProperty('--primary-color', doctorData.theme_color);
      setLoading(false);
      return;
    }

    if (qr_identifier === 'kishore-bhavana' && !selectedDoctor) {
      document.documentElement.style.setProperty('--primary-color', '#0284c7');
      setLoading(false);
      return;
    }

    // If it's a demo route for laboratory
    if (qr_identifier === 'demo-laboratory') {
      const mockData = {
        id: 'demo-laboratory',
        name: 'Demo Diagnostic Laboratory',
        logo_url: null,
        theme_color: '#10b981',
        category: 'Laboratory',
        questions: [
          "Did you receive your laboratory test reports within the promised time?",
          "Was the laboratory clean, hygienic and well-maintained?",
          "Were the reception and support staff friendly and helpful throughout your visit?",
          "Did the laboratory staff make you feel comfortable and relaxed during blood collection and other tests?"
        ],
        services: [
          "Blood Tests",
          "Urine Tests",
          "Diabetes Tests",
          "Full Body Checkup",
          "Health Packages",
          "ECG Test",
          "X-Ray",
          "Ultrasound Scan",
          "Sample Collection at Home",
          "Hormone Tests",
          "Vitamin Tests",
          "Microbiology Tests",
          "Liver Function Test",
          "Lipid Profile",
          "Thyroid Test",
          "Kidney Function Test",
          "Pathology Tests",
          "Other"
        ]
      };
      setInstituteData(mockData);
      document.documentElement.style.setProperty('--primary-color', mockData.theme_color);
      setLoading(false);
      return;
    }

    // Fetch real institute data from backend
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    axios.get(`${API_URL}/api/v1/institute-flow/institute/${qr_identifier}`)
      .then(res => {
        const data = res.data;
        setInstituteData(data);
        document.documentElement.style.setProperty('--primary-color', data.theme_color);
      })
      .catch(err => {
        setError('Institute not found or deactivated.');
      })
      .finally(() => setLoading(false));
  }, [qr_identifier, selectedDoctor]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;

  if (qr_identifier === 'kishore-bhavana' && !selectedDoctor) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans max-w-md mx-auto shadow-xl relative overflow-hidden flex flex-col justify-center p-6">
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Kishore Bhavana Clinic</h2>
              <p className="text-xs text-gray-500">Select doctor form to continue</p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {/* Doctor 1: Dr. Kishore */}
            <button
              type="button"
              onClick={() => setSelectedDoctor('kishore')}
              className="w-full group flex items-center justify-between p-4 bg-gray-50 hover:bg-sky-50 rounded-2xl border border-gray-200 hover:border-sky-300 transition-all duration-200 text-left"
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
                </div>
              </div>
              <span className="text-sm font-semibold text-sky-600 group-hover:translate-x-1 transition-transform">
                Select &rarr;
              </span>
            </button>

            {/* Doctor 2: Dr. Bhavana */}
            <button
              type="button"
              onClick={() => setSelectedDoctor('bhavana')}
              className="w-full group flex items-center justify-between p-4 bg-gray-50 hover:bg-rose-50 rounded-2xl border border-gray-200 hover:border-rose-300 transition-all duration-200 text-left"
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
                </div>
              </div>
              <span className="text-sm font-semibold text-rose-600 group-hover:translate-x-1 transition-transform">
                Select &rarr;
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!instituteData) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans max-w-md mx-auto shadow-xl relative overflow-hidden flex flex-col">
      {/* Brand Header */}
      {instituteData.logo_url && !imageError ? (
        <div className="w-full bg-white shadow-sm z-10 border-b border-gray-100/60 overflow-hidden rounded-b-3xl">
          <img
            src={instituteData.logo_url}
            alt={instituteData.name}
            className="w-full h-auto max-h-48 object-contain p-4"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="bg-primary text-white p-6 flex flex-col items-center justify-center rounded-b-3xl shadow-md z-10 transition-colors duration-300">
          <div className="h-16 w-16 rounded-full bg-white/20 mb-3 flex items-center justify-center text-2xl font-bold">
            {instituteData.name.charAt(0)}
          </div>
          <h1 className="text-xl font-bold text-center tracking-tight">{instituteData.name}</h1>
          {instituteData.doctor_name && (
            <p className="text-xs text-white/90 font-medium mt-1">
              {instituteData.doctor_name} • {instituteData.specialty}
            </p>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-6 flex flex-col relative z-0">
        {step === 'feedback' && (
          instituteData.category === 'Laboratory' ? (
            <LaboratoryFeedbackForm
              instituteId={instituteData.id}
              clinicName={instituteData.name}
              isInstitute={true}
              questions={Array.isArray(instituteData.questions) ? instituteData.questions : undefined}
              services={instituteData.services || []}
              onComplete={(result) => {
                setFeedbackResult(result);
                setStep('result');
              }}
            />
          ) : instituteData.isDoctorClinic || instituteData.doctor_name ? (
            <FeedbackForm
              clinicId={instituteData.clinic_id || instituteData.id}
              clinicName={instituteData.name}
              doctorName={instituteData.doctor_name}
              specialty={instituteData.specialty}
              category={instituteData.category}
              questions={instituteData.questions}
              services={instituteData.services}
              isInstitute={true}
              onComplete={(result) => {
                setFeedbackResult(result);
                setStep('result');
              }}
            />
          ) : (
            <InstituteFeedbackForm
              instituteId={instituteData.id}
              category={instituteData.category}
              services={instituteData.services || []}
              questions={instituteData.questions}
              onComplete={(result) => {
                setFeedbackResult(result);
                setStep('result');
              }}
            />
          )
        )}
        {step === 'result' && (
          <ResultScreen result={feedbackResult} />
        )}
      </div>
    </div>
  );
}

