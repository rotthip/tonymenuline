import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  Copy,
  Check,
  Printer,
  Download,
  Share2,
  UtensilsCrossed
} from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [restaurantName, setRestaurantName] = useState<string>('Bistro & Cafe');
  const [tableNumber, setTableNumber] = useState<string>('01');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [customUrl, setCustomUrl] = useState<string>('');
  const printCardRef = useRef<HTMLDivElement>(null);

  // Default to current URL without admin hashes
  const activeUrl = customUrl || window.location.href.split('?')[0];

  useEffect(() => {
    if (!isOpen) return;

    const fullUrl = tableNumber
      ? `${activeUrl}?table=${encodeURIComponent(tableNumber)}`
      : activeUrl;

    QRCode.toDataURL(
      fullUrl,
      {
        width: 320,
        margin: 1.5,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [isOpen, tableNumber, activeUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const fullUrl = tableNumber
      ? `${activeUrl}?table=${encodeURIComponent(tableNumber)}`
      : activeUrl;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `menu_qr_table_${tableNumber || 'all'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">QR Code เมนูตั้งโต๊ะ (Table Standee)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              ชื่อร้านอาหาร (Restaurant)
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              หมายเลขโต๊ะ (Table No.)
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="เช่น 01, A2, VIP..."
              className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Printable Standee Card Preview */}
        <div
          ref={printCardRef}
          className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl flex flex-col items-center text-center border-4 border-amber-500/30"
        >
          <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mb-2 shadow-sm">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <h4 className="text-base font-extrabold tracking-tight uppercase text-slate-900">
            {restaurantName}
          </h4>
          <span className="text-[11px] font-medium text-slate-600 mt-0.5">
            สแกนเพื่อดูใบเมนูอาหาร (SCAN FOR DIGITAL MENU)
          </span>

          {/* QR Code Container */}
          <div className="my-3 p-2 bg-white rounded-xl shadow-inner border border-slate-100">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Table QR Code"
                className="w-48 h-48 object-contain"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                กำลังสร้าง QR Code...
              </div>
            )}
          </div>

          {tableNumber && (
            <div className="px-4 py-1 rounded-full bg-slate-900 text-white text-xs font-bold tracking-wide">
              TABLE : โต๊ะ {tableNumber}
            </div>
          )}
          <span className="text-[10px] text-slate-600 mt-2">
            แตะหรือซูมดูรูปเมนู PNG ได้อย่างคมชัดทุกรายการ
          </span>
        </div>

        {/* URL Box & Copy */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs text-slate-400">ลิงก์สำหรับลูกค้า (Customer Link):</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={tableNumber ? `${activeUrl}?table=${tableNumber}` : activeUrl}
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-amber-300 font-mono select-all truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white flex items-center gap-1.5 shrink-0 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={handleDownloadQR}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลดไฟล์ QR (PNG)</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์การ์ดตั้งโต๊ะ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
