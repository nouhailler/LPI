import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  title,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      case 'top':
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  return (
    <span className={`relative inline-flex items-center align-middle ${className}`}>
      <button
        type="button"
        aria-label={title || 'Information'}
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible((prev) => !prev);
        }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="text-[#817660] hover:text-[#785a00] p-0.5 rounded-full transition-colors cursor-pointer focus:outline-hidden"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isVisible && (
        <div
          role="tooltip"
          onClick={(e) => e.stopPropagation()}
          className={`absolute z-50 w-64 md:w-72 p-3 bg-[#201b11] text-[#f8ecdb] text-xs leading-relaxed rounded-xl shadow-xl border border-[#785a00]/40 pointer-events-auto transition-all ${getPositionClasses()}`}
        >
          {title && (
            <span className="font-bold text-[#ffc20e] block mb-1 text-[11px] uppercase tracking-wider">
              {title}
            </span>
          )}
          <p className="font-normal text-[#f8ecdb]">{content}</p>
        </div>
      )}
    </span>
  );
};
