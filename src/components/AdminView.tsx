import React, { useState, useRef } from 'react';
import { MenuItem } from '../types/menu';
import { sortMenusByFileNameNumber } from '../services/storage';
import {
  Upload,
  GripVertical,
  Edit2,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  ArrowDown10,
  Image as ImageIcon,
  Check,
  X,
  FileCode,
  Sparkles,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

interface AdminViewProps {
  menus: MenuItem[];
  onAddMenu: (menu: MenuItem) => void;
  onUpdateMenu: (id: string, updates: Partial<MenuItem>) => void;
  onDeleteMenu: (id: string) => void;
  onReorderMenus: (ordered: MenuItem[]) => void;
  onResetDefaults: () => void;
  onOpenGitHubGuide: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  menus,
  onAddMenu,
  onUpdateMenu,
  onDeleteMenu,
  onReorderMenus,
  onResetDefaults,
  onOpenGitHubGuide,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // New Menu Form State
  const [uploadedImageData, setUploadedImageData] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'url'>('upload');
  const [externalUrl, setExternalUrl] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Handle local PNG file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  const processFile = (file: File) => {
    const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setFileName(file.name);
    setFileSize(sizeStr);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImageData(result);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop file to upload zone
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('image/') || file.name.endsWith('.png'))) {
      processFile(file);
    }
  };

  // Submit new menu (Only image is required, zero text fields)
  const handleCreateMenu = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImageUrl = imageSourceMode === 'url' ? externalUrl : uploadedImageData;

    if (!finalImageUrl) {
      alert('กรุณาเลือกหรืออัปโหลดรูปใบเมนู PNG');
      return;
    }

    const cleanName = fileName || (imageSourceMode === 'url' ? externalUrl.split('/').pop() || 'menu.png' : 'menu.png');

    const newMenuItem: MenuItem = {
      id: 'menu-' + Date.now(),
      title: cleanName,
      category: 'เมนูอาหาร',
      imageUrl: finalImageUrl,
      fileName: cleanName,
      fileSize: fileSize || '1.0 MB',
      order: menus.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddMenu(newMenuItem);

    // Reset Form
    setUploadedImageData('');
    setExternalUrl('');
    setFileName('');
    setFileSize('');
    setIsUploading(false);
  };

  // Mouse Drag and Drop Reordering Handlers (Requirement 2)
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Set transparent drag ghost or data
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    // Only clear if leaving card
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...menus];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, draggedItem);

    onReorderMenus(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Keyboard / Button move controls
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const reordered = [...menus];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;
    onReorderMenus(reordered);
  };

  const handleMoveDown = (index: number) => {
    if (index === menus.length - 1) return;
    const reordered = [...menus];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;
    onReorderMenus(reordered);
  };

  // Edit menu modal save
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenu) return;

    onUpdateMenu(editingMenu.id, {
      imageUrl: editingMenu.imageUrl,
      fileName: editingMenu.fileName,
      fileSize: editingMenu.fileSize,
      title: editingMenu.fileName || editingMenu.title,
    });

    setEditingMenu(null);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingMenu) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setEditingMenu({
        ...editingMenu,
        imageUrl: result,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      });
    };
    reader.readAsDataURL(file);
  };

  // Export menus JSON for GitHub repository
  const handleExportJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      app: 'MenuShowcase',
      totalMenus: menus.length,
      menus: menus.map((m) => ({
        id: m.id,
        title: m.title,
        category: m.category,
        order: m.order,
        description: m.description,
        priceRange: m.priceRange,
        fileName: m.fileName,
        tags: m.tags,
        // If imageUrl is local or path, preserve it
        imageUrl: m.imageUrl.startsWith('data:') ? `./menus/${m.fileName || 'menu.png'}` : m.imageUrl,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menus.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Management Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Admin & Menu Manager
            </span>
            <span className="text-xs text-slate-400">
              ทั้งหมด {menus.length} ใบเมนู (Drag & drop to reorder)
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            จัดการใบเมนู (เพิ่ม, ลบ, แก้ไข และ ลากจัดเรียงตำแหน่ง)
          </h2>
          <p className="text-xs text-slate-400">
            สามารถกดเมาส์ค้างไว้ที่ใบเมนูแล้วลากสลับตำแหน่งได้ทันที หรือคลิกปุ่มเพื่อเพิ่มใบเมนูใหม่
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsUploading(!isUploading)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            {isUploading ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isUploading ? 'ปิดฟอร์มอัปโหลด' : '+ เพิ่มใบเมนู PNG ใหม่'}</span>
          </button>

          <button
            onClick={() => {
              const sorted = sortMenusByFileNameNumber(menus);
              onReorderMenus(sorted);
            }}
            title="จัดเรียงใบเมนูอัตโนมัติตามเลขชื่อไฟล์จากน้อยไปมาก"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-medium transition-colors whitespace-nowrap"
          >
            <ArrowDown10 className="w-4 h-4 text-amber-400" />
            <span>เรียงตามเลขชื่อไฟล์ (1 → 9)</span>
          </button>

          <button
            onClick={onOpenGitHubGuide}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors whitespace-nowrap"
          >
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>คู่มือขึ้น GitHub (ฟรี 100%)</span>
          </button>

          <button
            onClick={handleExportJSON}
            title="ส่งออกไฟล์ menus.json สำหรับใส่ใน GitHub"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Export menus.json</span>
          </button>

          <button
            onClick={() => {
              if (confirm('คุณต้องการรีเซ็ตใบเมนูกลับเป็นตัวอย่างเริ่มต้นหรือไม่?')) {
                onResetDefaults();
              }
            }}
            title="รีเซ็ตเป็นเมนูตัวอย่างเริ่มต้น"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Upload New Menu Drawer / Accordion */}
      {isUploading && (
        <form
          onSubmit={handleCreateMenu}
          className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">อัปโหลดใบเมนู PNG ใหม่ (Add New Menu Image)</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ยกเลิก
            </button>
          </div>

          <div className="max-w-xl mx-auto space-y-4">
            {/* Image Source Mode Selector */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setImageSourceMode('upload')}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  imageSourceMode === 'upload'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                อัปโหลดไฟล์ PNG จากเครื่อง
              </button>
              <button
                type="button"
                onClick={() => setImageSourceMode('url')}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  imageSourceMode === 'url'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ลิงก์รูปภาพ (GitHub Raw URL)
              </button>
            </div>

            {imageSourceMode === 'upload' ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  uploadedImageData
                    ? 'border-amber-500/50 bg-amber-500/5'
                    : 'border-slate-700 hover:border-amber-500/40 bg-slate-950/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {uploadedImageData ? (
                  <div className="space-y-3">
                    <div className="relative max-h-56 overflow-hidden rounded-lg border border-slate-700 shadow-md">
                      <img
                        src={uploadedImageData}
                        alt="Preview"
                        className="max-h-56 w-auto object-contain mx-auto"
                      />
                    </div>
                    <div className="text-xs text-amber-300 font-mono font-medium">
                      {fileName} ({fileSize})
                    </div>
                    <p className="text-[11px] text-slate-400">
                      คลิกเพื่อเลือกรูปใหม่ หรือลากไฟล์มาวางทับได้
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-amber-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-200">
                      คลิกเพื่อเลือกไฟล์ หรือลากไฟล์รูปใบเมนู PNG มาวางที่นี่
                    </p>
                    <p className="text-xs text-slate-400">
                      ระบบจะโหลดรูปใบเมนูให้ลูกค้าดูทันที โดยไม่ต้องพิมพ์ข้อมูลใดๆ
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 block">
                  GitHub Raw Image URL หรือ ลิงก์ตรงของรูปภาพ
                </label>
                <input
                  type="url"
                  placeholder="https://raw.githubusercontent.com/username/repo/main/public/menus/dish.png"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[11px] text-slate-400">
                  สามารถใส่ลิงก์รูปเมนูที่ฝากไว้ใน GitHub Repository ได้โดยตรง
                </p>
                {externalUrl && (
                  <div className="p-2 border border-slate-700 rounded-lg max-h-48 overflow-hidden">
                    <img
                      src={externalUrl}
                      alt="Preview"
                      className="max-h-44 object-contain mx-auto"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setUploadedImageData('');
                  setExternalUrl('');
                  setIsUploading(false);
                }}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={!uploadedImageData && !externalUrl}
                className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95"
              >
                บันทึกและเพิ่มรูปใบเมนูนี้
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Menu Cards Reorder List (Drag and Drop Area) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <GripVertical className="w-4 h-4 text-amber-400" />
            กดเมาส์ค้างที่การ์ดแล้วลาก เพื่อจัดเรียงลำดับใหม่ (Click & hold to drag & drop):
          </span>
          <span>{menus.length} รายการ</span>
        </div>

        <div className="space-y-3">
          {menus.map((item, index) => {
            const isDraggingThis = draggedIndex === index;
            const isTargeted = dragOverIndex === index;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-150 cursor-grab active:cursor-grabbing ${
                  isDraggingThis
                    ? 'opacity-40 border-amber-500/80 bg-slate-950 scale-98 shadow-inner'
                    : isTargeted
                    ? 'border-amber-400 bg-amber-500/10 shadow-lg translate-x-1'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                {/* Left: Drag Handle, Page Index, and Thumbnail */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    title="ลากเพื่อย้ายตำแหน่ง"
                    className="p-1.5 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0"
                  >
                    <GripVertical className="w-5 h-5" />
                  </div>

                  <span className="w-7 text-center text-xs font-mono font-bold text-slate-400 bg-slate-800 py-1 rounded shrink-0">
                    #{index + 1}
                  </span>

                  <div className="relative w-14 h-18 sm:w-16 sm:h-20 bg-slate-950 rounded-lg overflow-hidden border border-slate-700/80 shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-white truncate group-hover:text-amber-300 transition-colors font-mono">
                      {item.fileName || item.title || `menu_${index + 1}.png`}
                    </h4>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      ขนาด: {item.fileSize || '1.0 MB'} · หน้า {index + 1}
                    </span>
                  </div>
                </div>

                {/* Right: Quick Action Controls */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Reorder Arrow Shortcuts */}
                  <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      title="เลื่อนขึ้น (Move Up)"
                      className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded hover:bg-slate-700 transition-colors"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === menus.length - 1}
                      onClick={() => handleMoveDown(index)}
                      title="เลื่อนลง (Move Down)"
                      className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded hover:bg-slate-700 transition-colors"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => setEditingMenu(item)}
                    title="แก้ไขข้อมูลใบเมนู"
                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(item.id)}
                    title="ลบใบเมนูนี้"
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg border border-rose-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Menu Modal */}
      {editingMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                แก้ไขข้อมูลใบเมนู
              </h3>
              <button
                type="button"
                onClick={() => setEditingMenu(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Current Image & Replace */}
            <div className="flex items-center gap-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <img
                src={editingMenu.imageUrl}
                alt={editingMenu.title}
                className="w-16 h-20 object-cover rounded-md border border-slate-700"
              />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-200">รูปภาพใบเมนูปัจจุบัน</p>
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleEditFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => editFileInputRef.current?.click()}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 transition-colors"
                >
                  เลือกไฟล์ PNG เพื่อเปลี่ยนรูป
                </button>
              </div>
            </div>



            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingMenu(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-white">ยืนยันการลบใบเมนูนี้?</h3>
              <p className="text-xs text-slate-400">
                คุณแน่ใจหรือไม่ว่าต้องการลบใบเมนูนี้ออกจากรายการ? การกระทำนี้ไม่สามารถย้อนกลับได้
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteMenu(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
