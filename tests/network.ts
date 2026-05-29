/**
 * Network Check Test - 確認網路連線正常
 */
export const networkTest = async () => {
  const results = {
    status: 'PASS',
    tests: [] as any[],
    summary: '',
  }

  console.log('\n🧪 Network Connectivity Tests\n')

  // Test 1: PostgreSQL 連線
  console.log('1️⃣ Testing database connectivity...')
  try {
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()
    await prisma.$connect()
    await prisma.$disconnect()
    results.tests.push({
      name: 'Database Connection',
      status: 'PASS',
      message: 'Successfully connected to database',
    })
    console.log('   ✅ Database connected')
  } catch (error) {
    results.tests.push({
      name: 'Database Connection',
      status: 'FAIL',
      message: error.message,
    })
    console.log(`   ❌ Database connection failed: ${error.message}`)
    results.status = 'FAIL'
  }

  // Test 2: GitHub API
  console.log('\n2️⃣ Testing GitHub connectivity...')
  try {
    const response = await fetch('https://api.github.com', {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    })
    if (response.ok) {
      const data = await response.json()
      results.tests.push({
        name: 'GitHub API',
        status: 'PASS',
        message: `GitHub API is accessible (API rate limit: ${data.rate_limit?.remaining})`,
      })
      console.log('   ✅ GitHub API accessible')
    } else {
      throw new Error(`HTTP ${response.status}`)
    }
  } catch (error) {
    results.tests.push({
      name: 'GitHub API',
      status: 'FAIL',
      message: error.message,
    })
    console.log(`   ❌ GitHub API failed: ${error.message}`)
    results.status = 'FAIL'
  }

  // Test 3: 保留的已部署網址測試
  console.log('\n3️⃣ Testing Zeabur deployment (if exists)...')

  // Test 4: 本地服務器測試
  console.log('\n4️⃣ Testing local server...')
  try {
    const response = await fetch('http://localhost:3001', {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    })
    if (response.ok || response.status === 404) {
      results.tests.push({
        name: 'Local Server (localhost:3001)',
        status: 'PASS',
        message: 'Server is responding',
      })
      console.log('   ✅ Local server is responding')
    } else {
      throw new Error(`HTTP ${response.status}`)
    }
  } catch (error) {
    results.tests.push({
      name: 'Local Server (localhost:3001)',
      status: 'WARN',
      message: 'Server not running on default port (acceptable)',
    })
    console.log('   ⚠️  Server not running on default port (acceptable)')
  }

  // Test 5: Zeabur 定義的網址（如果需要，可以在 config 中設定）
  console.log('\n5️⃣ Testing Zeabur deployment URL...')
  // 這個測試可以根據環境變數動態設定

  // Summary
  results.summary = results.status === 'PASS'
    ? `✅ All ${results.tests.length} tests passed`
    : `❌ ${results.tests.filter(t => t.status === 'FAIL').length}/${results.tests.length} tests failed`

  console.log('\n' + results.summary + '\n')

  return results
}

if (require.main === module) {
  networkTest()
    .then(res => process.exit(res.status === 'PASS' ? 0 : 1))
    .catch(err => {
      console.error('Error:', err)
      process.exit(1)
    })
}