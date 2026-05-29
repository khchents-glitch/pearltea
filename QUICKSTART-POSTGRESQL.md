# 🚀 PostgreSQL 快速啟動指南

## 📝 3 步啟動 PostgreSQL

### 方法 1: 使用自動腳本（最簡單）

```bash
cd /home/node/.openclaw/workspace/pearl-tea-pos

# 執行自動設置腳本
chmod +x scripts/setup-postgres.sh
./scripts/setup-postgres.sh
```

這個腳本會：
- ✅ 檢查並啟動 PostgreSQL
- ✅ 創建資料庫和用戶
- ✅ 更新 `.env` 檔案
- ✅ 生成 Prisma Client
- ✅ 推送 schema 到資料庫
- ✅ 執行測試

---

### 方法 2: 手動設置

#### 步驟 1: 安裝 PostgreSQL

**Ubuntu/Debian**:
```bash
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl start postgresql
```

**macOS**:
```bash
brew install postgresql@17
brew services start postgresql@17
```

**Docker**:
```bash
docker run --name pearltea-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=pearltea \
  -p 5432:5432 \
  -d postgres:16-alpine
```

#### 步驟 2: 創建資料庫

```bash
sudo -u postgres psql <<EOF
CREATE DATABASE pearltea;
CREATE USER pearltea_user WITH PASSWORD 'pearltea_password';
GRANT ALL PRIVILEGES ON DATABASE pearltea TO pearltea_user;
\c pearltea
GRANT ALL ON SCHEMA public TO pearltea_user;
\q
EOF
```

#### 步驟 3: 配置環境變數

更新 `.env` 檔案：
```bash
DATABASE_URL="postgresql://pearltea_user:pearltea_password@localhost:5432/pearltea"
```

---

## 🧪 驗證安裝

### 快速測試

```bash
# 方法 1: 簡單測試
node tests/simple-test.js

# 方法 2: 生成 Prisma Client
npx prisma generate

# 方法 3: 開啟 Prisma Studio
npm run db:studio
```

### 預期輸出

```
🧪 PearlTea POS - Simple PostgreSQL Database Test

DATABASE_URL: postgresql://pearltea_user:****@localhost:5432/pearltea
✅ Using PostgreSQL adapter

1️⃣ Database Connection
   ✅ Connected to PostgreSQL

✅ All PostgreSQL tests passed!
```

---

## 📊 常用命令

### 啟動/停止

```bash
# 啟動 PostgreSQL
sudo systemctl start postgresql  # 系統服務
brew services start postgresql@17  # macOS
docker start pearltea-postgres  # Docker
```

### 檢查狀態

```bash
# 檢查服務狀態
sudo systemctl status postgresql
psql -h localhost -U postgres -d pearltea -c "SELECT version();"
```

### 資料庫操作

```bash
# 連接到資料庫
psql -h localhost -U pearltea_user -d pearltea

# 列出所有資料庫
sudo -u postgres psql -c "\l"

# 列出所有表格
sudo -u postgres psql -d pearltea -c "\dt"

# 導出資料庫
pg_dump -h localhost -U pearltea_user pearltea > backup.sql

# 導入資料庫
psql -h localhost -U pearltea_user -d pearltea < backup.sql
```

### Prisma 命令

```bash
# 生成 Client
npx prisma generate

# 推送 Schema 到資料庫
npx prisma db push

# 創建遷移
npx prisma migrate dev --name init

# 部署遷移到生產環境
npx prisma migrate deploy

# 開啟 Prisma Studio（視覺化管理）
npx prisma studio
```

---

## 🔌 Zeabur 配置

### 在 Zeabur 上建立 PostgreSQL

1. 登入 Zeabur: https://zeabur.com
2. 開啟您的 **PearlTeaPOS** 專案
3. 點擊 **"Add Resource"**
4. 選擇 **"Databases"** → **"PostgreSQL"**
5. 點擊 **"Deploy"**

### 設定環境變數

在 Zeabur 的 **Settings** → **Environment Variables** 新增：

```
Key: DATABASE_URL
Value: postgresql://your_user:your_password@your-host.zeabur.app:5432/your_db
```

### Zeabur 獲取連線資訊

1. 選擇 PostgreSQL deployment
2. 點擊 **"Connection"**
3. 複製連線字串（Connection String）
4. 粘貼到環境變數

---

## ❓ 常見問題

### 問題：連線被拒絕（Connection refused）

```bash
# 檢查 PostgreSQL 是否啟動
sudo systemctl status postgresql

# 如果未啟動
sudo systemctl start postgresql
```

### 問題：認證失敗（password authentication failed）

```bash
# 重設密碼
sudo -u postgres psql
ALTER USER pearltea_user WITH PASSWORD 'new_password';
\q
```

然後更新 `.env` 中的密碼。

### 問題：無法連接到資料庫

```bash
# 檢查防火�設定
sudo ufw status
sudo ufw allow 5432

# 使用 psql 直接測試
psql -h localhost -U pearltea_user -d pearltea
```

### 問題：Prisma Client 生成失敗

```bash
# 刪除舊的執行檔
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client

# 重新安裝
npm install
npx prisma generate
```

---

## 📚 更多資訊

- **完整指南**: `POSTGRESQL-GUIDE.md`
- **測試指南**: `TESTING-GUIDE.md`
- **Zeabur 部署**: `ZEABUR-DEPLOYMENT.md`

---

**最後更新**: 2026-05-29
**適用版本**: PearlTea POS v1.0, PostgreSQL 16