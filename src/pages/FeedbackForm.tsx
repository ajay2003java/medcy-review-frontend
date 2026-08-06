import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import axios from 'axios';

interface Props {
  clinicId: string;
  questions: string[];
  onComplete: (result: any) => void;
}

export default function FeedbackForm({ clinicId, questions, onComplete }: Props) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [privateFeedback, setPrivateFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswer = (idx: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [idx]: answer }));
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
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
        const isPositive = rating >= 4;
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
        rating_score: rating,
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
      
      {/* Star Rating */}
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/60 mb-6 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <h2 className="text-xl font-extrabold text-gray-800 mb-6 text-center tracking-tight">How was your visit?</h2>
        <div className="flex justify-center space-x-3 md:space-x-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="transition-all active:scale-75 focus:outline-none hover:-translate-y-1"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`h-11 w-11 md:h-12 md:w-12 transition-all duration-300 ${
                  (hoveredRating || rating) >= star
                    ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm'
                    : 'text-gray-200 fill-gray-100/50'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Questions List (Always shown) */}
      {questions.length > 0 && (
        <div className="mb-8 space-y-4">
            {questions.map((q, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)]">
                    <p className="text-[15px] text-gray-700 font-semibold mb-4 leading-snug">{q}</p>
                    <div className="flex space-x-3">
                        {['Yes', 'No'].map(ans => (
                            <button 
                              key={ans} 
                              onClick={() => handleAnswer(idx, ans)}
                              className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                                answers[idx] === ans 
                                  ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2 scale-[1.02]' 
                                  : 'bg-gray-50/80 border border-gray-200/60 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                              }`}
                            >
                                {ans}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* Private Feedback (Only shown if rating is 1-3) */}
      {rating > 0 && rating <= 3 && (
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
          disabled={rating === 0 || loading}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-4.5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center transition-all active:scale-[0.98] disabled:shadow-none"
        >
          {loading ? (
            <span className="animate-pulse flex items-center">
               <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
               Submitting...
            </span>
          ) : (
            <>
              <span className="text-[15px]">Submit Feedback</span>
              <Send className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
