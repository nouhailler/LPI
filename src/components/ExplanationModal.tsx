import React from 'react';
import { X, Lightbulb, Terminal, BookOpen, CheckCircle } from 'lucide-react';
import { PracticeQuestion } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ExplanationModalProps {
  question: PracticeQuestion | null;
  onClose: () => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({ question, onClose }) => {
  const { t } = useLanguage();
  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#fff8f2] border border-[#d3c5ab] rounded-2xl max-w-lg w-full p-6 shadow-xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-[#785a00]">
            <Lightbulb className="w-5 h-5 fill-[#ffc20e] text-[#785a00]" />
            <h3 className="font-bold text-lg text-[#201b11]">{t.explanation.title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full text-[#817660] hover:bg-[#f2e7d6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question excerpt */}
        <div className="bg-[#f8ecdb] p-3.5 rounded-xl border border-[#d3c5ab]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#817660] block mb-1">
            {t.practice.question}
          </span>
          <p className="font-semibold text-sm text-[#201b11]">{question.question}</p>
        </div>

        {/* Correct Answer Highlight */}
        <div className="flex items-center gap-2 p-3 bg-[#28A745]/10 border border-[#28A745]/30 rounded-xl">
          <CheckCircle className="w-5 h-5 text-[#28A745] shrink-0" />
          <div>
            <span className="text-[10px] font-bold uppercase text-[#28A745] block">
              {t.practice.correctAnswer}
            </span>
            <code className="font-mono text-sm font-bold text-[#201b11]">
              {question.options[question.correctIndex]}
            </code>
          </div>
        </div>

        {/* Deep Explanation */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#495e8a] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            {t.explanation.conceptBreakdown}
          </div>
          <p className="text-sm text-[#4f4632] leading-relaxed bg-[#ffffff] p-4 rounded-xl border border-[#d3c5ab]">
            {question.explanation}
          </p>
        </div>

        {/* Terminal example if available */}
        {question.commandSnippet && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#495e8a] uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              {t.explanation.terminalCommand}
            </div>
            <div className="bg-[#1A1A1A] text-[#ffffff] p-3 rounded-xl font-mono text-xs overflow-x-auto shadow-inner flex items-center justify-between">
              <code>$ {question.commandSnippet}</code>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-2 w-full py-3 bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          {t.explanation.gotIt}
        </button>
      </div>
    </div>
  );
};
