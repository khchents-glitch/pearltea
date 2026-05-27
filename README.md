# 珍珠奶茶店POS系統

一套完整的珍珠奶茶店點餐系統，執行在 Zeabur 上。

## 技術棧

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **後端**: Next.js API Routes
- **資料庫**: SQLite (本地開發) -> PostgreSQL (Zeabur生產)
- **認證**: JWT

## 快速開始

### 本地開發

```bash
npm install
npm run dev
```

然後開啟瀏覽器到 `http://localhost:3000`

### 预設 credentials

- Email: `admin@pearltea.com`
- Password: `admin123`

## 特性

### 已實作功能

✅ 會員登入系統
✅ 產品管理
   - 分類系統
   - 單一價格（套餐）
   - 產品搜尋
✅ POS 點餐介面
   - 產品展示網格
   - 分類過濾
   - 購物車功能
   - 訂單查詢結帳
✅ 訂單管理
   - 訂單狀態追蹤
   - 手動更新狀態

## 待實作功能

- 開發者：用戶名；他們時常新增配料（珍珠加倍/波霸加倍）
- 實體商品級配料；如果使用「選項」或「按選項選擇」功能則能串接，能擴展為商品級獨立配料
- 多店與員工權限
- 結算頁面
- 銷售報表/統計
- 來單與沖製狀態
- 開帳單/便當精準增減

## 部署到 Zeabur

1. 在 Zeabur 上建立一個新的 PostgreSQL Deployment
2. 從 Zeabur 複制 DATABASE_URL
3. 更新本地 `.env`:
   ```
   DATABASE_URL="postgresql://..."
   ```
4. 在 Zeabur 上部署 Next.js App

## 架構

```
pearl-tea-pos/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── logout/route.ts
│   │   │   ├── products/route.ts
│   │   │   └── orders/
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   ├── login/page.tsx
│   │   ├── pos/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   └── db.ts
│   └── types/
│       └── next-env.d.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── config.ts
└── package.json
```

## 資料庫結構

- User - 管理員帳號
- ProductCategory - 產品分類
- Product - 產品
- Order - 訂單
- OrderItem - 訂單細項
- OrderOption - 配料選項
- OrderStatusHistory - 訂單狀態歷史