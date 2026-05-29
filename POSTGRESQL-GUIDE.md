# 🗄️ PostgreSQL Setup Guide for PearlTea POS

本文檔提供在本地開發環境安裝和配置 PostgreSQL 的完整步驟，以及在 Zeabur 部署時使用 PostgreSQL 的說明。

---

## 📋 目錄

1. [本地開發環境設定](#%EF%B8%8F-%E6%9C%AC%E5%9C%B0%E9%96%8B%E7%99%BC%E7%92%B0%E5%A2%83%E5%A2%83%E8%A8%AD%E5%AE%9A)
2. [Zeabur 部署配置](#zeabur-%E9%96%B1%E9%80%A2%E9%85%8D%E7%BD%AE)
3. [資料庫遷移](#%EF%B8%8F-%E8%B3%87%E6%96%99%E5%BA%8F%E9%81%9A%E8%AE%A1%E6%BC%94%E8%AE%BE)
4. [測試驗證](#%EF%B8%8F-%E6%96%99%E6%B5%8B%E9%A9%97%E8%AD%89)
5. [故障排除](#%EF%B8%8F-%E6%95%B7%E6%96%B7%E6%89%8B%E5%AE%9A)

---

## 🖥️ 本地開發環境設定

### 方法 1: 使用系統套件安裝 (

#### Ubuntu / Debian

```bash
# 1. 更新套件列表
sudo apt-get update

# 2. 安裝 PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# 3. 啟動 PostgreSQL 服務
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 4. 檢查服務狀態
sudo systemctl status postgresql
```

#### macOS

```bash
# 方法 A: 使用 Homebrew
brew install postgresql@17
brew services start postgresql@17

# 方法 B: 使用官方安裝程式
# 下載: https://www.postgresql.org/download/macosx/
```

#### CentOS / RHEL

```bash
# 1. 安裝 EPEL 套件庫
sudo dnf install -y epel-release

# 2. 安裝 PostgreSQL
sudo dnf install -y postgresql-server

# 3. 初始化資料庫
sudo postgresql-setup initdb

# 4. 啟動服務
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

### 方法 2: 使用 Docker

如果已安裝 Docker，可以使用容器運行 PostgreSQL：

```bash
# 1. 下載 PostgreSQL 映像
docker pull postgres:16-alpine

# 2. 啟動 PostgreSQL 容器
docker run --name pearltea-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=pearltea \
  -p 5432:5432 \
  -v /path/to/data:/var/lib/postgresql/data \
  -d postgres:16-alpine

# 3. 檢查容器狀態
docker ps | grep pearltea-postgres

# 4. 查看日誌
docker logs pearltea-postgres

# 5. 停止和刪除容器
docker stop pearltea-postgres
docker rm pearltea-postgres
```

---

### 創建資料庫與使用者

```bash
# 1. 切換到 postgres 使用者
sudo -u postgres psql

# 2. 創建資料庫
CREATE DATABASE pearltea;

# 3. 創建使用者（可自訂）
CREATE USER pearltea_user WITH PASSWORD 'secure_password';

# 4. 授予權限
GRANT ALL PRIVILEGES ON DATABASE pearltea TO pearltea_user;

# 5. 設定使用者為預設資料庫擁有者（進階）
\c pearltea
GRANT ALL ON SCHEMA public TO pearltea_user;

# 6. 離開 psql
\q
```

---

### 驗證安裝

```bash
# 測試 PostgreSQL 連線
psql -h localhost -U postgres -d pearltea -c "SELECT version();"

# 產生密碼哈希（對於 logins 不同時有效）
passwd
```

---

## 🚢 Zeabur 部署配置

### 步驟 1: 建立 PostgreSQL Deployment

1. 登入 Zeabur: https://zeabur.com
2. 開啟您的 **PearlTeaPOS** 專案
3. 點擊 **"Add Resource"**
4. 選擇 **"Databases"** → **"PostgreSQL"**
5. 選擇方案（建議 Test/Talent 免費方案）
6. 命名：`pearl-tea-db`
7. 點擊 **"Deploy"**

### 步驟 2: 等待部署完成

Zeabur 會自動建立 PostgreSQL 實例，約需 1-2 分鐘。

### 步驟 3: 記錄連線資訊

部署完成後：

1. 點擊 PostgreSQL deployment
2. 找到 **"Connection"** 或 **"Connection String"** 標籤
3. 複製連線字串：
   ```
   postgresql://postgres:<PASSWORD>@zeabur-sql-0x.zeabur.app:5432/pearltea
   ```

### 步驟 4: 配置專案環境變數

在 Zeabur 專案的 **Settings** → **Environment Variables**：

**新增變數**：
```
Key: DATABASE_URL
Value: postgresql://postgres:<PASSWORD>@zeabur-sql-0x.zeabur.app:5432/pearltea
```

或者選擇 **Production** 作為類別。

### 步驟 5: 應用變數並重新部署

1. 儲存環境變數
2. 選擇專案的 **Deployment** 卡片
3. 點擊 **Redeploy**
4. 等待新部署完成（約 2-3 分鐘）

---

## 🔄 資料庫遷移

### 使用 `prisma migrate`

Prisma 提供自動化遷移功能：

```bash
# 1. 進入專案目錄
cd /home/node/.openclaw/workspace/pearl-tea-pos

# 2. 載入環境變數並執行遷移（本地 PostgreSQL）
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pearltea"
npx prisma migrate dev --name init

# 或使用 .env 檔案（已在修改）
npx prisma migrate dev --name init
```

### 使用 `prisma db push`

快速同步 schema 到資料庫（不需要創建遷移檔案）：

```bash
npx prisma db push
```

### 使用 `prisma studio`

視覺化管理資料庫：

```bash
# 啟動 Prisma Studio
npx prisma studio

# 瀏覽開啟的連結（通常是 http://localhost:5555）
```

### 使用 `prisma db seed`

載入初始資料（如果設定）：

```bash
npx prisma db seed
```

---

## 🧪 測試驗證

### 快速測試

```bash
# 1. 檢查本地 PostgreSQL 連線
node tests/simple-test.js

# 2. 或者執行完整測試套件
npm run test
```

### 預期輸出

```
🧪 PearlTea POS - Simple PostgreSQL Database Test

DATABASE_URL: postgresql://postgres:****@localhost:5432/pearltea
✅ Using PostgreSQL adapter

1️⃣ Database Connection
   ✅ Connected to PostgreSQL

2️⃣ User Table Query
   ✅ User table exists with 0 records

3️⃣ Product Table Query
   ✅ Product table exists with 0 records

4️⃣ Category Table Query
   ✅ Category table exists with 0 categories

5️⃣ Order Table Query
   ✅ Order table exists with 0 orders

📊 Summary
   Total:  5
   Passed: 5
   Failed: 0
   Rate:   100.0%

✅ All PostgreSQL tests passed!
```

---

## 🔧 故障排除

### 問題 1: "FATAL: database "pearltea" does not exist"

**解決方案**：

```bash
# 連線到 PostgreSQL
sudo -u postgres psql

# 創建資料庫
CREATE DATABASE pearltea;

# 授予權限
GRANT ALL PRIVILEGES ON DATABASE pearltea TO postgres;

# 離開
\q
```

### 問題 2: "FATAL: password authentication failed for user "postgres""

**解決方案 1 - 修改密碼**:

```bash
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'new_password';
\q
```

然後更新 `.env` 檔案中的密碼。

**解決方案 2 - 啟用 trust auth**:

編輯 `/etc/postgresql/16/main/pg_hba.conf` （更新版本號）：
```conf
local   all             postgres                                trust
```

重啟 PostgreSQL：
```bash
sudo systemctl restart postgresql
```

---

### 問題 3: 连線被拒絕 (Connection refused)

**檢查步驟**：

```bash
# 1. 檢查 PostgreSQL 服務是否啟動
sudo systemctl status postgresql

# 2. 檢查 PostgreSQL 網路設定
sudo netstat -tlnp | grep 5432
# 或
sudo ss -tlnp | grep 5432

# 3. 檢查 firewall 設定
sudo ufw status

# 4. 如果防火牆啟用，開放 PostgreSQL 連接
sudo ufw allow 5432/tcp
```

---

### 問題 4: "permission denied to connect to database"

**解決方案**：

```bash
sudo -u postgres psql

\c pearltea
GRANT CONNECT ON DATABASE pearltea TO pearltea_user;
GRANT ALL ON SCHEMA public TO pearltea_user;
GRANT USAGE ON SCHEMA public TO pearltea_user;
```

---

### 問題 5: Zeabur 部署失敗

**常見原因**：

1. **DATABASE_URL 配置錯誤**
   - 確保複製完整的 connection string
   - 檢查是否有特殊字元需要 URL 編碼

2. **防火牆或安全組規則**
   - Zeabur 自動處理防火牆
   - 確保沒有其他規則阻擋 PostgreSQL 連接

3. **資源不足**
   - PostgreSQL deployment 可能需要一些時間啟動
   - 等待至少 2-3 分鐘後再檢查

**檢查 Zeabur 日誌**：
```
1. 開啟 Zeabur 部署頁面
2. 點擊 Deployment 卡片
3. 查看日誌標籤
4. 搜尋 Prisma 或 PostgreSQL 相關錯誤
```

---

## 📊 性能優化建議

### 本地開發

```sql
-- 增加 PostgreSQL 共享緩存
-- 編輯 /etc/postgresql/16/main/postgresql.conf
shared_buffers = 256MB  -- 根據機器記憶體調整
effective_cache_size = 1GB
```

### 生產環境

使用連線池優化：

```javascript
// 在 app 或 API routes 中
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## 🔄 資料庫備份與還原

### 本地備份

```bash
# 使用 pg_dump 備份
pg_dump -h localhost -U postgres pearltea > backup.sql

# 或備份到遠端
pg_dump -h zheabur-host -U postgres pearltea > backup.zeabur.sql
```

### 還原資料庫

```bash
# 傾入背 Airlinese 功能
psql -h localhost -U postgres pearltea < backup.sql

# 或在 Zeabur 上
zeabur pg:restore < backup.sql
```

---

## ✅ 檢查清單

完成 PostgreSQL 設定後，使用此清單驗證：

- [ ] PostgreSQL 服務正在運行
- [ ] 資料庫 `pearltea` 已創建
- [ ] `.env` 中 `DATABASE_URL` 配置正確
- [ ] Prisma client 成功生成（`npx prisma generate`）
- [ ] `node tests/simple-test.js` 運行成功
- [ ] `npx prisma studio` 可以開啟
- [ ] Zeabur 上的環境變數已正確配置
- [ ] Zeabur 網站可以正常存取

---

## 📞 支援與資源

- **Prisma 文檔**: https://www.prisma.io/docs
- **PostgreSQL 官方文檔**: https://www.postgresql.org/docs
- **Zeabur 文檔**: https://zeabur.com/docs
- **問題回報**: https://github.com/khchents-glitch/pearltea/issues

---

**最後更新**: 2026-05-29
**適用版本**: PearlTea POS v1.0, Prisma 7.x, PostgreSQL 16