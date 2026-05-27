# Zeabur 部署完整指南

## 步驟 0：推送完成確認

確保 GitHub repository 已經推送到：
```
https://github.com/khchents-glitch/pearltea
```

---

## 步驟 1：建立 Zeabur 專案

### 1.1 註冊/登入 Zeabur
- 前往 https://zeabur.com
- 點擊右上角 "Sign In" 或 "註冊"
- 推薦使用 GitHub 帳號登入（步驟更簡單）

### 1.2 建立新專案
1. 登入後，點擊 "New Project" 或 建立➕
2. 選擇部署區域 - 根據你的目標用戶位置：
   - **亞洲用戶**: Asia (東京、新加坡)、Singapore、Hong Kong
   - **全球用戶**: San Francisco、New York
3. 專案名稱：`PearlTeaPOS`
4. 點擊 "Create" 或建立

---

## 步驟 2：連接 GitHub Repository

### 2.1 Zeabur 自動建立 GitHub
1. 在專案頁面，點擊 **"Add a Resource"**
2. 在 Resource marketplace 裡，尋找 **"Ecosystem"** → **"GitHub"**
3. 選擇 **"Connect"**
4. Zeabur 會自動請求 GitHub 連接權限 → 允許
5. Zeabur 會自動取得你 GitHub 上的 repositories

### 2.2 選擇專案 repository
1. 在 Zeabur 中，選擇 **"Frameworks"** 或 **"Next.js"**
2. 選擇 **"Next.js"** 模版
3. 選擇剛才推送的 repository: `pearl-tea` 或 `pearltea`
4. 點擊 **"Deploy"** 或 **"Connect to GitHub"**

---

## 步驟 3：設定 PostgreSQL 資料庫

### 3.1 建立 PostgreSQL Deployment
1. 在同時 Homolog Display，繼續新增資源
2. 選擇 **"Databases"** → **"PostgreSQL"**
3. 選擇板例如：
   - **免費方案**: Talent (免費版)
   - **付費方案**: Intrepid 等，依量價格
4. 內容與資料庫名稱：
   - 名稱：`pearl-tea-db`
   - 資料庫：`pearltea` 或自訂
   - 用戶：`postgres`
5. 點擊 **"Deploy"** 或建立

### 3.2 記錄 PostgreSQL 連線資訊
部署完成後：
1. 點擊 PostgreSQL deployment
2. 尋找 **"Connection String"** 或 **"Connection"**
3. 你會看到類似這樣的 URL：
   ```
   postgresql://postgres:password123@zeabur-sql-0x.yourzeabur.app:5432/pearltea?schema=public
   ```
4. **複製這個完整的連線字符串**

---

## 步驟 4：更新專案環境變數

### 4.1 開啟專案 Settings
1. 在 Zeabur 主畫面，點擊你的 **PearlTeaPOS** 專案
2. 找到 **"Settings"** 標籤 (或齒輪圖示)
3. 點擊 **"Environment Variables"**

### 4.2 新增環境變數
新增以下變數：

| 變數名稱 | 變數值 | 類型 |
|---------|--------|------|
| `DATABASE_URL` | 從 PostgreSQL 複製的 connection string | Connection String |

**如何填寫**：
- Category (類別): `Production`
- Key (鍵值): `DATABASE_URL`
- Value (值): `postgresql://postgres:你的密碼@zeabur-sql-0x.yourzeabur.app:5432/pearltea?schema=public`
- 保持選項 (例如 Defaults)

點擊 **"Add"** 或 **"Save"**

---

## 步驟 5：啟動部署

### 5.1 Zeabur 自動部署
1. 返回專案頁面
2. Zeabur 會自動開始部署
3. 你會看到一個藍色條，顯示：
   ```
   ✓ Installing dependencies
   ✓ Building application
   ✓ Deploying
   ✓ Health check pass
   ! Ready
   ```

### 5.2 監控部署進度
點擊 Deployment 卡片查看詳細日誌：
- 查看 **"Logs"** 標籤
- 如果遇到錯誤，紅字會顯示問題原因

**常見部署問題**：
- ❌ Build failed: 請檢查 `package.json` 和 build 指令
- ❌ Database connection failed: 確認 `DATABASE_URL` 正確
- ❌ No route matches (404): 檢查 Next.js 專案結構

---

## 步驟 6：取得部署網址

### 6.1 查看部署 URL
部署完成後：
1. 在 Psb/專案 Details 頁面
2. 你會看到一個 **`.zeabur.app`** 域名
3. 類似這樣：
   ```
   https://pearl-tea-xyz.zeabur.app
   ```

### 6.2 設定自訂域名 (可選)
1. 在專案 Settings → Domains
2. 點擊 **"Add Domain"**
3. 輸入你的域名，或選擇 Zeabur 提供的 Vercel預覽域名

---

## 步驟 7：測試部署功能

### 7.1 訪問網站
在瀏覽器開啟：
```
https://你的網址.zeabur.app
```

應該看到：
- POS 頁面標題：「珍珠奶茶 POS」
- 登入表單
- 產品標題：管理工作場域、新增人員配額等

### 7.2 測試登入
- Email: `admin@pearltea.com`
- Password: `admin123`

如果成功，會顯示：
- POS 介面
- 產品網格（應有商品清單）
- 頂端標題：「珍珠奶茶 POS」

### 7.3 測試功能
1. 查看左側/右側網格的產品列表
2. 點擊搜尋欄輸入「珍珠」或「茶」
3. 點擊分類按鈕
4. 將產品加入瀏覽器緩存瀏覽器管理的購物車
5. 訂單結帳畫面確認正常顯示

---

## ✅ 完成清單

### 前置準備 ✅
- [x] GitHub repository 已建立
- [x] 程式碼已推送到 GitHub
- [x] GitHub 連線成功

### Zeabur 部署 ✅
- [ ] Zeabur 專案已建立
- [ ] GitHub database resource 已連接
- [ ] PostgreSQL 已建立並取得連線字串
- [ ] 環境變數 DATABASE_URL 已設定
- [ ] 專案成功部署到 `.zeabur.app` 網址
- [ ] 網站可正常存取

### 功能測試 ✅
- [ ] 網站能正常開啟
- [ ] 登入功能正常
- [ ] POS 產品顯示正常
- [ ] 購物車功能正常
- [ ] 訂單建立正常

---

## 🔧 Zeabur 常用操作

### 管理部署
- **Redeploy**: 部署更新或修復
- **Scale**: 調整資源（CPU/Memory）
- **Staging Preview**: 建立 staging 版本

### 檢查日誌
點擊 Deployment卡片 → Logs 標籤查看詳細日誌。

### 資源管理
- **查看資源使用率**: 監控 CPU、Memory、Disk
- **增加資源**: 自動擴展、調整規格
- **刪除資源**: 僅保留必要的資源與日誌

---

## 📚 參考資源

- [Zeabur 官方文檔](https://zeabur.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [Prisma 部署指南](https://www.prisma.io/docs/guides/migrations).

---

**完成部署後**，如果一切正常，你就擁有一個可用的珍珠奶茶 POS 系統！🎉