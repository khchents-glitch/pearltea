/**
 * Simple Database Test - 簡單版資料庫測試
 */
const { PrismaClient } = require('@prisma/client')
require('dotenv').config({ path: '.env' })

let prisma

async function simpleTest() {
  console.log('\n🧪 PearlTea POS - Simple Database Test\n')

  try {
    // Load environment variables
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      console.log('❌ DATABASE_URL is not set')
      console.log('💡 Set DATABASE_URL in .env file')
      return {
        total: 0,
        passed: 0,
        failed: 1,
        rate: 0,
      }
    }

    console.log('DATABASE_URL:', databaseUrl.replace(/:[^:]*@/, ':****@'))

    // Create PrismaClient with datasource configuration
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    })

    // Test 1: Connection
    console.log('1️⃣ Database Connection')
    try {
      await prisma.$connect()
      console.log('   ✅ Connected successfully\n')
    } catch (error) {
      console.log(`   ❌ Connection failed: ${error.message}\n`)
      console.log('💡 Troubleshooting:')
      console.log('   1. Check if database exists: sudo psql -U postgres -l')
      console.log('   2. Verify DATABASE_URL format')
      console.log('   3. Check PostgreSQL service: sudo systemctl status postgresql\n')
      return {
        total: 0,
        passed: 0,
        failed: 1,
        rate: 0,
      }
    }

    // Test 2: User model
    console.log('2️⃣ User Model')
    try {
      const users = await prisma.user.findMany()
      console.log(`   ✅ Database connection works! Found ${users.length} users\n`)
      results.passed++
    } catch (error) {
      console.log(`   ❌ User query failed: ${error.message}\n`)
      results.failed++
    }

    // Test 3: Product model
    console.log('3️⃣ Product Model')
    try {
      const products = await prisma.product.findMany()
      console.log(`   ✅ Product table exists! Found ${products.length} products\n`)
      results.passed++
    } catch (error) {
      console.log(`   ❌ Product query failed: ${error.message}\n`)
      results.failed++
    }

    // Test 4: Category model
    console.log('4️⃣ Category Model')
    try {
      const categories = await prisma.productCategory.findMany()
      console.log(`   ✅ Category table exists! Found ${categories.length} categories\n`)
      results.passed++
    } catch (error) {
      console.log(`   ❌ Category query failed: ${error.message}\n`)
      results.failed++
    }

    // Test 5: Order model
    console.log('5️⃣ Order Model')
    try {
      const orders = await prisma.order.findMany()
      console.log(`   ✅ Order table exists! Found ${orders.length} orders\n`)
      results.passed++
    } catch (error) {
      console.log(`   ❌ Order query failed: ${error.message}\n`)
      results.failed++
    }

    const results = {
      total: 5,
      passed: results.passed,
      failed: results.failed,
      rate: results.total > 0 ? ((results.passed / results.total) * 100) : 0,
    }

    console.log('\n📊 Summary')
    console.log(`   Total:  ${results.total}`)
    console.log(`   Passed: ${results.passed}`)
    console.log(`   Failed: ${results.failed}`)
    console.log(`   Rate:   ${results.rate}%`)
    console.log()

    if (results.passed === results.total) {
      console.log('✅ All database tests passed!')
    } else {
      console.log(`⚠️  ${results.failed} test(s) failed`)
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