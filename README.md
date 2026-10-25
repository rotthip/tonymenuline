# MenuShowcase - Digital Restaurant Menu (แอปแสดงใบเมนูอาหารดิจิทัล)

แอปพลิเคชันแสดงใบเมนูรูปภาพ (PNG/JPG) สำหรับร้านอาหารและคาเฟ่ ใช้งานฟรี 100% ไม่มีค่าใช้จ่ายรายเดือน โฮสต์ผ่าน GitHub Pages ได้ทันที พร้อมฟังก์ชันครบครัน:
1. **อัปโหลด, ลบ และแก้ไขใบเมนู**: รองรับไฟล์ PNG ขนาดใหญ่ จัดเก็บผ่าน IndexedDB ปลอดภัยในเบราว์เซอร์
2. **กดเมาส์ค้างเพื่อลากวางตำแหน่ง (Drag & Drop Reordering)**: สลับลำดับใบเมนูได้ทันใจ
3. **จัดเก็บรูปใน GitHub & เผยแพร่ฟรี**: มี workflow deploy ไปยัง GitHub Pages ได้อัตโนมัติ

---

## 🚀 ฟังก์ชันเด่นสำหรับลูกค้า (Customer Features)
- **โหมดมุมมองลูกค้า (Customer View)**: สะอาดตา สบายตา เหมาะสำหรับเปิดผ่านสมาร์ตโฟน แท็บเล็ต หรือจอหน้าร้าน
- **ซูมรูปใบเมนู (Full-Screen Lightbox & Zoom)**: ซูมขยายได้ตั้งแต่ 60% ถึง 400%, ใช้เมาส์หรือนิ้วลากเลื่อนดูรายละเอียดอาหารและราคาได้อย่างคมชัด
- **หมวดหมู่ & ค้นหา**: มีแท็บหมวดหมู่ (อาหารจานหลัก, ของทานเล่น, เครื่องดื่ม, ของหวาน) และช่องค้นหาแบบเรียลไทม์
- **QR Code ประจำโต๊ะ**: สร้าง QR Code สำหรับพิมพ์วางบนโต๊ะอาหาร ให้ลูกค้าใช้กล้องโทรศัพท์สแกนดูเมนูได้ทันที

---

## 🛠️ โหมดจัดการเมนู (Admin & Manager)
- **เพิ่มใบเมนู**: ลากไฟล์รูป PNG มาวาง หรือใส่ลิงก์รูปตรงจาก GitHub Raw URL
- **ลากวางสลับลำดับด้วยเมาส์ (Mouse Drag & Drop)**: เลื่อนตำแหน่งหน้าเมนูได้อย่างง่ายดาย
- **แก้ไขและลบ**: แก้ไขชื่อ, หมวดหมู่, ราคา, คำอธิบาย หรือแทนที่รูปภาพได้ตลอดเวลา
- **Export menus.json**: ส่งออกการตั้งค่าเมนูเพื่อนำไปเก็บใน GitHub Repository

---

## 📦 วิธีเผยแพร่ขึ้น GitHub Pages (ฟรี 100% ไม่มีค่าใช้จ่าย)

### ขั้นตอนที่ 1: สร้าง Repository บน GitHub
1. เข้าไปที่ [GitHub.com](https://github.com) แล้วสร้าง Repository ใหม่ (เช่น `my-menu-app`)

### ขั้นตอนที่ 2: นำโค้ดขึ้น GitHub
```bash
git init
git add .
git commit -m "Initial commit for MenuShowcase"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/my-menu-app.git
git push -u origin main
```

### ขั้นตอนที่ 3: เปิดใช้งาน GitHub Pages
1. ในหน้า GitHub Repository ของคุณ ไปที่แท็บ **Settings** > **Pages**
2. ตรงหัวข้อ **Source** ให้เลือกเป็น **GitHub Actions**
3. ระบบจะรันไฟล์ `.github/workflows/deploy.yml` อัตโนมัติ และให้ URL เว็บไซต์ฟรีมาใช้งานทันที!

---

## 💻 Tech Stack
- React 19 + TypeScript
- Vite 8 (`base: './'` รองรับ GitHub Pages path ทุกรูปแบบ)
- Tailwind CSS v4
- Lucide React Icons
- QRCode Generator
- IndexedDB + LocalStorage Persistence
