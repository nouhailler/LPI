import React from 'react';
import {
  CompetencyMasteryState,
  getMasteryStateInfo
} from '../../services/masteryEngine';
import { CheckCircle2, Circle, Clock, Flame, Sparkles } from 'lucide-react';

interface Props {
  state: CompetencyMasteryState;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const ObjectiveMasteryBadge: React.FC<Props> = ({
  state,
  size = 'md',
  showIcon = true,
  onClick,
  className = ''
}) => {
  const info = getMasteryStateInfo(state);

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2'
  }[size];

  const renderIcon = () => {
    switch (state) {
      case 'MASTERED':
        return <CheckCircle2 className="w-3.5 h-3.5 fill-current shrink-0" />;
      case 'PRACTICING':
        return <Flame className="w-3.5 h-3.5 shrink-0" />;
      case 'LEARNING':
        return <Clock className="w-3.5 h-3.5 shrink-0" />;
      case 'NOT_STARTED':
      default:
        return <Circle className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        backgroundColor: info.bgColor,
        color: info.color,
        borderColor: info.borderColor
      }}
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-lg border transition-all select-none ${
        onClick ? 'cursor-pointer hover:opacity-90 active:scale-95' : 'cursor-default'
      } ${sizeClasses} ${className}`}
      title={`Statut: ${info.labelFr} (Cliquez pour inspecter les 4 critères)`}
    >
      {showIcon && renderIcon()}
      <span>{info.labelFr}</span>
    </button>
  );
};
