# 🚀 快速開始：Zeabur 部署珍珠奶茶 POS

## 步驟 1：建立 Zeabur 專案

1. 前往 https://zeabur.com
2. 點擊右上角 **"Sign In"** (使用 GitHub 登入)
3. 點擊 **"New Project"**

## 步驟 2：連接 GitHub

1. 在專案頁面，點擊 **"Add a Resource"**
2. 選擇 **"Ecosystem"** → **"GitHub"**
3. 點擊 **"Connect"** → 允許 GitHub 權限

## 步驟 3：新增 Next.js 部署

1. 在 Resources 建立清單中，尋找 **"Next.js"** 或 **"Frameworks"**
2. 選擇 **"Next.js"** 模版
3. 在搜尋欄輸入 `pearl-tea` 或選擇剛才的 repository
4. 點擊 **"Deploy"**

## 步驟 4：新增 PostgreSQL 資料庫

1. 在 Deployment 頁面的 Database 標籤/分頁
2. 點擊新建資源，選擇 **"PostgreSQL"**
3. 設定：
   - 名稱: `pearl-tea-db`
   - 資料庫名: `pearltea`
4. 點擊部署

## 步驟 5：設定環境變數

1. 選中 Next.js Deployment
2. 點擊 **"Settings"** → **"Environment Variables"**
3. 新增變數：
   - Key: `DATABASE_URL`
   - Value: 從 PostgreSQL 部署頁面複製的連線字串
4. 儲存並部署

---

## 📝 完整詳細指南

如需詳細步驟，請查看：
👉 [ZEABUR-DEPLOYMENT.md](./ZEABUR-DEPLOYMENT.md)

---

## 🆘 遇到問題？

如果需要協助，告訴我：
- 你現在在 Zeabur 的哪個步驟遇到問題
- 錯誤訊息是什麼
- 我會幫你逐步解決