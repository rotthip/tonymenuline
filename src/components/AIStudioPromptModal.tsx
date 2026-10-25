import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  TerminalSquare,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AIStudioPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIStudioPromptModal: React.FC<AIStudioPromptModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const englishPrompt = `Build a high-performance, modern, zero-cost Digital Restaurant Menu Web Application ("MenuShowcase") optimized for customers to view high-resolution menu images (PNG/JPG) on smartphones and desktop browsers, and ready for 100% free hosting on GitHub Pages.

Key Features & Specifications:

1. CUSTOMER EXPERIENCE (โหมดมุมมองลูกค้า):
   - Crisp digital menu board viewer displaying restaurant menu cards/pages with instant loading.
   - Interactive Fullscreen Lightbox & Zoom Viewer:
     * Smooth zoom controls (Zoom In, Zoom Out, Mouse Wheel zoom, Pinch-to-zoom).
     * Pan navigation: Click and drag with mouse or touch to move across high-resolution PNG dishes, ingredients, and prices.
     * Page navigation (Next / Previous arrows, bottom thumbnail bar, keyboard shortcuts ArrowLeft/ArrowRight).
     * 90-degree image rotation button and full-screen toggle.
     * Direct PNG download button for customers.
   - Display all menu images on a single continuous page sorted strictly by the number in the file name from least to greatest (1, 2, 3...) without category separation.
   - Instant search bar to filter by dish name, file name keyword, or tags.
   - Dual viewing layout options: Responsive Grid layout & Single-page Flipbook viewer.

2. ADMIN & MENU MANAGEMENT (โหมดจัดการใบเมนู):
   - REQUIREMENT 1 (Upload, Delete, Edit):
     * Drag-and-drop PNG file upload zone with file picker (.png, .jpg, .webp).
     * Support for direct GitHub Raw image URLs or relative URLs.
     * Edit menu item modal: Modify title, category, price range, description, notes, tags, or replace the PNG image.
     * Delete menu item with confirmation modal.
   - REQUIREMENT 2 (Mouse Drag & Drop Reordering):
     * Reorder menu images by clicking and holding with the mouse (HTML5 drag & drop) with visual drop indicator highlights and smooth animation.
     * Accessible Move Up / Move Down buttons for quick reordering.
   - REQUIREMENT 3 (GitHub Storage & Export):
     * Persistent storage via browser IndexedDB (with localStorage fallback) so large high-res PNG files persist across reloads without storage quota crashes.
     * "Export menus.json" button to export all menu configurations ready for GitHub repository.
     * Built-in step-by-step GitHub Pages setup guide and copyable .github/workflows/deploy.yml.

3. TABLE QR CODE GENERATOR:
   - Scannable table QR code generator for restaurant dining tables.
   - Customizable restaurant title and table numbers (e.g. Table 01, Table 02, etc.).
   - Printable table standee card preview with direct print & PNG download.
   - Copyable customer menu URL.

4. GITHUB PAGES & ZERO-COST DEPLOYMENT COMPATIBILITY:
   - Configure Vite with base: './' for clean relative asset paths on any GitHub Pages repository URL (https://<username>.github.io/<repo-name>/).
   - Zero-cost architecture: No backend database required, no paid API keys required, 100% free static site hosting on GitHub Pages.
   - High typographic hierarchy, dark elegant restaurant aesthetic, zero layout shifts, and fully responsive across mobile phones, tablets, and wide screens.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(englishPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <TerminalSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                คำสั่งภาษาอังกฤษสำหรับ Google AI Studio (English Prompt)
              </h3>
              <p className="text-xs text-slate-400">
                สามารถคัดลอกข้อความด้านล่างนี้ไปวางใน Google AI Studio เพื่อสร้างแอปได้ทันที โดยไม่มีค่าใช้จ่าย
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thai Explanation Box */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed space-y-1">
          <p className="font-semibold text-amber-300">
            💡 วิธีนำไปใช้ใน Google AI Studio:
          </p>
          <p>
            1. กดปุ่ม <strong>"คัดลอกคำสั่งภาษาอังกฤษ (Copy English Prompt)"</strong> ด้านล่าง
          </p>
          <p>
            2. เปิด <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="underline font-medium text-white">Google AI Studio</a> แล้ววางข้อความนี้ลงในช่องแชทหรือกล่องคำสั่ง
          </p>
          <p>
            3. AI Studio จะเขียนโค้ดและสร้างโครงสร้างแอปทั้งหมดให้ฟรี โดยไม่ต้องจ่ายเงินค่าโฮสติ้งหรือฐานข้อมูลเลย!
          </p>
        </div>

        {/* English Prompt Code Box */}
        <div className="relative">
          <textarea
            readOnly
            rows={14}
            value={englishPrompt}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed select-all focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          />

          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'คัดลอกเรียบร้อยแล้ว!' : 'คัดลอกคำสั่ง (Copy)'}</span>
          </button>
        </div>

        {/* Summary of key features included in the prompt */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-slate-300 text-[11px]">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2">
            <span className="text-amber-400 font-bold">✓</span>
            <span>อัปโหลด, แก้ไข, ลบ รูปใบเมนู PNG ได้อิสระ</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2">
            <span className="text-amber-400 font-bold">✓</span>
            <span>กดเมาส์ค้างเพื่อลากสลับตำแหน่งรูป (Drag & Drop)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2">
            <span className="text-amber-400 font-bold">✓</span>
            <span>ฟรี 100% พร้อมรองรับ GitHub Pages ทันที</span>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
