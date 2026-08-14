import React, { useState } from 'react';
import { Send, User, Users, Briefcase, GraduationCap, ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface Props {
  instituteId: string;
  category: string;
  services: string[];
  questions: Record<string, string[]>;
  onComplete: (result: any) => void;
}

const FaceIcon = ({ type, active }: { type: 1|2|3|4|5, active: boolean }) => {
  const configs = {
    1: { bg: '#fa7e6a', fg: '#a4301f', brows: 'M 14 16 L 20 19 M 34 16 L 28 19', mouth: 'M 16 34 Q 24 28 32 34' },
    2: { bg: '#fca663', fg: '#a55b2a', brows: 'M 15 17 L 20 19 M 33 17 L 28 19', mouth: 'M 18 32 Q 24 29 30 32' },
    3: { bg: '#f9d85b', fg: '#a2822a', brows: 'M 15 18 L 20 18 M 33 18 L 28 18', mouth: 'M 18 32 L 30 32' },
    4: { bg: '#c5d86d', fg: '#6e8027', brows: 'M 15 18 Q 17.5 15 20 17 M 33 18 Q 30.5 15 28 17', mouth: 'M 16 28 Q 24 36 32 28' },
    5: { bg: '#91d477', fg: '#407727', brows: 'M 15 18 Q 17.5 14 20 17 M 33 18 Q 30.5 14 28 17', mouth: 'M 16 28 Q 24 38 32 28 Z' }
  };
  const c = configs[type];
  
  return (
    <svg viewBox="0 0 48 48" className={`w-12 h-12 md:w-14 md:h-14 transition-all duration-300 ${active ? 'scale-110 drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]' : 'opacity-50 hover:opacity-100 hover:scale-105 grayscale-[20%]'}`}>
      <circle cx="24" cy="24" r="23" fill={c.bg} />
      <circle cx="17.5" cy="23" r="2.5" fill={c.fg} />
      <circle cx="30.5" cy="23" r="2.5" fill={c.fg} />
      <path d={c.brows} stroke={c.fg} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d={c.mouth} stroke={c.fg} strokeWidth="2.5" strokeLinecap="round" fill={type === 5 ? c.fg : "none"} />
    </svg>
  );
};

const RATING_OPTIONS = [
  { label: 'Poor', value: 1 },
  { label: 'Fair', value: 2 },
  { label: 'Average', value: 3 },
  { label: 'Happy', value: 4 },
  { label: 'Excellent', value: 5 }
];

export default function InstituteFeedbackForm({ instituteId, category, services, questions, onComplete }: Props) {
  const [step, setStep] = useState<'ROLE' | 'SUBROLE' | 'QUESTIONS' | 'SERVICES' | 'PRIVATE'>('ROLE');
  const [role, setRole] = useState<string>('');
  
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedService, setSelectedService] = useState<string>('');
  const [privateFeedback, setPrivateFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (selectedRole: string) => {
    if (selectedRole === 'Student') {
      setStep('SUBROLE');
    } else {
      setRole(selectedRole);
      setStep('QUESTIONS');
    }
  };

  const handleSubRoleSelect = (selectedSubRole: string) => {
    setRole(selectedSubRole);
    setStep('QUESTIONS');
  };

  const handleAnswer = (idx: number, value: number) => {
    setAnswers(prev => ({ ...prev, [idx]: value }));
  };

  const calculateAverageRating = () => {
    const answerValues = Object.values(answers);
    if (answerValues.length === 0) return 0;
    const sum = answerValues.reduce((a, b) => a + b, 0);
    return Math.round(sum / answerValues.length);
  };

  const currentQuestions = questions[role] || [];
  const averageRating = calculateAverageRating();
  const allAnswered = currentQuestions.length > 0 && Object.keys(answers).length === currentQuestions.length;

  const handleQuestionsNext = () => {
    if (services.length > 0 && (role.includes('Student') || role === 'Parent')) {
      setStep('SERVICES');
    } else if (averageRating <= 3) {
      setStep('PRIVATE');
    } else {
      handleSubmit();
    }
  };

  const handleServicesNext = () => {
    if (averageRating <= 3) {
      setStep('PRIVATE');
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!allAnswered) return;

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await axios.post(`${API_URL}/api/v1/institute-flow/feedback`, {
        institute_id: instituteId,
        reviewer_role: role,
        rating_score: averageRating,
        service_received: selectedService || null,
        private_feedback: privateFeedback || null
      });

      onComplete(res.data);
    } catch (err) {
      alert("Failed to submit feedback. Please try again.");
      setLoading(false);
    }
  };

  if (step === 'ROLE') {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">How are you associated with us?</h2>
        <div className="grid grid-cols-1 gap-4">
          {category !== 'School' && (
            <button onClick={() => handleRoleSelect('Student')} className="flex items-center p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-primary hover:shadow-md transition-all group">
              <div className="bg-blue-100 p-4 rounded-full text-blue-600 group-hover:bg-primary group-hover:text-white transition-colors mr-6">
                <GraduationCap className="h-8 w-8" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-800">Student</h3>
                <p className="text-gray-500 text-sm">Present or Alumni</p>
              </div>
            </button>
          )}
          
          <button onClick={() => handleRoleSelect('Parent')} className="flex items-center p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-primary hover:shadow-md transition-all group">
            <div className="bg-green-100 p-4 rounded-full text-green-600 group-hover:bg-primary group-hover:text-white transition-colors mr-6">
              <Users className="h-8 w-8" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-800">Parent</h3>
              <p className="text-gray-500 text-sm">Parent or Guardian</p>
            </div>
          </button>
          
          <button onClick={() => handleRoleSelect('Staff')} className="flex items-center p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-primary hover:shadow-md transition-all group">
            <div className="bg-purple-100 p-4 rounded-full text-purple-600 group-hover:bg-primary group-hover:text-white transition-colors mr-6">
              <Briefcase className="h-8 w-8" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-800">Staff</h3>
              <p className="text-gray-500 text-sm">Teaching or Non-teaching</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (step === 'SUBROLE') {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in slide-in-from-right-4 duration-300">
        <button onClick={() => setStep('ROLE')} className="flex items-center text-gray-500 hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Are you a...</h2>
        <div className="grid grid-cols-1 gap-4">
          <button onClick={() => handleSubRoleSelect('Present Student')} className="flex items-center p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-primary hover:shadow-md transition-all group">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600 group-hover:bg-primary group-hover:text-white transition-colors mr-6">
              <User className="h-8 w-8" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-800">Present Student</h3>
              <p className="text-gray-500 text-sm">Currently studying here</p>
            </div>
          </button>
          
          <button onClick={() => handleSubRoleSelect('Ex-Student / Alumni')} className="flex items-center p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-primary hover:shadow-md transition-all group">
            <div className="bg-orange-100 p-4 rounded-full text-orange-600 group-hover:bg-primary group-hover:text-white transition-colors mr-6">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-800">Ex-Student / Alumni</h3>
              <p className="text-gray-500 text-sm">Graduated or left</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (step === 'QUESTIONS') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <button onClick={() => setStep('ROLE')} className="flex items-center text-gray-500 hover:text-primary mb-2 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>
        
        {currentQuestions.map((q, idx) => (
          <div key={idx} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100/50">
            <p className="text-lg md:text-xl font-semibold text-gray-800 mb-8 text-center">{q}</p>
            <div className="flex justify-between items-center max-w-md mx-auto relative px-2">
              <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-gray-100 -translate-y-1/2 -z-10 rounded-full"></div>
              {RATING_OPTIONS.map((opt) => (
                <div key={opt.value} className="flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleAnswer(idx, opt.value)}
                    className="relative focus:outline-none focus:ring-4 focus:ring-primary/20 rounded-full"
                  >
                    <FaceIcon type={opt.value as 1|2|3|4|5} active={answers[idx] === opt.value} />
                  </button>
                  <span className={`text-xs md:text-sm font-medium transition-colors ${answers[idx] === opt.value ? 'text-gray-800' : 'text-gray-400'}`}>
                    {opt.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <button
          onClick={handleQuestionsNext}
          disabled={!allAnswered || loading}
          className="w-full bg-primary text-white py-4 md:py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
        >
          {loading ? 'Submitting...' : 'Next'}
          {!loading && <Send className="w-5 h-5" />}
        </button>
      </div>
    );
  }

  if (step === 'SERVICES') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <button onClick={() => setStep('QUESTIONS')} className="flex items-center text-gray-500 hover:text-primary mb-2 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {category === 'School' ? 'What are you most satisfied with?' : 'Which program are you associated with?'}
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {services.map((svc) => (
            <button
              key={svc}
              onClick={() => setSelectedService(svc)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                selectedService === svc 
                  ? 'border-primary bg-primary/5 shadow-md font-semibold text-primary' 
                  : 'border-gray-100 hover:border-primary/50 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              {svc}
            </button>
          ))}
        </div>
        <button
          onClick={handleServicesNext}
          disabled={!selectedService || loading}
          className="w-full bg-primary text-white py-4 md:py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
        >
          {loading ? 'Submitting...' : 'Submit'}
          {!loading && <Send className="w-5 h-5" />}
        </button>
      </div>
    );
  }

  // PRIVATE step
  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100/50">
        <h3 className="text-xl font-bold text-gray-800 mb-2">How can we improve?</h3>
        <p className="text-gray-500 text-sm mb-6">Your feedback is important to us and will be kept strictly confidential.</p>
        <textarea
          required
          value={privateFeedback}
          onChange={(e) => setPrivateFeedback(e.target.value)}
          placeholder="Tell us what went wrong..."
          className="w-full h-32 p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none bg-gray-50"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-4 md:py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
