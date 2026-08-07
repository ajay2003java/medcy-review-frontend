import React, { useState } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';

interface Props {
  clinicId: string;
  questions: string[];
  onComplete: (result: any) => void;
}

const EMOJI_RATINGS = [
  { label: 'Poor', emoji: '😠', value: 1, activeClass: 'bg-red-100 text-red-600 border-red-500 shadow-md ring-2 ring-red-200' },
  { label: 'Fair', emoji: '😟', value: 2, activeClass: 'bg-orange-100 text-orange-600 border-orange-500 shadow-md ring-2 ring-orange-200' },
  { label: 'Average', emoji: '😐', value: 3, activeClass: 'bg-yellow-100 text-yellow-600 border-yellow-500 shadow-md ring-2 ring-yellow-200' },
  { label: 'Happy', emoji: '🙂', value: 4, activeClass: 'bg-lime-100 text-lime-600 border-lime-500 shadow-md ring-2 ring-lime-200' },
  { label: 'Excellent', emoji: '😁', value: 5, activeClass: 'bg-green-100 text-green-600 border-green-500 shadow-md ring-2 ring-green-200' }
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
      
      {/* Questions List (Emojis) */}
      {questions.length > 0 && (
        <div className="mb-6 space-y-5">
            {questions.map((q, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)]">
                    <p className="text-[15px] text-gray-700 font-semibold mb-5 leading-snug">{q}</p>
                    <div className="flex justify-between items-center space-x-2">
                        {EMOJI_RATINGS.map((rating) => {
                          const isSelected = answers[idx] === rating.value;
                          return (
                            <button 
                              key={rating.value} 
                              onClick={() => handleAnswer(idx, rating.value)}
                              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 flex-1 border-2 ${
                                isSelected 
                                  ? rating.activeClass + ' scale-105' 
                                  : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-50 hover:scale-105 grayscale hover:grayscale-0'
                              }`}
                            >
                                <span className="text-3xl mb-1">{rating.emoji}</span>
                                <span className={`text-[10px] font-bold ${isSelected ? '' : 'text-gray-400'}`}>{rating.label}</span>
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

