import React, { useState } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';

interface Props {
  clinicId: string;
  questions: string[];
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

export default function FeedbackForm({ clinicId, questions, onComplete }: Props) {
  const [privateFeedback, setPrivateFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleAnswer = (idx: number, value: number) => {
    setAnswers(prev => ({ ...prev, [idx]: value }));
  };

  const calculateAverageRating = () => {
    const answerValues = Object.values(answers);
    if (answerValues.length === 0) return 0;
    const sum = answerValues.reduce((a, b) => a + b, 0);
    return Math.round(sum / answerValues.length);
  };

  const averageRating = calculateAverageRating();
  const allQuestionsAnswered = Object.keys(answers).length === questions.length && questions.length > 0;

  const handleSubmit = async () => {
    if (!allQuestionsAnswered) return;
    setLoading(true);

    // Mock response for Demo Mode so the backend doesn't need to be running!
    if (clinicId.startsWith('demo-')) {
      const catStr = clinicId.replace('demo-', '');
      const reviewDrafts: Record<string, string> = {
        'ivf': "The fertility specialists here are incredibly supportive. They guided us through every step of the IVF process with compassion and expertise. Highly recommend for any couples looking for fertility care!",
        'dermatology': "Fantastic experience! The dermatologist really took the time to understand my skin concerns and provided an acne treatment plan that worked wonders.",
        'gynecology': "The doctors made me feel completely comfortable and answered all my questions regarding my women's health concerns. Very professional care.",
        'dentist': "A pain-free and professional dental experience! The staff is very welcoming and the clinic is incredibly clean. Great teeth cleaning service.",
        'general-hospital': "Excellent care and surprisingly short wait times. The nursing staff was very attentive and professional."
      };

      setTimeout(() => {
        const isPositive = averageRating >= 4;
        onComplete({
          action_flow: isPositive ? 'POSITIVE' : 'PRIVATE',
          generated_review_draft: isPositive ? (reviewDrafts[catStr] || "Great experience!") : null,
          google_url: isPositive ? 'https://google.com' : null
        });
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await axios.post(`${API_URL}/api/v1/patient/feedback`, {
        clinic_id: clinicId,
        rating_score: averageRating,
        private_feedback: privateFeedback
      });
      onComplete(res.data);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto w-full">
      
      {/* Questions List (Faces) */}
      {questions.length > 0 && (
        <div className="mb-6 space-y-5">
            {questions.map((q, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)]">
                    <p className="text-[15px] text-gray-700 font-semibold mb-5 leading-snug">{q}</p>
                    <div className="flex justify-between items-center px-1">
                        {RATING_OPTIONS.map((opt) => {
                          const isSelected = answers[idx] === opt.value;
                          return (
                            <button 
                              key={opt.value} 
                              onClick={() => handleAnswer(idx, opt.value)}
                              className="flex flex-col items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                            >
                                <FaceIcon type={opt.value as 1|2|3|4|5} active={isSelected} />
                                <span className={`text-[11px] mt-2 font-semibold transition-colors duration-200 ${isSelected ? 'text-gray-800' : 'text-gray-400'}`}>
                                  {opt.label}
                                </span>
                            </button>
                          );
                        })}
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* Private Feedback (Only shown if average rating is 1-3) */}
      {averageRating > 0 && averageRating <= 3 && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4">
          <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
            How can we improve?
          </label>
          <textarea
            value={privateFeedback}
            onChange={(e) => setPrivateFeedback(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-3xl focus:ring-0 focus:border-primary p-5 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all resize-none text-gray-700 placeholder-gray-400"
            rows={4}
            placeholder="Tell us what went wrong..."
          />
        </div>
      )}

      <div className="mt-auto pt-4 pb-8">
        <button
          onClick={handleSubmit}
          disabled={!allQuestionsAnswered || loading}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-4.5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center transition-all active:scale-[0.98] disabled:shadow-none"
        >
          {loading ? (
            <span className="animate-pulse flex items-center">
               <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
               Submitting...
            </span>
          ) : (
            <>
              <span className="text-[15px]">{allQuestionsAnswered ? 'Submit Feedback' : 'Please answer all questions'}</span>
              <Send className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

