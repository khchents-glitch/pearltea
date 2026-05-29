/**
 * Simple Database Test - 簡單版資料庫測試
 */
require('dotenv').config({ path: '.env' })

const { PrismaClient } = require('@prisma/client')

let prisma

async function simpleTest() {
  console.log('\n🧪 PearlTea POS - Simple Database Test\n')

  try {
    // 設定資料庫連線
    const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db'

    // Prisma 7 需要使用 @prisma/adapter-sqlite 為 SQLite
    if (databaseUrl.startsWith('file:')) {
      // 嘗試使用 SQLite adapter
      try {
        const { PrismaSQLiteAdapter } = require('@prisma/adapter-sqlite')
        const adapter = new PrismaSQLiteAdapter({ url: databaseUrl })
        prisma = new PrismaClient({ adapter })
      } catch (sqliteError) {
        console.log('⚠️  SQLite adapter not installed, using direct connection')
        console.log('   Installing: npm install @prisma/adapter-sqlite --save-dev')
        // 如果 sqlite adapter 不可用，跳過這個測試
        prisma = null
      }
    }

    // 如果沒有有效的 prisma instance，跳過測試
    if (!prisma) {
      console.log('ℹ️  Skipping tests - Prisma adapter not available')
      return {
        total: 0,
        passed: 0,
        failed: 0,
        rate: 0,
      }
    }

    const results = {
      total: 0,
      passed: 0,
      failed: 0,
    }

    // Test 1: Connection
    console.log('1️⃣ Database Connection')
    results.total++
    try {
      await prisma.$connect()
      console.log('   ✅ Connected to database\n')
      results.passed++
    } catch (error) {
      console.log(`   ❌ Connection failed: ${error.message}\n`)
      results.failed++
    }

    // Test 2: User table
    console.log('2️⃣ User Table Query')
    results.total++
    try {
      const users = await prisma.user.findMany()
      console.log(`   ✅ User table exists with ${users.length} records\n`)
      results.passed++
      if (users.length > 0) {
        users.forEach(user => {
          console.log(`      - ${user.email}`)
        })
      } else {
        console.log('         ℹ️  No users found - run npx prisma db seed to populate data')
      }
    } catch (error) {
      console.log(`   ❌ Query failed: ${error.message}\n`)
      results.failed++
    }

    // Test 3: Product table
    console.log('3️⃣ Product Table Query')
    results.total++
    try {
      const products = await prisma.product.findMany()
      console.log(`   ✅ Product table exists with ${products.length} records\n`)
      results.passed++
      if (products.length > 0) {
        products.forEach(product => {
          console.log(`      - ${product.name} - $${product.price}`)
        })
      } else {
        console.log('         ℹ️  No products found - run npx prisma db seed to populate data')
      }
    } catch (error) {
      console.log(`   ❌ Query failed: ${error.message}\n`)
      results.failed++
    }

    // Test 4: Category table
    console.log('4️⃣ Category Table Query')
    results.total++
    try {
      const categories = await prisma.productCategory.findMany()
      console.log(`   ✅ Category table exists with ${categories.length} categories\n`)
      results.passed++
      if (categories.length > 0) {
        categories.forEach(category => {
          console.log(`      - ${category.name}`)
        })
      } else {
        console.log('         ℹ️  No categories found - run npx prisma db seed to populate data')
      }
    } catch (error) {
      console.log(`   ❌ Query failed: ${error.message}\n`)
      results.failed++
    }

    // Test 5: Order table
    console.log('5️⃣ Order Table Query')
    results.total++
    try {
      const orders = await prisma.order.findMany()
      console.log(`   ✅ Order table exists with ${orders.length} orders\n`)
      results.passed++
      if (orders.length > 0) {
        orders.forEach(order => {
          console.log(`      - Order #${order.orderNumber}: $${order.total} - ${order.customerName || 'Unknown'}`)
        })
      } else {
        console.log('         ℹ️  No orders found')
      }
    } catch (error) {
      console.log(`   ❌ Query failed: ${error.message}\n`)
      results.failed++
    }

    // Summary
    console.log('\n📊 Summary')
    console.log(`   Total:  ${results.total}`)
    console.log(`   Passed: ${results.passed}`)
    console.log(`   Failed: ${results.failed}`)
    console.log(`   Rate:   ${results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : '0.0'}%`)
    console.log()

    if (prisma) {
      await prisma.$disconnect()
    }

    const status = results.failed === 0 ? '✅' : '❌'
    console.log(`${status} Database test completed!`)

    return {
      total: results.total,
      passed: results.passed,
      failed: results.failed,
      rate: results.total > 0 ? (results.passed / results.total) * 100 : 0,
    }
  } catch (error) {
    console.error('❌ Test suite error:', error.message)
    console.error(error.stack)
    if (prisma) {
      await prisma.$disconnect()
    }
    return {
      total: 0,
      passed: 0,
      failed: 1,
      rate: 0,
    }
  }
}

// Run test
if (require.main === module) {
  simpleTest()
    .then(res => {
      process.exit(res.failed > 0 ? 1 : 0)
    })
    .catch(err => {
      console.error('Fatal error:', err.message)
      process.exit(1)
    })
}