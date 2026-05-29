# 🧪 PearlTea POS 測試指南

## 概述

本測試套件提供完整的系統測試功能，包括網路檢測、資料庫檢查和 API 測試。

## 測試檔案結構

```
tests/
├── simple-test.js          # 簡單的資料庫測試（快速）
├── network.ts              # 網路連線測試
├── database.ts             # 資料庫詳細測試
├── api.ts                  # API 端點測試
├── runner.ts               # 統一測試執行器
└── report.ts               # 測試報告生成器
```

## 快速測試

### 1. 檢查資料庫連線

```bash
npm run test:database
```

這會測試：
- ✅ 資料庫連線是否正常
- ✅ User、Product、Category、Order 模型是否存在
- ✅ 詳細的測試結果和統計

### 2. 測試簡單連線（最快速）

```bash
node tests/simple-test.js
```

這會檢查：
- ✅ 資料庫連線
- ✅ User 和 Product 表是否正常

### 3. 完整測試套件

```bash
npm run test
```

執行所有測試並生成完整報告。

---

## 詳細測試說明

### Network Test (`tests/network.ts`)

測試網路連線狀態：

- ✅ PostgreSQL 資料庫連線
- ✅ GitHub API 連線
- ✅ 本地伺服器狀態（localhost:3001）
- ✅ Zeabur 部署網址（可選）

### Database Test (`tests/database.ts`)

完整的資料庫功能測試：

1. **資料庫連線** - 驗證連線是否成功
2. **User 模型** - 檢查使用者資料表
3. **Product 模型** - 檢查產品資料表
4. **Category 模型** - 檢查分類資料表
5. **Order 模型** - 檢查訂單資料表
6. **Create User** - 測試新增使用者並清理
7. **Create Order** - 測試新增訂單並清理

### API Test (`tests/api.ts`)

測試所有 API 端點：

1. **Base Connectivity** - API 伺服器狀態
2. **Health Check** - `/debug` 端點
3. **Users Endpoint** - `/api/users`
4. **Products Endpoint** - `/api/products`
5. **Categories Endpoint** - `/api/categories`
6. **Orders Endpoint** - `/api/orders`
7. **Login Endpoint** - `/api/auth/login`

---

## 測試執行時間

- 簡單測試 (simple-test.js): ~2-3 秒
- 資料庫測試: ~5-10 秒
- API 測試: ~10-20 秒（依賴伺服器狀態）
- 完整測試套件: ~30-60 秒

---

## 環境變數

可設定的環境變數：

```bash
# 本地 API 網址（如果不在預設位置）
export LOCAL_API_URL="http://localhost:3001/api"

# Zeabur 部署網址
export ZEABUR_DEPLOYMENT_URL="https://your-app.zeabur.app"
```

---

## 測試結果說明

### PASS (綠色 ✅)
測試通過，功能正常運作。

### WARN (黃色 ⚠️)
測試有輕微問題，通常可以忽略：
- 服務未啟動（可接受，因為可能只是手動檢查）
- 未找到預期資料（需要餘額種植）

### SKIP (灰 skip 📖)
測試被跳過，通常因為：
- 取决于环境配置
- 依赖外部服務不可用

### FAIL (紅色 ❌)
測試失敗，需要修復：
- 網路連線問題
- API 回應錯誤
- 驗證邏輯錯誤
- 資料庫錯誤

---

## 修復失敗的測試

### Database 連線失敗

1. 檢查 `.env.local` 檔案
2. 確認 `DATABASE_URL` 長格正確
3. 檢查 SQLite 資料庫檔案是否存在：`dev.db`

### API 測試失敗

1. 啟動本地開發伺服器：`npm run dev`
2. 確認伺服器在預設埠（3001）啟動
3. 檢查環境變數設定

### Network 測試失敗

1. 確認網路連線正常
2. 檢查防火牆設定
3. 聯繫網路管理員

---

## CI/CD 整合

測試報告生成 JSON 格式：

```javascript
// 生成 JSON 報告
const report = generateJsonReport(results, startTime, endTime)

// 寫入檔案
fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2))

// 或在 CI/CD 中使用
process.exit(report.summary.failed > 0 ? 1 : 0)
```

---

## 常見問題

### Q1. 測試執行很慢？

**A:** API 測試依賴本地開發伺服器啟動。確保 `npm run dev` 已經執行。

### Q2. 找不到 "@prisma/client" 模組？

**A:** 需要安裝依賴：`npm install`

### Q3. 資料庫連線失敗？

**A:**
1. 檢查資料庫檔案 `dev.db` 是否存在
2. 確認 `.env.local` 中的 `DATABASE_URL` 設定正確
3. 移除 url 配置：`file:./dev.db`

### Q4. 如何遠端測試 Zeabur 部署？

**A:**
1. 更新測試環境變數
2. 使用 Zeabur 提供的網址替換 `localhost`
3. 確保 API 超時設設合理（5-10 秒）

---

## 預期結果

正確設置下，您應該看到：

```
🧪 PearlTea POS - Simple Database Test

1️⃣ Database Connection
   ✅ Connected to database

2️⃣ User Table Query
   ✅ User table exists with X records
      - admin@pearltea.com
      - ...

3️⃣ Product Table Query
   ✅ Product table exists with Y records
      - 珍珠奶茶
      - ... etc.

📊 Summary
   Total:  3
   Passed: 3
   Failed: 0
   Rate:   100.0%

✅ All tests passed!
```

---

## 新增自訂測試

在相應的測試檔案中新增測試案例：

```typescript
// 在 database.ts 中新增
console.log('8️⃣ Custom Test')
total++
try {
  // 測試邏輯
  const result = await someOperation()
  console.log('   ✅ Test passed')
  passed++
} catch (error) {
  console.log('   ❌ Test failed')
  failed++
}
```

---

## 相關資源

- [Prisma 文檔](https://www.prisma.io/docs)
- [Next.js 測試指南](https://nextjs.org/docs/testing)
- [資料庫連線問題診斷](./TROUBLESHOOTING.md)

---

**最後更新：** 2026-05-29
**測試套件版本：** 1.0.0
**作者：** PearlTea POS Team