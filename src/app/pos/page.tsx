'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  price: number
  description: string
  categoryId: string
  category: { name: string }
}

export default function POSPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Array<any>>([])
  const [error, setError] = useState('')
  const [showCart, setShowCart] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // 檢查登入狀態
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (!token || !user) {
      router.push('/login')
    }
  }, [router])

  // 載入產品
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (err) {
      console.error('錯誤:', err)
    }
  }

  const addToCart = (product: Product, option?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.option === option)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.option === option
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1, option }]
    })
  }

  const removeFromCart = (id: string, option?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id && (!option || item.option === option))
      if (!existing || existing.quantity <= 1) {
        return prev.filter((item) => !(item.id === id && (!option || item.option === option)))
      }
      return prev.map((item) =>
        item.id === id && item.option === option ? { ...item, quantity: item.quantity - 1 } : item
      )
    })
  }

  const updateQuantity = (id: string, delta: number, option?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id && item.option === option)
      if (!existing) return prev

      const newQuantity = existing.quantity + delta
      if (newQuantity <= 0) {
        return prev.filter((item) => !(item.id === id && item.option === option))
      }
      return prev.map((item) =>
        item.id === id && item.option === option ? { ...item, quantity: newQuantity } : item
      )
    })
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: '客戶',
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            option: item.option,
          })),
        }),
      })

      if (response.ok) {
        setCart([])
        alert('訂單已建立！')
      } else {
        setError('建立訂單失敗')
      }
    } catch (err) {
      setError('伺服器錯誤')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = Array.from(new Set(products.map(p => p.category.name)))

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">珍珠奶茶 POS</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
          >
            登出
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Product Menu */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="搜尋產品..."
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  const catProducts = products.filter(p => p.category.name === cat)
                  setProducts(catProducts)
                }}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition whitespace-nowrap"
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => setProducts(products)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition whitespace-nowrap"
            >
              全部
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer border border-gray-100"
                onClick={() => addToCart(product)}
              >
                <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-pink-500 font-bold mb-2">{product.price} 元</p>
                <p className="text-gray-500 text-sm">{product.description || ''}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        {showCart && (
          <div className="w-96 bg-white border-l overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">購物車</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.option || ''}`}
                  className="flex justify-between items-start bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    {item.option && (
                      <span className="text-xs text-gray-500">{item.option}</span>
                    )}
                    <p className="text-pink-500 font-bold mt-1">{item.price} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1, item.option)}
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1, item.option)}
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg">總共：</span>
                  <span className="text-2xl font-bold text-pink-500">{getTotal()} 元</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-orange-600 transition"
                >
                  結帳
                </button>
              </div>
            )}
          </div>
        )}

        {!showCart && cart.length > 0 && (
          <div className="w-96 bg-white border-l flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">購物車</h2>
              <button
                onClick={() => setShowCart(true)}
                className="text-2xl"
              >
                👁️
              </button>
            </div>

            {cart.map((item) => (
              <div
                key={`${item.id}-${item.option || ''}`}
                className="flex-1 p-4 border-b flex flex-col"
              >
                <h4 className="font-medium text-lg">{item.name}</h4>
                {item.option && (
                  <span className="text-sm text-gray-500">{item.option}</span>
                )}
                <p className="text-pink-500 font-bold text-xl mt-2">{item.price * item.quantity} 元</p>
                <div className="flex justify-center gap-2 mt-auto py-6">
                  <button
                    onClick={() => updateQuantity(item.id, -1, item.option)}
                    className="w-10 h-10 bg-gray-200 rounded-lg text-xl hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-xl font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1, item.option)}
                    className="w-10 h-10 bg-gray-200 rounded-lg text-xl hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}