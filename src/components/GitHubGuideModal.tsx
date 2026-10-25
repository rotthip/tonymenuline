import React, { useState } from 'react';
import {
  X,
  Github,
  Check,
  Copy,
  Download,
  Terminal,
  FolderGit2,
  Globe,
  DollarSign,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface GitHubGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubGuideModal: React.FC<GitHubGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedWorkflow, setCopiedWorkflow] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'steps' | 'workflow' | 'images'>('steps');

  if (!isOpen) return null;

  const workflowYmlContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  const handleCopyWorkflow = () => {
    navigator.clipboard.writeText(workflowYmlContent).then(() => {
      setCopiedWorkflow(true);
      setTimeout(() => setCopiedWorkflow(false), 2000);
    });
  };

  const handleDownloadWorkflow = () => {
    const blob = new Blob([workflowYmlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deploy.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                วิธีเผยแพร่แอปและเก็บรูปใน GitHub (ฟรี 100% ไม่มีค่าใช้จ่าย)
              </h3>
              <p className="text-xs text-slate-400">
                GitHub Pages ใช้งานฟรีตลอดไป ไม่ต้องมีเซิร์ฟเวอร์ ไม่ต้องเสียเงินรายเดือน
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

        {/* Tab selection */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'steps'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            1. ขั้นตอนการนำขึ้น GitHub Pages
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'images'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            2. วิธีเก็บรูป PNG ใน GitHub
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'workflow'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            3. ไฟล์ Workflow (deploy.yml)
          </button>
        </div>

        {/* Tab Content 1: Steps */}
        {activeTab === 'steps' && (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                <strong>ฟรี 100%:</strong> ทั้งการสร้างแอปด้วย Google AI Studio และการโฮสต์ผ่าน GitHub Pages ไม่มีค่าบริการหรือค่าธรรมเนียมใดๆ ทั้งสิ้น
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">1</span>
                  <span>สร้าง GitHub Repository ใหม่ (แบบ Public หรือ Private ฟรี)</span>
                </div>
                <p className="text-slate-400 pl-7">
                  ไปที่ <a href="https://github.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">github.com</a> แล้วกด "New Repository" ตั้งชื่อ เช่น <code className="text-white bg-slate-800 px-1 rounded">my-restaurant-menu</code>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">2</span>
                  <span>ดาวน์โหลดโค้ดจาก AI Studio แล้วนำเข้าสู่ GitHub</span>
                </div>
                <p className="text-slate-400 pl-7">
                  ใช้คำสั่ง git หรืออัปโหลดไฟล์ทั้งหมดขึ้น Repository:
                </p>
                <div className="ml-7 p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
                  git init<br />
                  git add .<br />
                  git commit -m "Initial menu app"<br />
                  git branch -M main<br />
                  git remote add origin https://github.com/YOUR_USERNAME/my-restaurant-menu.git<br />
                  git push -u origin main
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">3</span>
                  <span>เปิดใช้งาน GitHub Pages ใน Settings</span>
                </div>
                <p className="text-slate-400 pl-7">
                  ใน GitHub Repo ของคุณ ไปที่เมนู <strong>Settings</strong> &gt; <strong>Pages</strong><br />
                  ตรงหัวข้อ <strong>Source</strong> ให้เลือกเป็น <strong>"GitHub Actions"</strong><br />
                  ระบบจะสร้างและรัน Workflow อัตโนมัติในแท็บ Actions ภายใน 1-2 นาที คุณจะได้ URL เว็บไซต์เมนูทันที!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Storing PNG Images */}
        {activeTab === 'images' && (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-400 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4" />
                วิธีที่ 1: วางไฟล์รูปในโฟลเดอร์ public/menus/ ของโปรเจกต์ (แนะนำที่สุด)
              </h4>
              <p className="text-slate-400">
                เมื่อนำไฟล์รูปภาพ PNG ไปใส่ไว้ในโฟลเดอร์ <code className="text-white bg-slate-800 px-1 rounded">public/menus/</code> (เช่น <code className="text-white bg-slate-800 px-1 rounded">dish1.png</code>), รูปภาพจะถูก deploy ไปยัง GitHub Pages ทันที และสามารถเรียกดูได้ด้วย URL:
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-300">
                https://&lt;username&gt;.github.io/&lt;repo-name&gt;/menus/dish1.png
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-400 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                วิธีที่ 2: ใช้ GitHub Raw URL
              </h4>
              <p className="text-slate-400">
                คุณสามารถอัปโหลดรูปขึ้น GitHub แล้วกดที่รูป &gt; คลิกปุ่ม <strong>"Download"</strong> หรือ <strong>"Raw"</strong> เพื่อคัดลอกลิงก์รูปตรง เช่น:
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-300 break-all">
                https://raw.githubusercontent.com/&lt;username&gt;/&lt;repo&gt;/main/public/menus/dish1.png
              </div>
              <p className="text-slate-400">
                จากนั้นนำลิงก์นี้ไปวางในหน้า <strong>"จัดการเมนู (Admin)"</strong> ในช่อง <strong>"ลิงก์รูปภาพ (GitHub Raw URL)"</strong> ได้ทันที
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-400">
                วิธีที่ 3: อัปโหลดผ่านหน้าเว็บโดยตรง
              </h4>
              <p className="text-slate-400">
                ระบบในแอปนี้มีพื้นที่จัดเก็บในเบราว์เซอร์ (IndexedDB) รองรับไฟล์ PNG ขนาดใหญ่ แม้ปิดเบราว์เซอร์ไปแล้วข้อมูลและรูปที่อัปโหลดไว้ก็ยังคงอยู่ และสามารถกดปุ่ม <strong>"Export menus.json"</strong> เพื่อนำการตั้งค่าไปบันทึกไว้ใน GitHub ได้ตลอดเวลา
              </p>
            </div>
          </div>
        )}

        {/* Tab Content 3: Workflow file */}
        {activeTab === 'workflow' && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-400">
              สร้างไฟล์ชื่อ <code className="text-white bg-slate-800 px-1 py-0.5 rounded">.github/workflows/deploy.yml</code> ในโฟลเดอร์โปรเจกต์ของคุณ เพื่อให้ GitHub Pages ทำการ build และ publish เว็บไซต์อัตโนมัติทุกครั้งที่มีการ push โค้ด:
            </p>

            <div className="relative">
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-60 leading-relaxed">
                {workflowYmlContent}
              </pre>
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <button
                  onClick={handleCopyWorkflow}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[11px] flex items-center gap-1 border border-slate-700"
                >
                  {copiedWorkflow ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedWorkflow ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                </button>
                <button
                  onClick={handleDownloadWorkflow}
                  className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow-sm"
                >
                  <Download className="w-3 h-3" />
                  <span>ดาวน์โหลดไฟล์</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            เข้าใจแล้ว / ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
