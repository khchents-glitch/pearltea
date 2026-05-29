/**
 * Test Runner - 執行所有測試並生成報告
 */
import { databaseTests } from './database'
import { apiTests } from './api'
import { networkTest } from './network'
import { generateReport } from './report'

async function runAllTests() {
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log('║   🧪 PearlTea POS System - Complete Test Suite           ║')
  console.log('║   PerlPos v1.0 - Test Execution                          ║')
  console.log('╚══════════════════════════════════════════════════════════╝\n')

  const startTime = Date.now()
  const results = {
    network: await networkTest(),
    database: await databaseTests(),
    api: await apiTests(),
  }
  const endTime = Date.now()

  console.log('\n' + '='.repeat(60))
  console.log('📊 COMPREHENSIVE TEST SUMMARY')
  console.log('='.repeat(60) + '\n')

  generateReport(results, startTime, endTime)

  const totalTests =
    (results.network.tests?.length || 0) +
    (results.database?.total || 0) +
    (results.api?.length || 0)
  const totalPassed =
    (results.network.tests?.filter((t: any) => t.status === 'PASS').length || 0) +
    (results.database?.passed || 0) +
    (results.api?.filter((r: any) => r.status === 'PASS').length || 0)
  const totalFailed =
    (results.network.tests?.filter((t: any) => t.status === 'FAIL').length || 0) +
    (results.database?.failed || 0) +
    (results.api?.filter((r: any) => r.status === 'FAIL').length || 0)
  const totalSkipped =
    (results.network.tests?.filter((t: any) => t.status === 'SKIP').length || 0) +
    (results.database?.failed || 0) +
    (results.api?.filter((r: any) => r.status === 'SKIP').length || 0)

  const overallPassRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0.0'
  const duration = ((endTime - startTime) / 1000).toFixed(2)

  console.log(`${'─'.repeat(60)}`)
  console.log(`TOTAL STATISTICS`)
  console.log(`${'─'.repeat(60)}`)
  console.log(`Total Tests:         ${totalTests}`)
  console.log(`✅ Passed:           ${totalPassed}`)
  console.log(`❌ Failed:           ${totalFailed}`)
  console.log(`⏭️  Skipped/Skip:    ${totalSkipped}`)
  console.log(`Success Rate:        ${overallPassRate}%`)
  console.log(`Duration:            ${duration}s\n`)

  console.log(`${'═'.repeat(60)}`)
  console.log(`ACTION REQUIRED`)
  console.log(`${'═'.repeat(60)}\n`)

  if (totalFailed === 0) {
    console.log('✅ All tests passed! 🎉')
    console.log('\n🎉 Your PearlTea POS system is working correctly!')
    console.log('📍 Next steps:')
    console.log('   1. Deploy to Zeabur and test in production')
    console.log('   2. Monitor API performance and database queries')
    console.log('   3. Regularly run these tests after changes\n')
  } else {
    console.log('❌ Some tests failed. Please review the errors above.')
    console.log('\n🔧 Troubleshooting:')
    console.log('   1. Check database connection status')
    console.log('   2. Verify API server is running')
    console.log('   3. Review error logs in test results')
    console.log('   4. Check environment variables and configuration")
    console.log('   5. Ensure all dependencies are installed\n') // Fixed missing closing quote
  }

  console.log(`${'═'.repeat(60)}\n`)

  // Return exit code based on results
  process.exit(totalFailed > 0 ? 1 : 0)
}

// Handle gracefully exit
process.on('SIGINT', async () => {
  console.log('\n\n⏸️  Tests interrupted by user')
  process.exit(1)
})

runAllTests().catch((error: any) => {
  console.error('\n❌ Fatal error running test suite:', error.message)
  console.error(error.stack)
  process.exit(1)
})