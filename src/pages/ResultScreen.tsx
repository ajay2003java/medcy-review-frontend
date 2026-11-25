import React, { useState } from 'react';
import { CheckCircle2, Copy, ExternalLink, Heart } from 'lucide-react';

interface Props {
  result: {
    action_flow: 'POSITIVE' | 'PRIVATE';
    generated_review_draft?: string;
    google_url?: string;
  };
}

export default function ResultScreen({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyAndRedirect = async () => {
    if (result.generated_review_draft) {
      try {
        await navigator.clipboard.writeText(result.generated_review_draft);
        setCopied(true);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
    
    if (result.google_url) {
      setTimeout(() => {
        window.open(result.google_url, '_blank', 'noopener,noreferrer');
      }, 500);
    }
  };

  if (result.action_flow === 'PRIVATE') {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <Heart className="h-16 w-16 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Thank You</h2>
        <p className="text-gray-500 mb-6 max-w-xs mx-auto">
          We appreciate your honest feedback. Our management team will review this to improve our care.
        </p>

        {result.google_url && (
          <div className="w-full mt-4 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3">
              You are also welcome to share your honest review publicly on Google.
            </p>
            <button
              onClick={() => window.open(result.google_url, '_blank', 'noopener,noreferrer')}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center text-sm transition-all active:scale-[0.98]"
            >
              Post Review on Google <ExternalLink className="ml-2 h-4 w-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-6">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">We're thrilled!</h2>
        <p className="text-gray-500 text-sm">
          Could you take 30 seconds to share this on Google? We've drafted a review for you based on your rating.
        </p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6 relative">
        <p className="text-gray-700 italic mt-2 leading-relaxed">"{result.generated_review_draft}"</p>
      </div>

      <div className="mt-auto">
        <button
          onClick={handleCopyAndRedirect}
          className={`w-full font-medium py-4 rounded-xl shadow-lg flex items-center justify-center transition-all active:scale-95 ${
            copied ? 'bg-green-500 text-white' : 'bg-primary text-white hover:opacity-90'
          }`}
        >
          {copied ? (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              <span>Copied! Opening Google...</span>
            </>
          ) : (
            <>
              <Copy className="mr-2 h-5 w-5" />
              <span>Copy & Post on Google</span>
            </>
          )}
        </button>
        <button 
          onClick={() => {
             if (result.google_url) window.open(result.google_url, '_blank', 'noopener,noreferrer');
          }}
          className="w-full mt-4 text-sm font-medium text-gray-500 hover:text-gray-800 flex items-center justify-center py-2"
        >
          Skip copy and just open Google <ExternalLink className="ml-1 h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
