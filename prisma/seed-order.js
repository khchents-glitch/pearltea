/**
 * Order Seeding Script
 * 建立完整的銷售測試資料（訂單 + 訂單明細）
 */

const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 PearlTea POS - Creating Sales Order\n')

  try {
    // 1. 驗證 Admin User 存在
    console.log('1️⃣ 驗證 Admin 帳號...')
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@pearltea.com' },
      select: { id: true, email: true }
    })

    if (!admin) {
      throw new Error('Admin 帳號不存在，請先執行 npm run db:seed:admin')
    }
    console.log('   ✅ Admin 帳號: ' + admin.email)
    console.log()

    // 2. 準備商品資料
    console.log('2️⃣ 準備商品資料...')
    const products = await prisma.product.findMany({
      take: 5,
      orderBy: { price: 'asc' }
    })

    if (products.length === 0) {
      throw new Error('商品不存在，請先執行 npm run db:seed:products')
    }

    console.log(`   找到 ${products.length} 個商品：`)
    products.forEach((p, index) => {
      console.log(`   ${index + 1}. ${p.name} - $${p.price}`)
    })
    console.log()

    // 3. 建立 Order 訂單
    console.log('3️⃣ 建立 Order 訂單...')
    const subtotal = products.reduce((sum, p) => sum + (p.price * 2), 0) // 訂購 2 份
    const tax = subtotal * 0.05 // 5% 稅金
    const total = subtotal + tax

    const order = await prisma.order.create({
      data: {
        userId: admin.id,
        subtotal: subtotal,
        tax: tax,
        total: total,
        status: 'completed', // completed, pending, cancelled
        checkedIn: new Date(), // 入座時間
        items: {
          create: products.map((p, index) => ({
            productId: p.id,
            quantity: 2, // 每個商品買 2 份
            optionIron: index % 2 === 0 ? '濃縮' : '正常',
            optionMilk: index % 2 === 0 ? '全脂' : '脫脂',
            optionIce: index % 2 === 0 ? '少冰' : '去冰',
            _optionSugar: (index % 2 === 0 ? '50%' : '100%'),
            optionTeaColor: index % 2 === 0 ? '菁茶' : '綠茶',
            optionExtras: index % 2 === 0 ? '加珍珠' : '加波霸',
            _extrasPrice: index % 2 === 0 ? 5 : 0, // 加價
            price: p.price + (index % 2 === 0 ? 5 : 0), // 原價 + 加價
            notes: index === 0 ? '{{customer}} 喜歡喝無糖' : '外帶'
          }))
        }
      },
      include: {
        user: {
          select: { email: true, name: true }
        },
        items: {
          include: {
            product: {
              select: { name: true, price: true }
            }
          }
        }
      }
    })

    console.log('   ✅ 訂單建立成功')
    console.log(`   訂單編號: ${order.id}`)
    console.log(`   客戶: ${order.user.name || order.user.email}`)
    console.log(`   訂單狀態: ${order.status}`)
    console.log(`   總金額: NT$${order.total.toFixed(2)}`)
    console.log()

    return {
      order: {
        id: order.id,
        total: order.total,
        status: order.status,
        itemCount: order.items.length
      },
      items: order.items.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        options: {
          iron: item.optionIron,
          milk: item.optionMilk,
          ice: item.optionIce,
          sugar: item._optionSugar || '-',
          teaColor: item.optionTeaColor,
          extras: item.optionExtras || '-',
          extrasPrice: item._extrasPrice,
          finalPrice: item.price
        },
        subtotal: (item.price * item.quantity).toFixed(2)
      })),
      summary: {
        subtotal: order.subtotal.toFixed(2),
        tax: order.tax.toFixed(2),
        total: order.total.toFixed(2)
      }
    }
  } catch (error) {
    console.error('   ❌ 建立訂單失敗:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then((data) => {
    console.log('\n🎉 銷售資料建立完成！\n')
    console.log('📦 訂單資訊')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`訂單 ID:     ${data.order.id.substring(0, 18)}...`)
    console.log(`客戶:        ${data.order.items.length > 0 ? data.order.items[0].productName.split(' ')[0] : 'Admin User'}`)
    console.log(`訂單狀態:    ${data.order.status}`)
    console.log(`商品數量:    ${data.order.itemCount} 個`)
    console.log(`總金額:      NT$${data.order.total.toFixed(2)}`)
    console.log()

    console.log('📋 訂單明細')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    data.items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.productName}`)
      console.log(`   數量: ${item.quantity} 份`)
      console.log(`   售價: NT$${item.options.finalPrice}`)
      console.log('   選項:')
      console.log(`      - 溫度: ${item.options.iron}`)
      console.log(`      - 牛奶: ${item.options.milk}`)
      console.log(`      - 冰量: ${item.options.ice}`)
      console.log(`      - 糖度: ${item.options.sugar}`)
      console.log(`      - 茶顏色: ${item.options.teaColor}`)
      console.log(`      - 配件: ${item.options.extras}`)
      if (item.options.extrasPrice > 0) {
        console.log(`      - 配件加價: +NT$${item.options.extrasPrice}`)
      }
      console.log(`   小計: NT$${item.subtotal}`)
      console.log()
    })

    console.log('💰 計算金額')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`小計:        NT$${data.summary.subtotal}`)
    console.log(`稅金 (5%):   NT$${data.summary.tax}`)
    console.log(`總計:        NT$${data.summary.total}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log()

    console.log('🚀 相關 API 測試命令')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('查看訂單列表：')
    console.log(`  curl https://你的網址/api/orders`)
    console.log()
    console.log('查看特定訂單（替換訂單ID）：')
    console.log(`  curl https://你的網址/api/orders/${data.order.id}`)
    console.log()
    console.log('查看訂單明細：')
    console.log(`  curl https://你的網址/api/orders/${data.order.id}/items`)
    console.log()
  })
  .catch((err) => {
    console.error('\n❌ 銷售資料建立失敗:', err)
    process.exit(1)
  })