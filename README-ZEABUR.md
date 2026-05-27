# Zeabur 部署指南 - 推送 GitHub 章節

## 步驟 1：建立 GitHub Personal Access Token

### 1.1 登入 GitHub
前往 https://github.com/login

### 1.2 建立新的 Token
1. 點擊右上角圖示 → **Settings** (設定)
2. 左側選單 **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. 點擊 **Generate new token (classic)**
4. **Note (筆記)**: `PearlTeaPOS Deployment`
5. **Expiration (期限制期)**:
   - 建議選擇 `90 days` (90天)
   - 或 `No expiration` (無限期)
6. **Scopes (權限)**:
   - **必選**: 勾選 `repo` (完整專案存取權限)
   - 其他權限不需要

7. 點擊 **Generate token**

### 1.4 複製並保存 Token
- 點擊 快樂按鈕 複製 token
- **重要**: 這個 token 只會顯示一次，請立即保存到你安全的地方！

Token 的格式像這樣：
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 步驟 2：推送到 GitHub

### 方法 A：使用 HTTPS (推薦)

在終端機執行：

```bash
cd /home/node/.openclaw/workspace/pearl-tea-pos

# 切換到腳本目錄並執行
./push-to-github.sh
```

當出現以下提示時：
```
Username:  khchents-glitch
Password:  (貼上你的 GitHub Token)
```

直接貼上你的 token 即可！

### 方法 B：手動執行 git push

```bash
cd /home/node/.openclaw/workspace/pearl-tea-pos

git push -u origin main
```

當要求輸入時：
- Username (使用者名稱): `khchents-glitch`
- Password (密碼): 貼上你的 GitHub Token (不是 GitHub 密碼！)

---

## ✅ 推送成功的確認

如果看到類似這樣的輸出，表示成功：

```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), X.XX KiB | X.XX MiB/s, done.
To https://github.com/khchents-glitch/pearltea.git
 * [new branch]      main -> main
```

然後造訪：
```
https://github.com/khchents-glitch/pearltea
```

應該可以看到完整的專案檔案！

---

## 🔧 常見問題

**Q: 為何不能用 GitHub 密碼？**
A: GitHub 為了安全，已經停止支援密碼認證，必須使用 Personal Access Token 或 SSH。

**Q: Token 輸入後沒反應？**
A: 輸入密碼時不會顯示任何字元，貼上後直接按 Enter 即可。

**Q: Token 錯誤？**
A: 請確認：
1. Token 認證日誌已關閉（如沒記錯）非必要
2. Token 適當賦予了 `repo` 權限
3. Token 沒有過期

**Q: 無法推送到 GitHub？**
A: 檢查：
1. Token 是否正確
2. Account 認證日誌是否關閉，避免現 GitHub proxy 權限問題影響
3. Network 是否能連接 GitHub https

---

**完成後**，繼續下一步：[Zeabur 部署指南](./zeabur-deployment.md)