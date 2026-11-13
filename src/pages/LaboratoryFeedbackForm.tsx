import React, { useState } from 'react';
import { Send, Languages, ChevronDown, Check, X } from 'lucide-react';
import axios from 'axios';
import { generateDynamicReview } from '../utils/reviewGenerator';

interface Props {
  clinicId?: string;
  clinicName?: string;
  instituteId?: string;
  isInstitute?: boolean;
  questions?: string[];
  services?: string[];
  onComplete: (result: any) => void;
}

const DEFAULT_QUESTIONS = [
  "Did you receive your laboratory test reports within the promised time?",
  "Was the laboratory clean, hygienic and well-maintained?",
  "Were the reception and support staff friendly and helpful throughout your visit?",
  "Did the laboratory staff make you feel comfortable and relaxed during blood collection and other tests?"
];

// Tests displayed directly as 2-column rectangular cards on the page
const PAGE_SERVICES = [
  "Blood Tests",
  "Urine Tests",
  "Full Body Checkup",
  "Health Packages",
  "ECG Test",
  "X-Ray",
  "Ultrasound Scan",
  "Sample Collection at Home",
  "Microbiology Tests",
  "Other"
];

// Tests accessible via dropdown
const DROPDOWN_SERVICES = [
  "Diabetes Tests",
  "Vitamin Tests",
  "Hormone Tests",
  "Liver Function Test",
  "Lipid Profile",
  "Thyroid Test",
  "Kidney Function Test",
  "Pathology Tests"
];

const TRANSLATIONS: Record<string, Record<'en' | 'te', string>> = {
  // Rating Labels
  "Poor": { en: "Poor", te: "బాగాలేదు" },
  "Fair": { en: "Fair", te: "పర్వాలేదు" },
  "Average": { en: "Average", te: "సాధారణం" },
  "Happy": { en: "Happy", te: "బాగుంది" },
  "Excellent": { en: "Excellent", te: "చాలా బాగుంది" },

  // Buttons and Status
  "Submit Feedback": { en: "Submit Feedback", te: "ఫీడ్‌బ్యాక్ సమర్పించండి" },
  "Please answer all questions": { en: "Please answer all questions", te: "దయచేసి అన్ని ప్రశ్నలకు సమాధానం ఇవ్వండి" },
  "Submitting...": { en: "Submitting...", te: "సమర్పిస్తోంది..." },

  // Section Headers & Placeholders
  "Which laboratory services did you use?": {
    en: "Which laboratory services did you use?",
    te: "మీరు ఏ ప్రయోగశాల (ల్యాబ్) సేవలను ఉపయోగించారు?"
  },
  "How can we improve our laboratory services?": {
    en: "How can we improve our laboratory services?",
    te: "మా ప్రయోగశాల సేవలను మేము ఎలా మెరుగుపరచగలము?"
  },
  "Share your suggestions or tell us about your experience...": {
    en: "Share your suggestions or tell us about your experience...",
    te: "మీ సూచనలను పంచుకోండి లేదా మీ అనుభవం గురించి మాకు చెప్పండి..."
  },
  "Select Test Profiles (Diabetes, Vitamin, LFT, Lipid, Thyroid...)...": {
    en: "Select Test Profiles (Diabetes, Vitamin, LFT, Lipid, Thyroid...)...",
    te: "పరీక్షలను ఎంచుకోండి (డయాబెటిస్, విటమిన్, LFT, లిపిడ్, థైరాయిడ్...)..."
  },
  "Please specify other tests...": {
    en: "Please specify other tests...",
    te: "ఇతర పరీక్షల పేర్లను ఇక్కడ టైప్ చేయండి..."
  },

  // Active Questions
  "Were you satisfied with the advanced equipment and technology used for your tests?": {
    en: "Were you satisfied with the advanced equipment and technology used for your tests?",
    te: "మీ పరీక్షల కోసం ఉపయోగించిన ఆధునిక పరికరాలు మరియు సాంకేతికతతో మీరు సంతృప్తి చెందారా?"
  },
  "Did you receive your laboratory test reports within the promised time?": {
    en: "Did you receive your laboratory test reports within the promised time?",
    te: "వాగ్దానం చేసిన సమయానికి మీ ల్యాబ్ పరీక్ష నివేదికలను (రిపోర్టులు) అందుకున్నారా?"
  },
  "Was the laboratory clean, hygienic and well-maintained?": {
    en: "Was the laboratory clean, hygienic and well-maintained?",
    te: "ప్రయోగశాల (ల్యాబ్) పరిశుభ్రంగా, పరిశుభ్రమైన వాతావరణంతో మరియు చక్కగా నిర్వహించబడిందా?"
  },
  "Were the reception and support staff friendly and helpful throughout your visit?": {
    en: "Were the reception and support staff friendly and helpful throughout your visit?",
    te: "రిసెప్షన్ మరియు సహాయక సిబ్బంది మీ సందర్శన సమయంలో స్నేహపూర్వకంగా మరియు సహాయకారిగా ఉన్నారా?"
  },
  "Did the laboratory staff make you feel comfortable and relaxed during blood collection and other tests?": {
    en: "Did the laboratory staff make you feel comfortable and relaxed during blood collection and other tests?",
    te: "రక్త సేకరణ మరియు ఇతర పరీక్షల సమయంలో ల్యాబ్ సిబ్బంది మిమ్మల్ని సౌకర్యంగా మరియు ప్రశాంతంగా ఉంచారా?"
  },

  // Services on Page
  "Blood Tests": { en: "Blood Tests", te: "రక్త పరీక్షలు" },
  "Urine Tests": { en: "Urine Tests", te: "మూత్ర పరీక్షలు" },
  "Diabetes Tests": { en: "Diabetes Tests", te: "డయాబెటిస్ పరీక్షలు" },
  "Full Body Checkup": { en: "Full Body Checkup", te: "పూర్తి శరీర తనిఖీ (ఫుల్ బాడీ చెకప్)" },
  "Health Packages": { en: "Health Packages", te: "హెల్త్ ప్యాకేజీలు (Health Packages)" },
  "ECG Test": { en: "ECG Test", te: "ఈసీజీ పరీక్ష (ECG Test)" },
  "X-Ray": { en: "X-Ray", te: "ఎక్స్-రే (X-Ray)" },
  "Ultrasound Scan": { en: "Ultrasound Scan", te: "అల్ట్రాసౌండ్ స్కాన్ (Ultrasound Scan)" },
  "Sample Collection at Home": { en: "Sample Collection at Home", te: "హోమ్ శాంపిల్ కలెక్షన్ (ఇంటి వద్ద శాంపిల్ సేకరణ)" },
  "Hormone Tests": { en: "Hormone Tests", te: "హార్మోన్ పరీక్షలు" },
  "Vitamin Tests": { en: "Vitamin Tests", te: "విటమిన్ పరీక్షలు" },
  "Microbiology Tests": { en: "Microbiology Tests", te: "మైక్రోబయాలజీ పరీక్షలు" },
  "Other": { en: "Other", te: "ఇతర పరీక్షలు" },

  // Services in Dropdown
  "Liver Function Test": { en: "Liver Function Test", te: "లివర్ ఫంక్షన్ టెస్ట్ (LFT)" },
  "Lipid Profile": { en: "Lipid Profile", te: "లిపిడ్ ప్రొఫైల్" },
  "Thyroid Test": { en: "Thyroid Test", te: "థైరాయిడ్ టెస్ట్" },
  "Thyroid Profile": { en: "Thyroid Profile", te: "థైరాయిడ్ ప్రొఫైల్" },
  "Kidney Function Test": { en: "Kidney Function Test", te: "కిడ్నీ ఫంక్షన్ టెస్ట్ (KFT)" },
  "Pathology Tests": { en: "Pathology Tests", te: "పాథాలజీ పరీక్షలు" }
};

const FaceIcon = ({ type, active }: { type: 1 | 2 | 3 | 4 | 5; active: boolean }) => {
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

export default function LaboratoryFeedbackForm({
  clinicId,
  clinicName,
  instituteId,
  isInstitute = false,
  questions = DEFAULT_QUESTIONS,
  onComplete
}: Props) {
  const [lang, setLang] = useState<'en' | 'te'>('en');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [otherTestInput, setOtherTestInput] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);

  const t = (text: string) => TRANSLATIONS[text]?.[lang] || text;

  const handleAnswer = (idx: number, value: number) => {
    setAnswers(prev => ({ ...prev, [idx]: value }));
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const calculateAverageRating = () => {
    const answerValues = Object.values(answers);
    if (answerValues.length === 0) return 0;
    const sum = answerValues.reduce((a, b) => a + b, 0);
    return Math.round(sum / answerValues.length);
  };

  const averageRating = calculateAverageRating();
  const allQuestionsAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;
  const canSubmit = allQuestionsAnswered;

  const activeId = clinicId || instituteId || 'demo-laboratory';
  const isDemo = activeId.startsWith('demo-');

  const selectedDropdownItems = DROPDOWN_SERVICES.filter(item => selectedServices.includes(item));
  const isOtherSelected = selectedServices.includes('Other');

  // Prepare final service list including custom "Other" text
  const getPreparedServices = () => {
    return selectedServices.map(svc => {
      if (svc === 'Other' && otherTestInput.trim()) {
        return `Other: ${otherTestInput.trim()}`;
      }
      return svc;
    });
  };

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);

    const preparedServices = getPreparedServices();

    if (isDemo) {
      setTimeout(() => {
        const isPositive = averageRating >= 4;
        const joinedServices = preparedServices.length > 0 ? preparedServices.join(', ') : '';
        const targetName = clinicName || 'Demo Diagnostic Laboratory';
        const demoDraft = isPositive
          ? generateDynamicReview({
              clinicName: targetName,
              category: 'Laboratory',
              serviceReceived: joinedServices
            })
          : null;

        onComplete({
          action_flow: isPositive ? 'POSITIVE' : 'PRIVATE',
          generated_review_draft: demoDraft,
          google_url: isPositive ? 'https://google.com' : null
        });
        setLoading(false);
      }, 700);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const endpoint = isInstitute
        ? `${API_URL}/api/v1/institute-flow/feedback`
        : `${API_URL}/api/v1/patient/feedback`;

      const payload = isInstitute
        ? {
            institute_id: instituteId || activeId,
            reviewer_role: null,
            rating_score: averageRating,
            question_ratings: answers,
            selected_services: preparedServices,
            service_received: preparedServices.join(', ') || null,
            language: lang,
            private_feedback: suggestions || null,
            institute_name: clinicName || null,
            category: 'Laboratory'
          }
        : {
            clinic_id: clinicId || activeId,
            rating_score: averageRating,
            question_ratings: answers,
            selected_services: preparedServices,
            service_received: preparedServices.join(', ') || null,
            language: lang,
            private_feedback: suggestions || null,
            clinic_name: clinicName || null,
            category: 'Laboratory'
          };

      const res = await axios.post(endpoint, payload);
      onComplete(res.data);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit feedback. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto w-full">
      {/* Language Toggle */}
      <div className="flex justify-end mb-4 px-1">
        <button
          type="button"
          onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
          className="flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100"
        >
          <Languages className="w-4 h-4 mr-1.5" />
          {lang === 'en' ? 'తెలుగు' : 'English'}
        </button>
      </div>

      {/* 5 Laboratory Rating Questions */}
      <div className="mb-6 space-y-5">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-3xl border border-gray-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)]"
          >
            <p className="text-[15px] text-gray-700 font-semibold mb-5 leading-snug">
              {t(q)}
            </p>
            <div className="flex justify-between items-center px-1">
              {RATING_OPTIONS.map((opt) => {
                const isSelected = answers[idx] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleAnswer(idx, opt.value)}
                    className="flex flex-col items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                  >
                    <FaceIcon type={opt.value as 1 | 2 | 3 | 4 | 5} active={isSelected} />
                    <span
                      className={`text-[11px] mt-2 font-semibold transition-colors duration-200 ${
                        isSelected ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    >
                      {t(opt.label)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Laboratory Services Selection Card */}
      <div className="mb-6 bg-white p-6 rounded-3xl border border-gray-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)]">
        <p className="text-[15px] text-gray-700 font-semibold mb-4 leading-snug">
          {t("Which laboratory services did you use?")}
        </p>

        {/* Dropdown for Special Test Profiles (LFT, Lipid, Thyroid, KFT, Pathology) */}
        <div className="relative mb-3">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`w-full min-h-[3.5rem] flex items-center justify-between text-left px-4 py-2.5 rounded-2xl text-[13px] font-semibold transition-all border-2 ${
              selectedDropdownItems.length > 0
                ? 'border-primary bg-primary/5 text-primary shadow-sm'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2 truncate pr-2">
              <span className="truncate">
                {t("Select Test Profiles (Diabetes, Vitamin, LFT, Lipid, Thyroid...)...")}
              </span>
              {selectedDropdownItems.length > 0 && (
                <span className="bg-primary text-white text-[11px] px-2 py-0.5 rounded-full font-bold shrink-0">
                  {selectedDropdownItems.length}
                </span>
              )}
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-primary' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu Options */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 overflow-hidden divide-y divide-gray-100 animate-in fade-in zoom-in-95 duration-150">
              {DROPDOWN_SERVICES.map((test) => {
                const isSelected = selectedServices.includes(test);
                return (
                  <button
                    key={test}
                    type="button"
                    onClick={() => toggleService(test)}
                    className={`w-full p-3.5 text-left text-[13px] font-semibold flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{t(test)}</span>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Selected tags from Dropdown */}
          {selectedDropdownItems.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {selectedDropdownItems.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center text-xs font-semibold bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-xl"
                >
                  {t(item)}
                  <button
                    type="button"
                    onClick={() => toggleService(item)}
                    className="ml-1.5 hover:text-red-500 transition-colors p-0.5"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Grid of Services on the Page */}
        <div className="grid grid-cols-2 gap-2.5">
          {PAGE_SERVICES.map((service, idx) => {
            const isSelected = selectedServices.includes(service);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleService(service)}
                className={`w-full min-h-[3.5rem] flex items-center justify-center text-center px-3 py-2 rounded-2xl text-[13px] font-semibold leading-tight transition-all border-2 ${
                  isSelected
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                    : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                {t(service)}
              </button>
            );
          })}
        </div>

        {/* Input box opens when "Other" is selected */}
        {isOtherSelected && (
          <div className="mt-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <input
              type="text"
              value={otherTestInput}
              onChange={(e) => setOtherTestInput(e.target.value)}
              placeholder={t("Please specify other tests...")}
              className="w-full border-2 border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl p-3.5 bg-gray-50/50 focus:bg-white text-sm text-gray-800 placeholder-gray-400 outline-none transition-all shadow-inner"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Suggestions and Feedback */}
      <div className="mb-8 bg-white p-6 rounded-3xl border border-gray-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)]">
        <label className="block text-[15px] font-semibold text-gray-700 mb-3 leading-snug">
          {t("How can we improve our laboratory services?")}
        </label>
        <textarea
          value={suggestions}
          onChange={(e) => setSuggestions(e.target.value)}
          className="w-full border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-primary p-4 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all resize-none text-gray-700 placeholder-gray-400 text-sm"
          rows={4}
          placeholder={t("Share your suggestions or tell us about your experience...")}
        />
      </div>

      {/* Full-width Green Submit Button */}
      <div className="mt-auto pt-4 pb-8">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className="w-full bg-[#10b981] hover:bg-[#059669] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-4.5 rounded-2xl shadow-xl shadow-[#10b981]/20 flex items-center justify-center transition-all active:scale-[0.98] disabled:shadow-none"
        >
          {loading ? (
            <span className="animate-pulse flex items-center">
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
              {t("Submitting...")}
            </span>
          ) : (
            <>
              <span className="text-[15px]">
                {canSubmit ? t("Submit Feedback") : t("Please answer all questions")}
              </span>
              <Send className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
