import prisma from '@/lib/db'

export async function GET() {
  try {
    await prisma.$connect()
    console.log('[TEST] SQLite DB connected')

    const categories = await prisma.productCategory.findMany()
    const products = await prisma.product.findMany({
      include: { category: true },
    })

    return NextResponse.json({
      categories: categories.map(c => ({ id: c.id, name: c.name })),
      products: products.map(p => ({ id: p.id, name: p.name, price: p.price, category: p.category?.name })),
      message: 'SQLite test successful',
    })
  } catch (error) {
    console.error('SQLite test error:', error)
    return NextResponse.json({
      error: 'Connection failed',
      detail: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}