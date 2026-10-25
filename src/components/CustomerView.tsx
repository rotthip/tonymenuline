import React, { useState, useMemo } from 'react';
import { MenuItem } from '../types/menu';
import { sortMenusByFileNameNumber } from '../services/storage';
import {
  Search,
  ZoomIn,
  BookOpen,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  QrCode,
  FileImage,
  ArrowDown10
} from 'lucide-react';

interface CustomerViewProps {
  menus: MenuItem[];
  onOpenZoom: (menu: MenuItem) => void;
  onOpenQR: () => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  menus,
  onOpenZoom,
  onOpenQR,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [displayMode, setDisplayMode] = useState<'grid' | 'book'>('grid');
  const [activeBookIndex, setActiveBookIndex] = useState<number>(0);

  // Sort all menus by numeric sequence in fileName from least to greatest (น้อย ไป มาก)
  const sortedAndFilteredMenus = useMemo(() => {
    const sorted = sortMenusByFileNameNumber(menus);
    if (!searchQuery.trim()) return sorted;

    const query = searchQuery.toLowerCase().trim();
    return sorted.filter((menu) =>
      menu.title.toLowerCase().includes(query) ||
      menu.fileName?.toLowerCase().includes(query) ||
      menu.description?.toLowerCase().includes(query) ||
      menu.tags?.some((t) => t.toLowerCase().includes(query))
    );
  }, [menus, searchQuery]);

  const currentBookMenu = sortedAndFilteredMenus[activeBookIndex] || sortedAndFilteredMenus[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Menu Board · ใบเมนูอาหารและเครื่องดื่ม</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            ยินดีต้อนรับสู่เมนูอาหารของเรา
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            แสดงใบเมนูทั้งหมดเรียงตามลำดับเลขชื่อไฟล์จากน้อยไปมาก แตะหรือคลิกที่ใบเมนูเพื่อซูมดูรายการอาหาร วัตถุดิบ และราคาอย่างละเอียด
          </p>
        </div>

        {/* QR Code Quick Standee Trigger */}
        <div className="mt-4 sm:mt-0 sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2 flex items-center gap-3">
          <button
            onClick={onOpenQR}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-sm font-medium text-amber-300 hover:text-white transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>QR โต๊ะ / สแกนดูเมนู</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Sorting indicator, Search & Layout View Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
        {/* Sorting indicator & Count */}
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 font-medium text-amber-300">
            <ArrowDown10 className="w-4 h-4 text-amber-400" />
            <span>เรียงตามเลขชื่อไฟล์ (น้อย → มาก)</span>
          </div>
          <span className="text-slate-400">
            ทั้งหมด {sortedAndFilteredMenus.length} ใบเมนู
          </span>
        </div>

        {/* Search & Layout Toggles */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ค้นหาชื่ออาหาร / ชื่อไฟล์เมนู..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveBookIndex(0);
              }}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Mode Switch: Grid vs Book */}
          <div className="flex items-center p-1 bg-slate-800/90 rounded-lg border border-slate-700/60 shrink-0">
            <button
              onClick={() => setDisplayMode('grid')}
              title="Grid View (มุมมองตารางทั้งหมด)"
              className={`p-1.5 rounded-md transition-colors ${
                displayMode === 'grid'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDisplayMode('book')}
              title="Book View (มุมมองเล่มเมนูเปิดทีละหน้า)"
              className={`p-1.5 rounded-md transition-colors ${
                displayMode === 'book'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {sortedAndFilteredMenus.length === 0 && (
        <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">ไม่พบใบเมนูที่ค้นหา</h3>
          <p className="text-xs text-slate-500 mt-1">
            ลองเปลี่ยนคำค้นหาเพื่อดูเมนูทั้งหมด
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 px-4 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-semibold hover:bg-amber-400 transition-colors"
          >
            แสดงเมนูทั้งหมด
          </button>
        </div>
      )}

      {/* All Menus in a Single Page Grid (เรียงตามเลขชื่อไฟล์จากน้อยไปมาก) */}
      {displayMode === 'grid' && sortedAndFilteredMenus.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedAndFilteredMenus.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onOpenZoom(item)}
              className="group relative flex flex-col bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-xl cursor-pointer"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[3/4] w-full bg-slate-950 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Page Number & File Number Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[11px] font-mono font-bold text-amber-300 border border-white/10">
                    หน้า {idx + 1}
                  </span>
                  {item.fileName && (
                    <span className="hidden group-hover:inline-block px-2 py-0.5 rounded bg-slate-900/90 backdrop-blur-sm text-[10px] font-mono text-slate-300 border border-white/10 truncate max-w-[140px]">
                      {item.fileName}
                    </span>
                  )}
                </div>

                {/* Hover Zoom Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 text-slate-950 text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <ZoomIn className="w-4 h-4" />
                    แตะเพื่อซูมดูรูป (Zoom)
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-2 bg-slate-900/90">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-amber-400 font-medium">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 truncate">
                      <FileImage className="w-3 h-3 text-amber-400 shrink-0" />
                      {item.fileName || `menu_${idx + 1}.png`}
                    </span>
                    {item.priceRange && (
                      <span className="font-semibold text-emerald-400 shrink-0 font-mono">
                        {item.priceRange}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-1 group-hover:text-amber-300 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book / Single Page Flip Mode */}
      {displayMode === 'book' && currentBookMenu && (
        <div className="flex flex-col items-center max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between w-full px-2 text-xs text-slate-400">
            <span>
              หน้า {activeBookIndex + 1} จากทั้งหมด {sortedAndFilteredMenus.length} หน้า · {currentBookMenu.fileName || 'menu.png'}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={activeBookIndex === 0}
                onClick={() => setActiveBookIndex((prev) => Math.max(0, prev - 1))}
                className="p-1.5 rounded-lg bg-slate-800 text-white disabled:opacity-30 hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-amber-400">
                {activeBookIndex + 1} / {sortedAndFilteredMenus.length}
              </span>
              <button
                disabled={activeBookIndex === sortedAndFilteredMenus.length - 1}
                onClick={() =>
                  setActiveBookIndex((prev) => Math.min(sortedAndFilteredMenus.length - 1, prev + 1))
                }
                className="p-1.5 rounded-lg bg-slate-800 text-white disabled:opacity-30 hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Book Page Card */}
          <div
            onClick={() => onOpenZoom(currentBookMenu)}
            className="relative group w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl cursor-pointer"
          >
            <div className="relative max-h-[70vh] flex items-center justify-center bg-black/60 p-2 sm:p-4">
              <img
                src={currentBookMenu.imageUrl}
                alt={currentBookMenu.title}
                referrerPolicy="no-referrer"
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 text-slate-950 text-sm font-bold shadow-xl">
                  <ZoomIn className="w-5 h-5" />
                  แตะเพื่อซูมขนาดเต็ม (Full Zoom)
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-medium text-amber-400">
                  {currentBookMenu.fileName || `หน้า ${activeBookIndex + 1}`}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{currentBookMenu.title}</h3>
                {currentBookMenu.description && (
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">{currentBookMenu.description}</p>
                )}
              </div>
              {currentBookMenu.priceRange && (
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">ช่วงราคา</span>
                  <span className="text-sm font-semibold text-emerald-400 font-mono">
                    {currentBookMenu.priceRange}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
