# 資料種子（Seed Data）手動執行指南

某些檔案暫時從建置過程中移除，以確保 Zeabur Build 通過。你需要時可以手動執行：

## ⚠️ 警告：這些檔案並非建置過程的一部分

## 手動建立資料的方法

### 方法 1：使用 node 直接執行 `prisma/seed-admin.js`

```bash
cd /src
node prisma/seed-admin.js
```

### 方法 2：使用 node 直接執行 `prisma/seed-products.js`

```bash
cd /src
node prisma/seed-products.js
```

### 方法 3：使用 node 直接執行 `prisma/seed-order.js`

```bash
cd /src
node prisma/seed-order.js
```

---

## 📋 各腳本功能

### seed-admin.js
- 建立 Admin 帳號
- Email: `admin@pearltea.com`
- Password: `admin123`

### seed-products.js
- 建立 6 個商品類別
- 建立 20 個測試商品

### seed-order.js
- 建立 1 筆銷售測試訂單
- 包含多筆訂單明細
- 自動隨機飲料選項

---

## 🚀 推薦執行順序

1. **先建立商品資料**（如果還沒做）
   ```bash
   node prisma/seed-products.js
   ```

2. **再建立銷售測試資料**（選做）
   ```bash
   node prisma/seed-order.js
   ```

---

## 鳻統已準備好接收資料

- ✅ SQLite 過渡已移除
- ✅ Prisma Schema 已更新為 PostgreSQL
- ✅ `DATABASE_URL` 環境變數已設定
- ✅ 資料表已建立（`npx prisma db push`）

---

## 資料將被寫入的位置

- **Admin User**: `User` 資料表
- **商品類別**: `ProductCategory` 資料表
- **商品**: `Product` 資料表
- **訂單**: `Order` 資料表
- **訂單明細**: `OrderItem` 資料表

---

## 驗證資料已建立

```bash
# 查看 Admin 帳號
npx prisma studio
# 或直接測試 API
curl http://localhost:3001/api/auth/login
```

---

**編寫日期**: 2026-05-29
**版本**: 1.0.1-rc1