import React from 'react';
import { Sparkles, RefreshCw, X, Zap } from 'lucide-react';
import { VersionInfo, forceApplicationUpdate } from '../utils/updateService';

interface UpdateNotificationBannerProps {
  show: boolean;
  versionInfo?: VersionInfo | null;
  onDismiss: () => void;
  onOpenSettings: () => void;
}

export const UpdateNotificationBanner: React.FC<UpdateNotificationBannerProps> = ({
  show,
  versionInfo,
  onDismiss,
  onOpenSettings,
}) => {
  if (!show) return null;

  return (
    <div
      id="update-notification-toast"
      className="fixed bottom-18 md:bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100%-2rem)] sm:w-auto bg-[#201b11] text-white border border-[#ffc20e] rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-200"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-xs sm:text-sm text-white">
              New Update Available
            </h4>
            {versionInfo?.version && (
              <span className="px-1.5 py-0.2 bg-[#ffc20e] text-[#6d5100] font-bold text-[10px] rounded">
                v{versionInfo.version}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#d3c5ab] mt-0.5">
            A new version of LPI Certification Prep is ready to load.
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => forceApplicationUpdate()}
              className="px-3 py-1.5 bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              Update Now
            </button>
            <button
              onClick={onOpenSettings}
              className="px-2.5 py-1.5 bg-[#362f22] hover:bg-[#4f4632] text-[#fff8f2] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              View Details
            </button>
          </div>
        </div>

        <button
          onClick={onDismiss}
          aria-label="Dismiss update notification"
          className="text-[#817660] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
