import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

interface Props {
  onNext: () => void;
  clinicName: string;
}

export default function WelcomeScreen({ onNext, clinicName }: Props) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center w-full mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-primary opacity-5 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-primary opacity-5 rounded-full blur-xl"></div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">How was your visit?</h2>
        <p className="text-gray-500 text-sm mb-6">
          Your feedback helps {clinicName} provide the best care possible.
        </p>
        
        <div className="flex justify-center space-x-2 mb-6">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className="text-gray-200 fill-gray-100 h-10 w-10" />
          ))}
        </div>
      </div>
      
      <button 
        onClick={onNext}
        className="w-full bg-primary hover:opacity-90 text-white font-medium py-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center transition-all active:scale-95"
      >
        <span>Give Feedback</span>
        <ArrowRight className="ml-2 h-5 w-5" />
      </button>
    </div>
  );
}
