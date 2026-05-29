# Zeabur Build 錯誤診斷

## 錯誤訊息
```
build failed err=build image: build failed: failed to solve: process "/bin/sh -c yarn build" did not complete successfully: exit code 1
```

## 已修復的問題

### ✅ 1. statusHistory model 引用問題
**檔案**: `src/app/api/orders/[id]/route.ts`

**問題**:
- 第 28 行：include 中引用 `statusHistory`（schema 不存在）
- 第 59-62 行：update data 中 create `statusHistory`（schema 不存在）

**修復**:
- 移除 GET endpoint 中的 `statusHistory: true`
- 移除 PATCH endpoint 中的 `statusHistory` 建立行為

**狀態**: ✅ 已修復並推送

---

## 詳細修復內容

### src/app/api/orders/[id]/route.ts

**修復前**:
```typescript
const order = await prisma.order.findUnique({
  where: { id: params.id },
  include: {
    items: { include: { product: true } },
    statusHistory: true,  // ❌ schema 中不存在
  },
})

const updatedOrder = await prisma.order.update({
  where: { id: params.id },
  data: {
    status,
    statusHistory: {
      create: { status, note },  // ❌ schema 中不存在
    },
  },
  include: { statusHistory: true },  // ❌ schema 中不存在
})
```

**修復後**:
```typescript
const order = await prisma.order.findUnique({
  where: { id: params.id },
  include: {
    items: { include: { product: true } },
  },
})

const updatedOrder = await prisma.order.update({
  where: { id: params.id },
  data: { status },
  include: { items: true },
})
```

---

## 審查的其他檔案

### ✅ src/app/api/orders/route.ts
- 正確使用 `prisma` 從 `@/lib/db`
- 使用 mock 如果 DATABASE_URL 未設定
- 無 TypeScript 錯誤

### ✅ src/app/api/products/route.ts
- 使用 prisma（未設定時用 mock）
- 正確的 include 語法
- 無 TypeScript 錯誤

### ✅ src/app/api/auth/login/route.ts
- 使用 mock admin
- 不使用 prisma
- 無 TypeScript 錯誤

### ✅ src/app/api/auth/logout/route.ts
- 使用 jsonwebtoken
- 不使用 prisma
- 無 TypeScript 錯誤

### ✅ src/lib/db.ts
- Prisma 7.x 標準配置
- Singleton pattern
- 無 TypeScript 錯誤

---

## 資料庫 Model 比對

### Schema 中存在的 models:
- ✅ User
- ✅ ProductCategory
- ✅ Product
- ✅ ProductOption
- ✅ OrderItem
- ✅ Order

### API 中引用的 relations:
- ✅ Order ⬅ items ⬅ Product (正確)
- ✅ Order ⬅ user (正確)
- ✅ Product ⬅ category (正確)
- ❌ Order ⬅ statusHistory (已移除)

---

## 下一步

等待 Zeabur 自動重建：
1. 訪問 Zeabur Dashboard
2. 等待部署自動進度
3. 檢查 build 是否成功

預計時間：1-2 分鐘

---

## 重建後測試

如果 build 成功：

```bash
# 建立資料庫資料
node prisma/seed-products.js
node prisma/seed-order.js

# 測試 API
curl https://你的網址/api/products
```

---

**修復人**: OpenClaw Agent
**修復時間**: 2026-05-29 15:10 UTC
**commit**: d71e4a4
**狀態**: ⏳ 等待 Zeabur 重建