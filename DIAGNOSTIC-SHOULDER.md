# Build 失敗診斷指南

## 預計日期
2026-05-29

## 目的
診斷並修復 Zeabur Build 失敗問題（exit code 1）

## 問題
Build 指令執行失敗：`yarn build`

## 需要的資訊

### 1. 錯誤詳細訊息
```
[請貼上完整的錯誤堆疊，特別注意：
- 第 38 行或第 39 列
- Any TypeScript 或 ESLint 錯誤
- Any Prisma 或 package 錯誤
]
```

### 2. Zeabur 日誌
```
[請提供 Zeabur Dashboard 中的建置日誌輸出]
```

## 常見原因

1. **Prisma Client import 錯誤**
   - src/lib/db.ts 可能 import 方式錯誤
   - Prisma 7.x 相容性問題

2. **TypeScript 錯誤**
   - .ts/.tsx 檔案有 type error
   - 導致無法 build

3. **ESLint 錯誤**
   - lint 失敗
   - Next.js預設不允許 lint 失敗的 build

4. **相依性問題**
   - 缺少 @types/*
   - package.json 配置不當

## 修復步驟（待確診後執行）

1. 檢查 jade (.ts).tsx 檔案的 TypeScript 錯誤
2. 檢查 "lint" 是否影響 build
3. 檢查 @prisma/client 的 import 方式
4. 檢查 package.json 中的相依性

## 狀態
⏳ 等待完整錯誤訊息