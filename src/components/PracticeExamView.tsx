import React, { useState } from 'react';
import { Lightbulb, ArrowRight, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import { PracticeQuestion } from '../types';

interface PracticeExamViewProps {
  questions: PracticeQuestion[];
  onCompleteSession: (correctCount: number, total: number) => void;
  onExit: () => void;
  onOpenExplanation: (question: PracticeQuestion) => void;
}

export const PracticeExamView: React.FC<PracticeExamViewProps> = ({
  questions,
  onCompleteSession,
  onExit,
  onOpenExplanation,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex] || questions[0];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setShowFeedback(false);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    // Save answer
    const newAnswers = { ...userAnswers, [currentQuestion.id]: selectedOption };
    setUserAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      const nextQId = questions[currentIndex + 1].id;
      setSelectedOption(newAnswers[nextQId] !== undefined ? newAnswers[nextQId] : null);
      setShowFeedback(false);
    } else {
      // Finished
      setIsFinished(true);
      let correct = 0;
      questions.forEach((q) => {
        if (newAnswers[q.id] === q.correctIndex) {
          correct++;
        }
      });
      onCompleteSession(correct, questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setUserAnswers({});
    setIsFinished(false);
  };

  if (isFinished) {
    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    const scorePct = Math.round((correctCount / questions.length) * 100);
    const passed = scorePct >= 70;

    return (
      <div className="max-w-2xl mx-auto w-full py-6 flex flex-col gap-6">
        <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-6 md:p-8 text-center shadow-xs flex flex-col items-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              passed ? 'bg-[#28A745]/15 text-[#28A745]' : 'bg-[#ffc20e]/20 text-[#785a00]'
            }`}
          >
            <Award className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-[#817660]">
            Practice Session Results
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#201b11] mt-1 mb-2">
            {passed ? 'Great Job, Administrator!' : 'Keep Practicing!'}
          </h2>
          <p className="text-sm text-[#4f4632] max-w-md mb-6">
            {passed
              ? 'You have demonstrated strong proficiency in LPI Exam 101 core competencies.'
              : 'Review the explanations below to master the Linux system architecture topics.'}
          </p>

          {/* Score Badge */}
          <div className="flex gap-6 justify-center mb-6">
            <div className="bg-[#fef2e1] border border-[#d3c5ab] rounded-xl px-6 py-3">
              <span className="text-xs text-[#817660] font-bold block">SCORE</span>
              <span className="text-3xl font-bold text-[#201b11]">{scorePct}%</span>
            </div>
            <div className="bg-[#fef2e1] border border-[#d3c5ab] rounded-xl px-6 py-3">
              <span className="text-xs text-[#817660] font-bold block">CORRECT</span>
              <span className="text-3xl font-bold text-[#28A745]">
                {correctCount} / {questions.length}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 px-4 rounded-lg bg-[#f8ecdb] hover:bg-[#f2e7d6] text-[#201b11] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-[#d3c5ab]"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Exam
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3 px-4 rounded-lg bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Review Question Breakdown */}
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-lg text-[#201b11]">Question Review</h3>
          {questions.map((q, i) => {
            const isCorrect = userAnswers[q.id] === q.correctIndex;
            return (
              <div
                key={q.id}
                className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 flex flex-col gap-2 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-[#28A745] shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#ba1a1a] shrink-0" />
                    )}
                    <span className="font-bold text-sm text-[#201b11]">
                      Q{i + 1}. {q.question}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      isCorrect
                        ? 'bg-[#28A745]/15 text-[#28A745]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <div className="text-xs text-[#4f4632] bg-[#fff8f2] p-3 rounded-lg border border-[#d3c5ab]/60">
                  <span className="font-semibold block mb-0.5 text-[#201b11]">Correct Answer:</span>
                  <code className="font-mono text-[#785a00] font-bold">
                    {q.options[q.correctIndex]}
                  </code>
                  <p className="mt-1 text-[#4f4632]">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 pb-20">
      {/* Progress Indicator matching Image 5 */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-xs md:text-sm font-semibold text-[#4f4632]">
            {currentQuestion.category}
          </span>
          <span className="text-xs md:text-sm font-bold text-[#785a00]">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full h-2 bg-[#ece1d0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ffc20e] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card matching Image 5 */}
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-5 md:p-6 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="font-sans text-xl md:text-2xl font-bold text-[#201b11] leading-snug">
            {currentQuestion.question}
          </h2>
          {currentQuestion.scenario && (
            <p className="text-sm md:text-base text-[#4f4632] leading-relaxed">
              {currentQuestion.scenario}
            </p>
          )}
        </div>

        {/* Options (Radio Group) */}
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;

            return (
              <label
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`relative flex items-center p-3.5 md:p-4 cursor-pointer border rounded-lg transition-all duration-150 group ${
                  isSelected
                    ? 'border-[#785a00] bg-[#f8ecdb]/60 shadow-xs ring-1 ring-[#785a00]'
                    : 'border-[#d3c5ab] hover:bg-[#fef2e1] bg-[#ffffff]'
                }`}
              >
                <input
                  type="radio"
                  name="quiz_option"
                  checked={isSelected}
                  onChange={() => handleSelectOption(idx)}
                  className="sr-only"
                />

                {/* Custom radio circle */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3.5 shrink-0 transition-colors ${
                    isSelected
                      ? 'border-[#785a00] bg-[#785a00]'
                      : 'border-[#817660] group-hover:border-[#785a00]'
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full bg-[#ffffff] transition-transform ${
                      isSelected ? 'scale-100' : 'scale-0'
                    }`}
                  />
                </div>

                {/* Monospace option pill */}
                <span className="font-mono text-xs md:text-sm text-[#201b11] bg-[#f8ecdb] px-2.5 py-1 rounded border border-[#d3c5ab]/60">
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Action Buttons matching Image 5 */}
      <div className="flex justify-between items-center mt-2 gap-4">
        <button
          onClick={() => onOpenExplanation(currentQuestion)}
          className="flex items-center gap-2 px-4 py-2.5 border border-[#495e8a] text-[#495e8a] rounded-lg font-bold text-xs md:text-sm hover:bg-[#495e8a] hover:text-[#ffffff] transition-colors cursor-pointer"
        >
          <Lightbulb className="w-4 h-4" />
          Explain
        </button>

        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider transition-all shadow-xs ${
            selectedOption !== null
              ? 'bg-[#ffc20e] text-[#6d5100] hover:bg-[#f9bd00] cursor-pointer active:scale-95'
              : 'bg-[#d3c5ab]/50 text-[#817660] cursor-not-allowed'
          }`}
        >
          {currentIndex === questions.length - 1 ? 'Finish Exam' : 'Next Question'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
