/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MenuItem, ViewMode } from './types/menu';
import {
  getMenus,
  saveMenu,
  updateMenu,
  deleteMenu,
  reorderMenus,
  resetToDefaultMenus,
} from './services/storage';

import { Navbar } from './components/Navbar';
import { CustomerView } from './components/CustomerView';
import { AdminView } from './components/AdminView';
import { MenuZoomModal } from './components/MenuZoomModal';
import { QRCodeModal } from './components/QRCodeModal';
import { GitHubGuideModal } from './components/GitHubGuideModal';
import { AIStudioPromptModal } from './components/AIStudioPromptModal';

import { UtensilsCrossed, Sparkles, Loader2, RefreshCw } from 'lucide-react';

export default function App() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // App navigation and modal states
  const [currentView, setCurrentView] = useState<ViewMode>('customer');
  const [zoomMenu, setZoomMenu] = useState<MenuItem | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [isGitHubGuideOpen, setIsGitHubGuideOpen] = useState<boolean>(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);

  // Load menus from storage on startup
  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const items = await getMenus();
      setMenus(items);
    } catch (err) {
      console.error('Error loading menus:', err);
      setLoadError('ไม่สามารถโหลดข้อมูลใบเมนูได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  // Add menu
  const handleAddMenu = async (newMenu: MenuItem) => {
    try {
      const updated = await saveMenu(newMenu);
      setMenus(updated);
    } catch (err) {
      console.error('Error saving menu:', err);
    }
  };

  // Update menu
  const handleUpdateMenu = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const updated = await updateMenu(id, updates);
      setMenus(updated);
      if (zoomMenu?.id === id) {
        setZoomMenu({ ...zoomMenu, ...updates });
      }
    } catch (err) {
      console.error('Error updating menu:', err);
    }
  };

  // Delete menu
  const handleDeleteMenu = async (id: string) => {
    try {
      const updated = await deleteMenu(id);
      setMenus(updated);
      if (zoomMenu?.id === id) {
        setZoomMenu(null);
      }
    } catch (err) {
      console.error('Error deleting menu:', err);
    }
  };

  // Reorder menus (Drag and Drop)
  const handleReorderMenus = async (reorderedList: MenuItem[]) => {
    // Instant optimistic update in UI
    setMenus(reorderedList);
    try {
      await reorderMenus(reorderedList);
    } catch (err) {
      console.error('Error saving reordered menus:', err);
    }
  };

  // Reset to default sample menus
  const handleResetDefaults = async () => {
    try {
      const defaults = await resetToDefaultMenus();
      setMenus(defaults);
    } catch (err) {
      console.error('Error resetting defaults:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenQR={() => setIsQRModalOpen(true)}
        onOpenGitHubGuide={() => setIsGitHubGuideOpen(true)}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
        totalMenus={menus.length}
      />

      {/* Main Content Area with Loading & Error States */}
      <main className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
            <p className="text-sm font-medium text-slate-400">
              กำลังโหลดใบเมนูอาหาร... (Loading Menus)
            </p>
          </div>
        ) : loadError ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
              ✕
            </div>
            <h3 className="text-base font-bold text-white">เกิดข้อผิดพลาดในการโหลด</h3>
            <p className="text-xs text-slate-400">{loadError}</p>
            <button
              onClick={loadMenuItems}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ลองใหม่อีกครั้ง</span>
            </button>
          </div>
        ) : currentView === 'customer' ? (
          <CustomerView
            menus={menus}
            onOpenZoom={(menu) => setZoomMenu(menu)}
            onOpenQR={() => setIsQRModalOpen(true)}
          />
        ) : (
          <AdminView
            menus={menus}
            onAddMenu={handleAddMenu}
            onUpdateMenu={handleUpdateMenu}
            onDeleteMenu={handleDeleteMenu}
            onReorderMenus={handleReorderMenus}
            onResetDefaults={handleResetDefaults}
            onOpenGitHubGuide={() => setIsGitHubGuideOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-500" />
            <span>MenuShowcase · Free Digital Menu Board for Restaurants & Cafes</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsGitHubGuideOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              GitHub Pages Guide (ฟรี)
            </button>
            <span>·</span>
            <button
              onClick={() => setIsPromptModalOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              คำสั่งสร้างแอปใน AI Studio
            </button>
            <span>·</span>
            <button
              onClick={() => setCurrentView(currentView === 'customer' ? 'admin' : 'customer')}
              className="hover:text-amber-400 transition-colors"
            >
              {currentView === 'customer' ? 'สลับไปโหมดผู้จัดการ' : 'สลับไปมุมมองลูกค้า'}
            </button>
          </div>
        </div>
      </footer>

      {/* Fullscreen High-Res Zoom Lightbox Modal */}
      <MenuZoomModal
        isOpen={!!zoomMenu}
        menu={zoomMenu}
        menus={menus}
        onClose={() => setZoomMenu(null)}
        onSelectMenu={(menu) => setZoomMenu(menu)}
      />

      {/* Table QR Code Standee Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

      {/* GitHub Sync & Hosting Guide Modal */}
      <GitHubGuideModal
        isOpen={isGitHubGuideOpen}
        onClose={() => setIsGitHubGuideOpen(false)}
      />

      {/* AI Studio English Prompt Modal */}
      <AIStudioPromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />
    </div>
  );
}
