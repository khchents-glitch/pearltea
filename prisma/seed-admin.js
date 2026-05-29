/**
 * Admin Account & Sample Data Seeding Script
 * 建立管理員帳號與測試商品資料
 */

const { PrismaClient, Prisma } = require('@prisma/client')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const prisma = new PrismaClient()
const SALT_ROUNDS = 10

async function main() {
  console.log('🧪 PearlTea POS - Seeding Data\n')

  try {
    // 1. 建立 Admin User
    console.log('1️⃣ 建立 Admin 帳號...')
    const adminPassword = await bcrypt.hash('admin123', SALT_ROUNDS)

    const admin = await prisma.user.upsert({
      where: { email: 'admin@pearltea.com' },
      update: {},
      create: {
        email: 'admin@pearltea.com',
        password: adminPassword,
        name: '管理員',
      },
    })
    console.log('   ✅ Admin 帳號建立成功')
    console.log('   - Email:', admin.email)
    console.log('   - Password: admin123')
    console.log()

    return {
      adminCreated: true,
      adminEmail: admin.email,
      adminPassword: 'admin123',
    }
  } catch (error) {
    console.error('   ❌ Admin 帳號建立失敗:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then((data) => {
    console.log('\n🎉 Admin 帳號建立完成！')
    console.log('可以使用下列資訊登入：')
    console.log(`   Email: ${data.adminEmail}`)
    console.log(`   Password: ${data.adminPassword}`)
  })
  .catch((err) => {
    console.error('\n❌ 植入失敗:', err)
    process.exit(1)
  })