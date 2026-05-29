/**
 * Product Data Seeding Script
 * 建立測試商品資料
 */

const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 PearlTea POS - Seeding Products\n')

  try {
    const categories = []

    // 1. 建立商品類別
    console.log('1️⃣ 建立 Product Categories...')
    const categoryNames = [
      { name: '珍珠奶茶類', description: '經典珍珠奶茶系列' },
      { name: '水果茶類', description: '新鮮水果茶系列' },
      { name: '波霸類', description: '濃郁波霸系列' },
      { name: '咖啡類', description: '精品咖啡系列' },
      { name: '拿鐵類', description: '奶蓋與拿鐵系列' },
      { name: '小食點心', description: '配杯小食' },
    ]

    for (const cat of categoryNames) {
      const category = await prisma.productCategory.upsert({
        where: { name: cat.name },
        update: {},
        create: {
          name: cat.name,
          description: cat.description,
        },
      })
      categories.push(category)
      console.log(`   ✅ ${category.name}`)
    }
    console.log()

    // 2. 建立商品
    console.log('2️⃣ 建立 Products...')
    const products = [
      // 珍珠奶茶類
      { name: '經典珍珠奶茶', price: 45, categoryId: categories[0].id, description: '濃郁茶香，Q彈珍珠' },
      { name: '鮮奶菁茶', price: 50, categoryId: categories[0].id, description: '鮮奶搭配菁茶' },
      { name: '可可珍珠奶茶', price: 50, categoryId: categories[0].id, description: '巧克力風味' },
      { name: '芋芋珍珠奶茶', price: 50, categoryId: categories[0].id, description: '香濃芋頭' },
      { name: '椰子鮮奶茶', price: 50, categoryId: categories[0].id, description: '清爽椰香' },
      { name: '原味波霸奶茶', price: 60, categoryId: categories[2].id, description: '大顆波霸，Q彈有嚼勁' },
      { name: '深炸波霸奶茶', price: 60, categoryId: categories[2].id, description: '濃郁波霸' },

      // 水果茶類
      { name: '檸檬萊姆茶', price: 50, categoryId: categories[1].id, description: '清新檸檬' },
      { name: '百香果綠茶', price: 55, categoryId: categories[1].id, description: '酸甜百香果' },
      { name: '蓮霧蜜桃茶', price: 55, categoryId: categories[1].id, description: '季節限定風味' },
      { name: '芒果冰', price: 55, categoryId: categories[1].id, description: '新鮮芒果' },

      // 咖啡類
      { name: '拿鐵', price: 55, categoryId: categories[3].id, description: '意式濃縮+鮮奶' },
      { name: '卡布奇諾', price: 55, categoryId: categories[3].id, description: '奶泡濃郁' },
      { name: '美式咖啡', price: 35, categoryId: categories[3].id, description: '黑咖啡' },
      { name: '翡翠拿鐵', price: 55, categoryId: categories[3].id, description: '抹茶拿鐵' },
      { name: '焦糖瑪奇朵', price: 55, categoryId: categories[3].id, description: '焦糖奶泡' },

      // 拿鐵類
      { name: '抹茶奶蓋', price: 50, categoryId: categories[4].id, description: '鹹甜奶蓋' },
      { name: '麻糬奶蓋', price: 50, categoryId: categories[4].id, description: 'QQ麻糬添加' },

      // 小食點心
      { name: '無骨鳳爪', price: 35, categoryId: categories[5].id, description: '軟嫩的鳳爪' },
      { name: '卜肉', price: 45, categoryId: categories[5].id, description: '經典配搭' },
      { name: '雞排', price: 55, categoryId: categories[5].id, description: '炸過的脆皮雞排' },
      { name: '鹹酥雞', price: 40, categoryId: categories[5].id, description: '' },
      { name: '地瓜球', price: 30, categoryId: categories[5].id, description: '外酥內軟' },
    ]

    let createdCount = 0
    for (const product of products) {
      const p = await prisma.product.upsert({
        where: { name: product.name },
        update: {},
        create: product,
      })
      createdCount++
      console.log(`   ✅ ${p.name} - $${p.price}`)
    }
    console.log()

    return {
      categoriesCreated: categories.length,
      productsCreated: createdCount,
      categoryDetails: categories.map(cat => ({
        name: cat.name,
        id: cat.id,
      })),
      productDetails: products.map(p => ({
        name: p.name,
        price: p.price,
        categoryId: p.categoryId,
      })),
    }
  } catch (error) {
    console.error('   ❌ 商品建立失敗:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then((data) => {
    console.log('\n🎉 商品資料建立完成！')
    console.log(`   類別：${data.categoriesCreated} 個`)
    console.log(`   商品：${data.productsCreated} 個`)
    console.log()
    console.log('類別列表：')
    data.categoryDetails.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.id.substring(0, 8)}...)`)
    })
    console.log()
    console.log('商品列表：')
    data.productDetails.forEach(prod => {
      console.log(`   - ${prod.name} ($${prod.price})`)
    })
  })
  .catch((err) => {
    console.error('\n❌ 資料植入失敗:', err)
    process.exit(1)
  })