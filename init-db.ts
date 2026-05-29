import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('✽ 初始化資料庫...')

  // 清空現有資料
  await prisma.orderItem.deleteMany()
  await prisma.orderOption.deleteMany()
  await prisma.order.deleteMany()
  await prisma.orderStatusHistory.deleteMany()
  await prisma.productOptionItem.deleteMany()
  await prisma.productOption.deleteMany()
  await prisma.product.deleteMany()
  await prisma.productCategory.deleteMany()
  await prisma.user.deleteMany()

  // 建立 Admin
  const adminPwd = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      email: 'admin@pearltea.com',
      password: adminPwd,
      name: '管理員'
    }
  })
  console.log('✓ Admin 帳號: admin@pearltea.com / admin123')

  // 建立 Categories
  const catMap: any = {}
  for (const [name, desc] of Object.entries({
    '珍珠奶茶類': '經典珍珠奶茶系列',
    '水果茶類': '新鮮水果茶系列',
    '小食點心': '配杯小食'
  })) {
    const c = await prisma.productCategory.create({
      data: { name, description: desc }
    })
    catMap[name] = c.id
    console.log(`✓ Category: ${name}`)
  }

  // 建立 Products
  const products = [
    { name: '經典珍珠奶茶', price: 45, categoryId: catMap['珍珠奶茶類'], description: '濃郁茶香，Q彈珍珠' },
    { name: '鮮奶菁茶', price: 50, categoryId: catMap['珍珠奶茶類'], description: '鮮奶搭配菁茶' },
    { name: '可可珍珠奶茶', price: 50, categoryId: catMap['珍珠奶茶類'], description: '巧克力風味' },
    { name: '芋芋珍珠奶茶', price: 50, categoryId: catMap['珍珠奶茶類'], description: '香濃芋頭' },
    { name: '原味波霸奶茶', price: 60, categoryId: catMap['珍珠奶茶類'], description: '大顆波霸，Q彈有嚼勁' },
    { name: '檸檬萊姆茶', price: 50, categoryId: catMap['水果茶類'], description: '清新檸檬' },
    { name: '百香果綠茶', price: 55, categoryId: catMap['水果茶類'], description: '酸甜百香果' },
    { name: '拿鐵', price: 55, categoryId: catMap['小食點心'], description: '意式濃縮+鮮奶' },
    { name: '翡翠拿鐵', price: 55, categoryId: catMap['小食點心'], description: '抹茶拿鐵' },
    { name: '抹茶奶蓋', price: 50, categoryId: catMap['小食點心'], description: '鹹甜奶蓋' },
    { name: '無骨鳳爪', price: 35, categoryId: catMap['小食點心'], description: '軟嫩的鳳爪' },
    { name: '卜肉', price: 45, categoryId: catMap['小食點心'], description: '經典配搭' },
    { name: '雞排', price: 55, categoryId: catMap['小食點心'], description: '炸過的脆皮雞排' },
  ]

  for (const p of products) {
    await prisma.product.create({ data: p })
    console.log(`✓ Product: ${p.name}`)
  }

  console.log('\n✅ 資料庫初始化完成！')
}

main()
  .catch(e => {
    console.error('❌ 失敗:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())