#!/bin/bash
set -e

echo "🚀 正在準備推送珍珠奶茶 POS 系統到 GitHub..."

cd /home/node/.openclaw/workspace/pearl-tea-pos

echo "✅ 已在 master 變更為 main 分支"

echo "🔗 Remote URL:"
git remote -v

echo ""
echo "📝 當 git prompt 出現時："
echo "---------------------------------"
echo "Username:  khchents-glitch"
echo "Password:  使用 GitHub Personal Access Token (不是密碼)"
echo "---------------------------------"
echo ""
echo "如果 Token 被拒絕，請建立："
echo "1. 前往: https://github.com/settings/tokens"
echo "2. 點擊 'Generate new token (classic)'"
echo "3. 勾選權限:"
echo "   - repo (完整存取)"
echo "4. 設定 token 名稱 (例如: PearlTeaPOS)"
echo "5. 頂層的 Token 長長的字符串就是密碼"
echo ""
echo "按任意鍵開始推送..."
read -n 1 -s

echo ""
echo "📝 執行 git push..."
git push -u origin main -f

echo ""
echo "🎉 推送成功！"
echo ""
echo "🔗 查看你的 GitHub："
echo "https://github.com/khchents-glitch/pearltea"
echo ""
echo "下一步："
echo "1. 在 Zeabur 前往專案 → Deployment → 新增資源 → Connect GitHub"
echo "2. 選擇 pearl-tea repository"
echo "3. 按照網頁指引完成部署"