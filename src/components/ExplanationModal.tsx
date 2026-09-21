import React from 'react';
import { X, Lightbulb, Terminal, BookOpen, CheckCircle, Sparkles } from 'lucide-react';
import { PracticeQuestion } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { MarkdownView } from './MarkdownView';

interface ExplanationModalProps {
  question: PracticeQuestion | null;
  onClose: () => void;
  onExplainDifferently?: (topic: string, context?: string) => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  question,
  onClose,
  onExplainDifferently,
}) => {
  const { t, isFrench } = useLanguage();
  if (!question) return null;

  const extractConcept = () => {
    if (question.commandSnippet) {
      return question.commandSnippet.split(' ')[0];
    }
    const match = question.question.match(/\b(umask|chmod|chown|systemctl|systemd|find|grep|tar|kill|ln|fdisk|mount|crontab|sed|awk)\b/i);
    if (match) return match[1];
    return question.question.slice(0, 40);
  };

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
          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#d3c5ab]">
            <MarkdownView content={question.explanation} />
          </div>
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

        {/* Explain Differently Button */}
        {onExplainDifferently && (
          <button
            id="modal-explain-differently-btn"
            onClick={() => {
              onExplainDifferently(extractConcept(), question.question);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#fff8f2] hover:bg-[#f2e7d6] text-[#785a00] border border-[#d3c5ab] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#ffc20e] fill-[#ffc20e]" />
            <span>
              {isFrench
                ? '💡 Explique-moi autrement (5 angles pédagogiques)'
                : '💡 Explain it differently (5 angles)'}
            </span>
          </button>
        )}

        <button
          onClick={onClose}
          className="mt-1 w-full py-3 bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          {t.explanation.gotIt}
        </button>
      </div>
    </div>
  );
};
