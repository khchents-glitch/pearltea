/**
 * Report Generator - 生成測試報告
 */

export function generateReport(results: any, startTime: number, endTime: number) {
  const duration = ((endTime - startTime) / 1000).toFixed(2)

  // Network Report
  if (results.network.tests) {
    const passed = results.network.tests.filter((t: any) => t.status === 'PASS').length
    const failed = results.network.tests.filter((t: any) => t.status === 'FAIL').length
    const total = results.network.tests.length

    console.log(`🌐 Network Test Results`)
    console.log(`${'-'.repeat(40)}`)
    console.log(`Duration:      ${duration}s`)
    console.log(`Total Tests:   ${total}`)
    console.log(`✅ Passed:     ${passed}`)
    console.log(`❌ Failed:     ${failed}`)
    console.log(`Success Rate:  ${total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0'}%`)
    console.log()
  }

  // Database Report
  if (results.database) {
    console.log(`🗄️  Database Test Results`)
    console.log(`${'-'.repeat(40)}`)
    console.log(`Duration:      ${duration}s`)
    console.log(`Total Tests:   ${results.database.total}`)
    console.log(`✅ Passed:     ${results.database.passed}`)
    console.log(`❌ Failed:     ${results.database.failed}`)
    console.log(`Success Rate:  ${results.database.total > 0 ? ((results.database.passed / results.database.total) * 100).toFixed(1) : '0.0'}%`)

    if (results.database.details) {
      console.log(`\n📊 Model Details:`)
      results.database.details.forEach((detail: any) => {
        const statusEmoji = detail.status === 'PASS' ? '✅' : detail.status === 'FAIL' ? '❌' : '⏭️'
        console.log(`   ${statusEmoji} ${detail.model}: ${detail.message}`)
      })
    }
    console.log()
  }

  // API Report
  if (results.api) {
    const passed = results.api.filter((r: any) => r.status === 'PASS').length
    const failed = results.api.filter((r: any) => r.status === 'FAIL').length
    const skipped = results.api.filter((r: any) => r.status === 'SKIP').length
    const warnings = results.api.filter((r: any) => r.status === 'WARN').length
    const total = results.api.length

    console.log(`🌐 API Test Results`)
    console.log(`${'-'.repeat(40)}`)
    console.log(`Duration:      ${duration}s`)
    console.log(`Total Tests:   ${total}`)
    console.log(`✅ Passed:     ${passed}`)
    console.log(`❌ Failed:     ${failed}`)
    console.log(`⏭️  Skipped:    ${skipped}`)
    console.log(`⚠️  Warnings:   ${warnings}`)
    console.log(`Success Rate:  ${total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0'}%`)

    if (failed > 0) {
      console.log(`\n❌ Failed Endpoints:`)
      results.api
        .filter((r: any) => r.status === 'FAIL')
        .forEach((r: any) => {
          console.log(`   🔴 ${r.method} ${r.endpoint}`)
          console.log(`      → ${r.message}`)
        })
    }
    console.log()
  }
}

/**
 * Generate JSON report for CI/CD integration
 */
export function generateJsonReport(results: any, startTime: number, endTime: number) {
  return {
    timestamp: new Date().toISOString(),
    duration: {
      totalSeconds: ((endTime - startTime) / 1000).toFixed(2),
      startTime,
      endTime,
    },
    network: results.network,
    database: results.database,
    api: results.api,
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      warnings: 0,
      passRate: '0.0',
    },
  }
}