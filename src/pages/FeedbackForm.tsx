import React, { useState } from 'react';
import { Send, Languages } from 'lucide-react';
import axios from 'axios';

interface Props {
  clinicId: string;
  questions: string[];
  services?: string[];
  onComplete: (result: any) => void;
}

const TRANSLATIONS: Record<string, Record<'en'|'te', string>> = {
  "Poor": { en: "Poor", te: "బాగాలేదు" },
  "Fair": { en: "Fair", te: "పర్వాలేదు" },
  "Average": { en: "Average", te: "సాధారణం" },
  "Happy": { en: "Happy", te: "బాగుంది" },
  "Excellent": { en: "Excellent", te: "చాలా బాగుంది" },
  "How can we improve?": { en: "How can we improve?", te: "మేము ఎలా మెరుగవ్వగలం?" },
  "Tell us what went wrong...": { en: "Tell us what went wrong...", te: "సమస్య ఏమిటో దయచేసి వివరించండి..." },
  "Submit Feedback": { en: "Submit Feedback", te: "ఫీడ్‌బ్యాక్ సమర్పించండి" },
  "Please answer all questions": { en: "Please answer all questions", te: "దయచేసి అన్ని ప్రశ్నలకు సమాధానం ఇవ్వండి" },
  "Submitting...": { en: "Submitting...", te: "సమర్పిస్తోంది..." },
  "Which service did you receive?": { en: "Which service did you receive?", te: "మీరు ఏ సేవను పొందారు?" },
  // IVF
  "Did you feel fully supported by our fertility specialists during your visit?": { en: "Did you feel fully supported by our fertility specialists during your visit?", te: "మీ సందర్శన సమయంలో మా ఫెర్టిలిటీ స్పెషలిస్ట్‌ల నుండి మీకు పూర్తి మద్దతు లభించిందా?" },
  "Were our staff empathetic and clear about your treatment options?": { en: "Were our staff empathetic and clear about your treatment options?", te: "మా సిబ్బంది మీ చికిత్స ఎంపికల గురించి స్పష్టంగా వివరించారా?" },
  "Did you feel comfortable asking questions during your consultation?": { en: "Did you feel comfortable asking questions during your consultation?", te: "సంప్రదింపుల సమయంలో ప్రశ్నలు అడగడానికి మీరు సౌకర్యంగా భావించారా?" },
  "Was the facility clean, private, and comfortable for you?": { en: "Was the facility clean, private, and comfortable for you?", te: "ఆసుపత్రి శుభ్రంగా, ప్రైవేట్‌గా మరియు మీకు సౌకర్యంగా ఉందా?" },
  // Dermatology
  "Were you satisfied with your consultation and skin treatment plan?": { en: "Were you satisfied with your consultation and skin treatment plan?", te: "మీరు సంప్రదింపులు మరియు చర్మ చికిత్స ప్రణాళికతో సంతృప్తి చెందారా?" },
  "Did the doctor explain the procedures and expected outcomes clearly?": { en: "Did the doctor explain the procedures and expected outcomes clearly?", te: "వైద్యులు విధానాలు మరియు ఆశించిన ఫలితాలను స్పష్టంగా వివరించారా?" },
  "Was the clinic environment welcoming and hygienic?": { en: "Was the clinic environment welcoming and hygienic?", te: "క్లినిక్ వాతావరణం ఆహ్వానించదగినదిగా మరియు పరిశుభ్రంగా ఉందా?" },
  "Was it easy to schedule and check-in for your appointment?": { en: "Was it easy to schedule and check-in for your appointment?", te: "మీ అపాయింట్‌మెంట్ షెడ్యూల్ చేయడం మరియు చెక్-ఇన్ చేయడం సులభంగా ఉందా?" },
  // Gynecology
  "Did you feel that your privacy and comfort were respected during your visit?": { en: "Did you feel that your privacy and comfort were respected during your visit?", te: "మీ సందర్శన సమయంలో మీ గోప్యత మరియు సౌకర్యానికి గౌరవం లభించిందని మీరు భావించారా?" },
  "Did the doctor address all your concerns regarding women's health?": { en: "Did the doctor address all your concerns regarding women's health?", te: "మహిళల ఆరోగ్యానికి సంబంధించి మీ ఆందోళనలన్నింటినీ వైద్యులు పరిష్కరించారా?" },
  "Was the nursing staff supportive and gentle?": { en: "Was the nursing staff supportive and gentle?", te: "నర్సింగ్ సిబ్బంది మద్దతుగా మరియు మృదువుగా ఉన్నారా?" },
  "Would you recommend our facility to your friends and family?": { en: "Would you recommend our facility to your friends and family?", te: "మీరు మా ఆసుపత్రిని మీ స్నేహితులు మరియు కుటుంబ సభ్యులకు సిఫార్సు చేస్తారా?" },
  // Dentist
  "Did the dentist make sure you were comfortable during the procedure?": { en: "Did the dentist make sure you were comfortable during the procedure?", te: "చికిత్స సమయంలో మీరు సౌకర్యంగా ఉండేలా దంతవైద్యులు చూసుకున్నారా?" },
  "Was the clinic environment clean and welcoming?": { en: "Was the clinic environment clean and welcoming?", te: "క్లినిక్ వాతావరణం శుభ్రంగా మరియు ఆహ్వానించదగినదిగా ఉందా?" },
  "Did the dentist explain the treatment plan clearly?": { en: "Did the dentist explain the treatment plan clearly?", te: "దంతవైద్యులు చికిత్స ప్రణాళికను స్పష్టంగా వివరించారా?" },
  "Were our front-desk staff polite and helpful?": { en: "Were our front-desk staff polite and helpful?", te: "మా ఫ్రంట్-డెస్క్ సిబ్బంది మర్యాదగా మరియు సహాయకారిగా ఉన్నారా?" },
  // General Hospital
  "Were you seen by a doctor within a reasonable waiting time?": { en: "Were you seen by a doctor within a reasonable waiting time?", te: "తక్కువ నిరీక్షణ సమయంలో మీరు వైద్యునిచే చూడబడ్డారా?" },
  "Did you feel well taken care of by the nursing and medical staff?": { en: "Did you feel well taken care of by the nursing and medical staff?", te: "నర్సింగ్ మరియు వైద్య సిబ్బంది మిమ్మల్ని బాగా చూసుకున్నారని మీరు భావించారా?" },
  "Was the admission and discharge process smooth?": { en: "Was the admission and discharge process smooth?", te: "అడ్మిషన్ మరియు డిశ్చార్జ్ ప్రక్రియ సజావుగా జరిగిందా?" },
  "Did you find the hospital rooms and facilities completely clean?": { en: "Did you find the hospital rooms and facilities completely clean?", te: "ఆసుపత్రి గదులు మరియు సౌకర్యాలు పూర్తిగా శుభ్రంగా ఉన్నాయా?" }
};

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

export default function FeedbackForm({ clinicId, questions, services = [], onComplete }: Props) {
  const [lang, setLang] = useState<'en'|'te'>('en');
  const [privateFeedback, setPrivateFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedService, setSelectedService] = useState<string>('');

  const t = (text: string) => TRANSLATIONS[text]?.[lang] || text;

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
  // Ensure we also require a service if services are provided
  const allQuestionsAnswered = Object.keys(answers).length === questions.length && questions.length > 0;
  const isServiceSelected = services.length === 0 || selectedService !== '';
  const canSubmit = allQuestionsAnswered && isServiceSelected;

  const handleSubmit = async () => {
    if (!canSubmit) return;
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
        private_feedback: privateFeedback,
        service_received: selectedService || null
      });
      onComplete(res.data);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto w-full">
      
      {/* Language Toggle */}
      <div className="flex justify-end mb-4 px-1">
        <button 
          onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
          className="flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100"
        >
          <Languages className="w-4 h-4 mr-1.5" />
          {lang === 'en' ? 'తెలుగు' : 'English'}
        </button>
      </div>

      {/* Questions List (Faces) */}
      {questions.length > 0 && (
        <div className="mb-6 space-y-5">
            {questions.map((q, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)]">
                    <p className="text-[15px] text-gray-700 font-semibold mb-5 leading-snug">{t(q)}</p>
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
                                  {t(opt.label)}
                                </span>
                            </button>
                          );
                        })}
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* Services Selection (Always shown as a regular question card) */}
      {services && services.length > 0 && (
        <div className="mb-6 bg-white p-6 rounded-3xl border border-gray-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)]">
          <p className="text-[15px] text-gray-700 font-semibold mb-5 leading-snug">
            {t("Which service did you receive?")}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {services.map((service, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedService(service)}
                className={`w-full min-h-[3.5rem] flex items-center justify-center text-center px-3 py-2 rounded-2xl text-[13px] font-semibold leading-tight transition-all border-2 ${selectedService === service ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 scale-[1.02]' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'}`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Private Feedback (Only shown if average rating is 1-3) */}
      {averageRating > 0 && averageRating <= 3 && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4">
          <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
            {t("How can we improve?")}
          </label>
          <textarea
            value={privateFeedback}
            onChange={(e) => setPrivateFeedback(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-3xl focus:ring-0 focus:border-primary p-5 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all resize-none text-gray-700 placeholder-gray-400"
            rows={4}
            placeholder={t("Tell us what went wrong...")}
          />
        </div>
      )}



      <div className="mt-auto pt-4 pb-8">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-4.5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center transition-all active:scale-[0.98] disabled:shadow-none"
        >
          {loading ? (
            <span className="animate-pulse flex items-center">
               <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
               {t("Submitting...")}
            </span>
          ) : (
            <>
              <span className="text-[15px]">{canSubmit ? t("Submit Feedback") : t("Please answer all questions")}</span>
              <Send className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

