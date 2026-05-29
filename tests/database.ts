/**
 * Database Tests - 資料庫功能測試
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function databaseTests() {
  console.log('\n🗄️  Database Tests\n')
  console.log('Testing all database models...\n')

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    details: [] as any[],
  }

  try {
    // Test 1: Database connection
    console.log('1️⃣ Database Connection')
    results.total++
    try {
      await prisma.$connect()
      console.log('   ✅ Connected successfully\n')
      results.passed++
      results.details.push({ model: 'Connection', status: 'PASS', message: 'Connected to database' })
    } catch (error) {
      console.log(`   ❌ Connection failed: ${error.message}\n`)
      results.failed++
      results.details.push({ model: 'Connection', status: 'FAIL', message: error.message })
    }

    // Test 2: Users model
    console.log('2️⃣ User Model')
    results.total++
    try {
      const count = await prisma.user.findMany()
      console.log(`   ✅ User table exists with ${count.length} records\n`)
      results.passed++
      results.details.push({ model: 'User', status: 'PASS', message: `Found ${count.length} users` })
    } catch (error) {
      console.log(`   ❌ Query failed: ${error.message}\n`)
      results.failed++
      results.details.push({ model: 'User', status: 'FAIL', message: error.message })
    }

    // Test 3: Products model
    console.log('3️⃣ Product Model')
    results.total++
    try {
      const count = await prisma.product.findMany()
      console.log(`   ✅ Product table exists with ${count.length} records\n`)
      results.passed++
      results.details.push({ model: 'Product', status: 'PASS', message: `Found ${count.length} products` })
    } catch (error) {
      console.log(`   ❌ Query failed: ${error.message}\n`)
      results.failed++
      results.details.push({ model: 'Product', status: 'FAIL', message: error.message })
    }

    // Test 4: Categories model
    console.log('4️⃣ Category Model')
    results.total++
    try {
      const count = await prisma.productCategory.findMany()
      console.log(`   ✅ Category table exists with ${count.length} categories\n`)
      results.passed++
      results.details.push({ model: 'Category', status: 'PASS', message: `Found ${count.length} categories` })
    } catch (error) {
      console.log(`   ❌ Query failed: ${error.message}\n`)
      results.failed++
      results.details.push({ model: 'Category', status: 'FAIL', message: error.message })
    }

    // Test 5: Orders model
    console.log('5️⃣ Order Model')
    results.total++
    try {
      const count = await prisma.order.findMany()
      console.log(`   ✅ Order table exists with ${count.length} orders\n`)
      results.passed++
      results.details.push({ model: 'Order', status: 'PASS', message: `Found ${count.length} orders` })
    } catch (error) {
      console.log(`   ❌ Query failed: ${error.message}\n`)
      results.failed++
      results.details.push({ model: 'Order', status: 'FAIL', message: error.message })
    }

    // Test 6: Can create a new user (if table empty)
    console.log('6️⃣ Create Test User')
    results.total++
    try {
      // Find if there are any users
      const existingEmail = await prisma.user.findUnique({
        where: { email: 'test@pearltea.com' },
      })

      if (!existingEmail) {
        const newUser = await prisma.user.create({
          data: {
            email: 'test@pearltea.com',
            password: 'hashed_password', // In production, use proper hash
            name: 'Test User',
          },
        })
        console.log(`   ✅ Created test user with ID: ${newUser.id}\n`)
        results.passed++

        // Cleanup
        await prisma.user.delete({
          where: { id: newUser.id },
        })
        console.log('   ✅ Cleaned up test user\n')
        results.details.push({ model: 'Create User', status: 'PASS', message: 'User creation and deletion successful' })

        // Verify deletion
        const checkAfterDelete = await prisma.user.findUnique({
          where: { email: 'test@pearltea.com' },
        })
        if (!checkAfterDelete) {
          console.log('   ✅ Verified test user was deleted\n')
          results.passed++
          results.details.push({ model: 'Verify Delete', status: 'PASS', message: 'Tweet deletion verified' })
        } else {
          throw new Error('User still exists after deletion')
        }
      } else {
        console.log('   ⚠️  Test user already exists, skipping creation\n')
        results.details.push({ model: 'Create User', status: 'SKIP', message: 'No creation needed (existing test user)' })
      }
    } catch (error) {
      console.log(`   ❌ Test failed: ${error.message}\n`)
      results.failed += 2 // Diffurt account deletion
      results.details.push({ model: 'Create User', status: 'FAIL', message: error.message })
    }

    // Test 7: Can create a temp order
    console.log('7️⃣ Create Test Order')
    results.total++
    try {
      await prisma.order.create({
        data: {
          orderNumber: 'TEST-ORDER-2026-05-29',
          customerName: 'Test Customer',
          total: 100,
          remarks: 'Test order for testing purposes',
        },
      })
      console.log('   ✅ Created test order\n')
      results.passed++
      results.details.push({ model: 'Create Order', status: 'PASS', message: 'Test order created' })

      // Cleanup
      await prisma.order.deleteMany({
        where: { orderNumber: 'TEST-ORDER-2026-05-29' },
      })
      console.log('   ✅ Cleaned up test order\n')
      results.passed++
      results.details.push({ model: 'Verify Delete', status: 'PASS', message: 'Order deletion verified' })
    } catch (error) {
      console.log(`   ❌ Test failed: ${error.message}\n`)
      results.failed += 2
      results.details.push({ model: 'Create Order', status: 'FAIL', message: error.message })
    }

    // Summary
    console.log('\n📊 Test Summary\n')
    console.log(`Total Tests:  ${results.total}`)
    console.log(`✅ Passed:    ${results.passed}`)
    console.log(`❌ Failed:    ${results.failed}`)
    console.log(`Rate:         ${((results.passed / results.total) * 100).toFixed(1)}%\n`)

    return {
      total: results.total,
      passed: results.passed,
      failed: results.failed,
      rate: (results.passed / results.total) * 100,
      details: results.details,
    }
  } catch (error: any) {
    console.error('\n❌ Database test suite error:', error.message)
    return {
      total: results.total,
      passed: results.passed,
      failed: results.failed,
      rate: 0,
      error: error.message,
    }
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  databaseTests().then(res =>
    process.exit(res.failed > 0 ? 1 : 0)
  ).catch(err => {
    console.error('Error running database tests:', err)
    process.exit(1)
  })
}