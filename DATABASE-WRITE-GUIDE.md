# 資料庫寫入指南

## ✅ 已完成修復

所有的資料庫模型已經新增到 `prisma/schema.prisma`，現在系統可以正常寫入資料了！

---

## 🎯 如何讓資料寫入資料庫

### 步驟 1：建立/更新資料庫

建立資料表結構：

```bash
cd /home/node/.openclaw/workspace/pearl-tea-pos

# 方式 A：直接推送到 PostgreSQL（最常用）
npx prisma db push

# 方式 B：建立遷移方案（正式環境推薦）
npx prisma migrate dev --name init

# 方式 C：開啟 Prisma Studio 視覺化管理
npm run db:studio
```

---

## 📊 資料模型說明

### 1. User（用戶）
**目的**：儲存登入用戶資訊

**Endpoint**：
```bash
POST https://你的網址/api/auth/login
```

**欄位**：
- `id` - 用戶 ID
- `email` - 電子郵件（唯一）
- `password` - 密碼（加密）
- `name` - 用戶名稱

---

### 2. ProductCategory（商品類別）
**目的**：分類清單

**Endpoint**：
```bash
POST https://你的網址/api/categories
```

**欄位**：
- `id` - 類別 ID
- `name` - 類別名稱
- `description` - 說明

**範例**：
```javascript
{
  "name": "珍珠奶茶類",
  "description": "經典珍珠奶茶系列"
}
```

---

### 3. Product（商品）
**目的**：商品明細

**Endpoint**：
```bash
POST https://你的網址/api/products
```

**欄位**：
- `id` - 商品 ID
- `name` - 商品名稱
- `price` - 價格
- `categoryId` - 所屬類別
- `description` - 商品說明

**範例**：
```javascript
{
  "name": "經典珍珠奶茶",
  "price": 45,
  "categoryId": "類別ID",
  "description": "濃郁茶香，Q彈珍珠"
}
```

---

### 4. Order（訂單）
**目的**：儲存訂單主檔

**Endpoint**：
```bash
POST https://你的網址/api/orders
```

**欄位**：
- `id` - 訂單 ID
- `userId` - 用戶 ID（可為空）
- `total` - 總金額
- `subtotal` - 小計
- `tax` - 稅金
- `status` - 訂單狀態（pending/completed/cancelled）
- `checkedIn` - 入座時間

---

### 5. OrderItem（訂單明細）
**目的**：儲存訂單中每個商品的選擇

**Endpoint**：自動透過 `POST /api/orders`

**欄位**：
- `id` - 明細 ID
- `orderId` - 所屬訂單
- `productId` - 商品
- `productOption` - 選擇的選項（溫度、甜度、配料）
- `optionExtras` - 配件的加價
- `price` - 售價
- `quantity` - 數量
- `notes` - 備註

---

## 🚀 範例流程

### 完整的訂單建立流程：

```bash
# 1. 登入取得 Token
curl -X POST https://你的網址/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pearltea.com",
    "password": "admin123"
  }'

# 2. 取得 Token 後，呼叫 API

curl -X GET https://你的網址/api/categories \
  -H "Authorization: Bearer <token>"

curl -X GET https://你的網址/api/products \
  -H "Authorization: Bearer <token>"

curl -X POST https://你的網址/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "items": [
      {
        "productId": "product-id-1",
        "quantity": 2,
        "optionIron": "濃縮",
        "optionSugar": "50%",
        "extras": [
          {"name": "波霸", "price": 0}
        ]
      }
    ],
    "notes": "多加珍珠"
  }'
```

---

## 🔍 驗證資料已寫入

### 方法 1：使用 Prisma Studio

```bash
cd /home/node/.openclaw/workspace/pearl-tea-pos
npm run db:studio
```

將開啟瀏覽器：http://localhost:5555

### 方法 2：使用 SQL 查詢

```bash
# 連接到你的 PostgreSQL
psql postgresql://用戶:密碼@主機:5432/資料庫名稱

# 查看所有資料表
\dt

# 查看用戶資料  
SELECT * FROM "User";

# 查看訂單
SELECT o.*, u."email" as "userEmail"
FROM "Order" o
LEFT JOIN "User" u ON o."userId" = u."id"
ORDER BY o."createdAt" DESC
LIMIT 10;
```

### 方法 3：查看最新訂單

在瀏覽器中訪問：
```
https://你的網址/api/orders
```

---

## 🎨 應用程式中的寫入點

### 後端 API（已經準備好）

1. **POST /api/auth/register** - 註冊用戶
2. **POST /api/auth/login** - 登入（儲存 session）
3. **POST /api/categories** - 新增商品類別
4. **POST /api/products** - 新增商品
5. **POST /api/orders** - 新增訂單（寫入多個 OrderItem）
6. **GET /api/orders** - 查看歷史訂單
7. **PUT /api/orders/[id]** - 更新訂單狀態
8. **DELETE /api/orders/[id]** - 刪除訂單

### 前端應用程式

現在你可以透過前端 UI 登入並開立訂單，所有資料都會自動寫入 PostgreSQL！

---

## 💾 環境變數設定

確保 `.env` 或 Zeabur 環境變數包含：

```bash
# PostgreSQL 連線（在 Zeabur 或本地）
DATABASE_URL="postgresql://postgres:密碼@localhost:5432/pearltea"

# JWT 密鑰
JWT_SECRET="pearl-tea-development-secret-key-change-in-production"

# 伺服器設定
NODE_ENV="development"
PORT=3001
```

---

## 🧪 測試資料庫寫入

執行簡單測試：

```bash
cd /home/node/.openclaw/workspace/pearl-tea-pos

# 1. 測試資料庫連線
node tests/simple-test.js

# 2. 查看資料表是否建立成功
npx prisma studio
```

---

## 📈 Next Steps

1. ✅ 資料表已經建立（schema.prisma 已新增模型）
2. ⏳ 確認 PostgreSQL 已運行並連線
3. ⏳ 使用 API 自動寫入資料
4. ⏳ 在 Zeabur 建立資料庫資源（如果還沒設置）
5. ⏳ 重新部署後端

---

**總結**：現在資料庫已經準備好接收資料！執行 `npx prisma db push` 來建立資料表，然後透過 API 或前端 UI 來寫入資料。

需要我協助建立測試資料或設定連線嗎？