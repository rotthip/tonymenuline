import React, { useState, useEffect, useRef } from 'react';
import { MenuItem } from '../types/menu';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Download,
  Move
} from 'lucide-react';

interface MenuZoomModalProps {
  menu: MenuItem | null;
  menus: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectMenu: (menu: MenuItem) => void;
}

export const MenuZoomModal: React.FC<MenuZoomModalProps> = ({
  menu,
  menus,
  isOpen,
  onClose,
  onSelectMenu,
}) => {
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndex = menu ? menus.findIndex((m) => m.id === menu.id) : -1;

  // Reset transforms when opening a new menu
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [menu?.id, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, menus]);

  if (!isOpen || !menu) return null;

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectMenu(menus[currentIndex - 1]);
    } else if (menus.length > 0) {
      onSelectMenu(menus[menus.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < menus.length - 1) {
      onSelectMenu(menus[currentIndex + 1]);
    } else if (menus.length > 0) {
      onSelectMenu(menus[0]);
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.35, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.35, 0.6);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Pan dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = menu.imageUrl;
    link.download = menu.fileName || `${menu.title.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md select-none"
      onWheel={handleWheel}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Floating Control Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-mono tabular-nums px-2 py-0.5 rounded bg-slate-800 text-amber-400">
            {currentIndex + 1} / {menus.length}
          </span>
          <div className="truncate">
            <h2 className="text-sm font-semibold text-white truncate font-mono">
              {menu.fileName || menu.title}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">

          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-800/80 rounded-lg border border-slate-700/50">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.6}
              title="Zoom Out (-)"
              className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded hover:bg-slate-700 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset Zoom (0)"
              className="px-2 py-0.5 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={scale >= 4}
              title="Zoom In (+)"
              className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded hover:bg-slate-700 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleRotate}
            title="Rotate 90°"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="hidden sm:inline-flex p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            title="Download PNG"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-slate-800 mx-1" />

          <button
            onClick={onClose}
            title="Close (Esc)"
            className="p-2 text-slate-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewing Canvas */}
      <div
        className={`relative flex-1 flex items-center justify-center overflow-hidden ${
          scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {/* Navigation Arrows */}
        {menus.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              title="Previous Menu Page (Left Arrow)"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/80 text-white/80 hover:text-white hover:bg-amber-600/90 shadow-lg border border-slate-700/50 backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              title="Next Menu Page (Right Arrow)"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/80 text-white/80 hover:text-white hover:bg-amber-600/90 shadow-lg border border-slate-700/50 backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* The Menu Image Element with Smooth Transform */}
        <div
          className="relative transition-transform duration-75 ease-out select-none max-h-full max-w-full flex items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
          }}
        >
          <img
            src={menu.imageUrl}
            alt={menu.title}
            referrerPolicy="no-referrer"
            draggable={false}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl pointer-events-none"
          />
        </div>

        {/* Pan Helper Indicator when zoomed */}
        {scale > 1 && (
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300 backdrop-blur-sm">
            <Move className="w-3.5 h-3.5 text-amber-400" />
            <span>ลากเมาส์เพื่อเลื่อนดูส่วนต่างๆ (Drag to pan)</span>
          </div>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {menus.length > 1 && (
        <div className="relative z-20 px-4 py-2.5 bg-slate-900/90 border-t border-slate-800/80 backdrop-blur-md overflow-x-auto flex items-center justify-center gap-3">
          {menus.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => onSelectMenu(item)}
              className={`relative shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                item.id === menu.id
                  ? 'border-amber-400 ring-2 ring-amber-400/30 scale-105'
                  : 'border-slate-700/60 opacity-60 hover:opacity-100 hover:border-slate-500'
              }`}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-12 h-16 object-cover"
              />
              <span className="absolute bottom-0 inset-x-0 text-[10px] bg-black/70 text-center text-white py-0.5 truncate">
                P.{idx + 1}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
