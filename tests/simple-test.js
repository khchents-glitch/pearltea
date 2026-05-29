/**
 * Simple Database Test - 簡單版資料庫測試
 */
const { PrismaClient } = require('@prisma/client')
const path = require('path')

const prisma = new PrismaClient()

async function simpleTest() {
  console.log('\n🧪 PearlTea POS - Simple Database Test\n')

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
    users.forEach(user => {
      console.log(`      - ${user.email}`)
    })
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
    products.forEach(product => {
      console.log(`      - ${product.name} (ID: ${product.id})`)
    })
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

  await prisma.$disconnect()

  return {
    total: results.total,
    passed: results.passed,
    failed: results.failed,
    rate: results.total > 0 ? (results.passed / results.total) * 100 : 0,
  }
}

// Run test
if (require.main === module) {
  simpleTest()
    .then(res => {
      console.log(res.failed > 0 ? '❌ Some tests failed' : '✅ All tests passed!')
      process.exit(res.failed > 0 ? 1 : 0)
    })
    .catch(err => {
      console.error('Error:', err.message)
      process.exit(1)
    })
}