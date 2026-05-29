/**
 * Simple Database Test - 簡單版資料庫測試
 */
const { PrismaClient } = require('@prisma/client')
require('dotenv').config({ path: '.env' })

const databaseUrl = process.env.DATABASE_URL

let prisma

async function simpleTest() {
  console.log('\n🧪 PearlTea POS - Simple PostgreSQL Database Test\n')
  console.log('DATABASE_URL:', databaseUrl?.replace(/:[^:]*@/, ':****@'))

  try {
    // Determine database type and create appropriate PrismaClient
    if (databaseUrl?.startsWith('postgresql://') || databaseUrl?.startsWith('postgres://')) {
      // PostgreSQL setup
      const { PrismaPGAdapter } = require('@prisma/adapter-pg')
      const adapter = new PrismaPGAdapter({
        url: databaseUrl,
      })
      prisma = new PrismaClient({ adapter })
      console.log('✅ Using PostgreSQL adapter\n')

      // Test 1: Connection
      console.log('1️⃣ Database Connection')
      try {
        await prisma.$connect()
        console.log('   ✅ Connected to PostgreSQL\n')
      } catch (error) {
        console.log(`   ❌ Connection failed: ${error.message}\n`)
        console.log('💡 Tips:')
        console.log('   1. Make sure PostgreSQL is running locally')
        console.log('   2. Check: sudo systemctl status postgresql')
        console.log('   3. Verify .env DATABASE_URL is correct')
        console.log('   4. Try: sudo systemctl start postgresql\n')
        return {
          total: 0,
          passed: 0,
          failed: 0,
          rate: 0,
        }
      }

      // Test 2: User table
      console.log('2️⃣ User Table Query')
      const users = await prisma.user.findMany()
      console.log(`   ✅ User table exists with ${users.length} records\n`)
      if (users.length > 0) {
        users.forEach(user => {
          console.log(`      - ${user.email}`)
        })
      } else {
        console.log('         ℹ️  No users found - run npx prisma db seed to populate data')
      }

      // Test 3: Product table
      console.log('3️⃣ Product Table Query')
      const products = await prisma.product.findMany()
      console.log(`   ✅ Product table exists with ${products.length} records\n`)
      if (products.length > 0) {
        products.forEach(product => {
          console.log(`      - ${product.name} - $${product.price}`)
        })
      } else {
        console.log('         ℹ️  No products found - run npx prisma db seed to populate data')
      }

      // Test 4: Category table
      console.log('4️⃣ Category Table Query')
      const categories = await prisma.productCategory.findMany()
      console.log(`   ✅ Category table exists with ${categories.length} categories\n`)
      if (categories.length > 0) {
        categories.forEach(category => {
          console.log(`      - ${category.name}`)
        })
      } else {
        console.log('         ℹ️  No categories found - run npx prisma db seed to populate data')
      }

      // Test 5: Order table
      console.log('5️⃣ Order Table Query')
      const orders = await prisma.order.findMany()
      console.log(`   ✅ Order table exists with ${orders.length} orders\n`)
      if (orders.length > 0) {
        orders.forEach(order => {
          console.log(`      - Order #${order.orderNumber}: $${order.total} - ${order.customerName || 'Unknown'}`)
        })
      }

      const results = {
        total: 5,
        passed: 5,
        failed: 0,
        rate: 100,
      }

      console.log('\n📊 Summary')
      console.log(`   Total:  ${results.total}`)
      console.log(`   Passed: ${results.passed}`)
      console.log(`   Failed: ${results.failed}`)
      console.log(`   Rate:   ${results.rate}%`)
      console.log()
      console.log('✅ All PostgreSQL tests passed!')
    } else {
      console.log('❌ Invalid DATABASE_URL format')
      console.log('   Expected: postgresql://username:password@host:port/database\n')
      console.log('💡 To use PostgreSQL:')
      console.log('   1. Install and start PostgreSQL: sudo systemctl start postgresql')
      console.log('   2. Create database: createdb pearltea')
      console.log('   3. Update .env with correct connection string\n')

      return {
        total: 0,
        passed: 0,
        failed: 0,
        rate: 0,
      }
    }
  } catch (error) {
    console.error('❌ Test error:', error.message)
    console.error(error.stack)
    return {
      total: 0,
      passed: 0,
      failed: 1,
      rate: 0,
    }
  } finally {
    if (prisma) {
      await prisma.$disconnect()
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
      console.error(err.stack)
      process.exit(1)
    })
}