import React from 'react';
import { ViewMode } from '../types/menu';
import {
  UtensilsCrossed,
  Eye,
  SlidersHorizontal,
  QrCode,
  Github,
  TerminalSquare
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenQR: () => void;
  onOpenGitHubGuide: () => void;
  onOpenPromptModal: () => void;
  totalMenus: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  onOpenQR,
  onOpenGitHubGuide,
  onOpenPromptModal,
  totalMenus,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            MenuShowcase
          </span>
          <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400">
            · Digital Menu
          </span>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="flex items-center gap-2 sm:gap-4 text-xs font-medium">
          {/* Customer View Tab */}
          <button
            onClick={() => onSelectView('customer')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'customer'
                ? 'bg-amber-500/15 text-amber-300 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>มุมมองลูกค้า (Customer)</span>
          </button>

          {/* Admin Management Tab */}
          <button
            onClick={() => onSelectView('admin')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'admin'
                ? 'bg-amber-500/15 text-amber-300 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>จัดการเมนู (Admin)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-400 font-mono">
              {totalMenus}
            </span>
          </button>

          {/* GitHub Guide Link */}
          <button
            onClick={onOpenGitHubGuide}
            className="hidden md:inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Github className="w-3.5 h-3.5" />
            <span>ขึ้น GitHub ฟรี</span>
          </button>

          {/* AI Studio Prompt Link */}
          <button
            onClick={onOpenPromptModal}
            className="hidden lg:inline-flex items-center gap-1.5 text-slate-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            <TerminalSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>คำสั่ง AI Studio</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenQR}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span>QR โต๊ะอาหาร</span>
          </button>
        </div>
      </div>
    </header>
  );
};
