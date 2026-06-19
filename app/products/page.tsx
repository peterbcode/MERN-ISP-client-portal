'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '../components/navbar'
import SiteFooter from '../components/site-footer'
import AnimatedSection from '../components/ui/animated-section'
import PremiumButton from '../components/ui/premium-button'

type Category = 'all' | 'router' | 'radio' | 'cable' | 'accessory' | 'printer' | 'peripherals'

const products = [
  {
    id: 1,
    name: 'N300 Wireless Series',
    category: 'router' as Category,
    spec: '300 Mbps · 4-port · Wireless N',
    price: 'R 850',
    image: '/images/N300 Wireless series Tenda.png'
  },
  {
    id: 3,
    name: 'Ubiquiti LiteBeam 5AC',
    category: 'radio' as Category,
    spec: '5 GHz · 23 dBi · Point-to-point',
    price: 'R 1 450',
    image: '/images/Ubiquiti LiteBeam 5AC.png'
  },
 { 
  id: 6,
  name: 'RJ45 Ethernet Cable',
  category: 'cable' as Category,
  spec: 'Cat6 · Custom Lengths Available · Various Colours',
  price: 'R35 per meter',
  image: '/images/RJ45 Patch Cable 2 m.png'
 },
  {
    id: 7,
    name: '8-Port Managed Switch',
    category: 'accessory' as Category,
    spec: 'Gigabit · VLAN · PoE+ capable',
    price: 'R 1 650',
    image: '/images/8-Port Managed Switch.png'
  },
  {
    id: 8,
    name: 'PoE Injector 48V',
    category: 'accessory' as Category,
    spec: '802.3af · 15.4 W · Passive option avail.',
    price: 'R 320',
    image: '/images/PoE Injector 48V.avif'
  },
  {
    id: 9,
    name: 'DW Portable Mini DC UPS',
    category: 'accessory' as Category,
    spec: '8800mAh · POE Port · 15V/24V',
    price: 'R 1 200',
    image: '/images/DW Portable Mini UPS 8800mAh PoE.png'
  },
  {
    id: 10,
    name: 'Gaming Headset',
    category: 'peripherals' as Category,
    spec: 'HS-G600V · Vibration Gaming Headset',
    price: 'R500',
    image: '/gallery/hs-g600v-vibration-gaming-headset-genius-original-imahfefdfwxd7fcp.png'
  },
  {
    id: 12,
    name: 'Genius Smart KB-100 Classic USB Keyboard',
    category: 'peripherals' as Category,
    spec: 'USB · Classic · Spill-resistant',
    price: 'R 250',
    image: '/gallery/Genius Smart KB-100 Classic USB Keyboard.png'
  },
  {
    id: 13,
    name: 'Genius DX-120 USB-C Wired Mouse',
    category: 'peripherals' as Category,
    spec: 'USB-C · Wired · Optical',
    price: 'R 95',
    image: '/gallery/genius-dx-120-usb-c-wired-mouse_1200x1200.png'
  },
  {
    id: 11,
    name: 'Canon PIXMA MG2541S - Printers - Canon South Africa',
    category: 'printer' as Category,
    spec: 'Print · Scan · Copy · FINE Cartridge',
    price: 'R 895',
    image: '/gallery/Canon-Printer.png'
  },
  {
    id: 14,
    name: 'Printer Ink Cartridges',
    category: 'printer' as Category,
    spec: 'Tri-Colour · Black · Various models',
    price: 'R 350',
    image: '/gallery/canon-printer-ink-(800x502).png'
  },
  {
    id: 15,
    name: 'Laptops',
    category: 'accessory' as Category,
    spec: 'New & 2nd Hand · Various brands · Warranty available',
    price: 'Contact for pricing',
    image: '/gallery/Laptops.png'
  },
]

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set())

  const categoryParam = searchParams?.get('category')

  useEffect(() => {
    if (categoryParam) {
      const validCategories: Category[] = ['router', 'radio', 'cable', 'accessory', 'printer', 'peripherals']
      if (validCategories.includes(categoryParam as Category)) {
        setSelectedCategory(categoryParam as Category)
      } else {
        setSelectedCategory('all')
      }
    } else {
      setSelectedCategory('all')
    }
  }, [categoryParam])

  const handleCategoryChange = (key: Category) => {
    setSelectedCategory(key)
    if (key === 'all') {
      router.push('/products', { scroll: false })
    } else {
      router.push(`/products?category=${key}`, { scroll: false })
    }
  }

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory)

  const categories: { key: Category; label: string }[] = [
    { key: 'all', label: 'All items' },
    { key: 'router', label: 'Routers' },
    { key: 'radio', label: 'Radios' },
    { key: 'cable', label: 'Cables' },
    { key: 'accessory', label: 'Accessories' },
    { key: 'printer', label: 'Printers' },
    { key: 'peripherals', label: 'PC Peripherals' },
  ]

  const whatsappMessage = (productName: string) =>
    `Hi, interested in ${encodeURIComponent(productName)}`

  const toggleProductSelection = (productId: number) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const bulkWhatsAppMessage = () => {
    const selectedItems = products.filter(p => selectedProducts.has(p.id))
    if (selectedItems.length === 0) return ''
    const itemsList = selectedItems.map(p => `• ${p.name} - ${p.price}`).join('\n')
    return `Hi, I'm interested in ordering multiple items:\n\n${itemsList}\n\nPlease confirm availability and total price.`
  }

  return (
    <>
      <Navbar />
      <main className="site-page text-white">
        {/* Hero Section */}
        <AnimatedSection direction="up" className="site-hero px-4 pb-20 pt-32 text-center sm:px-6 lg:pt-48">
          <div className="relative mx-auto max-w-4xl">
            <p className="site-eyebrow">Hardware Shop</p>
            <h1 className="mt-6 text-5xl font-black leading-[0.9] tracking-[-0.03em] sm:text-6xl lg:text-8xl">
              Equipment &amp; <span className="text-[#ff7e26]">Accessories</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
              Quality hardware — sold over the counter or professionally installed. <a href="https://wa.me/27799381260" target="_blank" rel="noopener noreferrer" className="text-[#ff7e26] hover:underline">WhatsApp us</a> to order.
            </p>
          </div>
        </AnimatedSection>

        {/* Products Section */}
        <section className="py-24 sm:py-32 bg-black/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection direction="up" className="mx-auto max-w-3xl text-center">
              <p className="site-eyebrow">Our Products</p>
              <h2 className="mt-4 text-4xl font-black text-white sm:text-6xl tracking-tight">Browse Hardware</h2>
              <p className="mt-6 text-lg text-zinc-400">
                Routers, radios, cables, and accessories for your network setup.
              </p>
            </AnimatedSection>

            {/* Category Filters */}
            <AnimatedSection direction="up" delay={200} className="mt-12 flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 min-w-[100px] ${selectedCategory === cat.key
                      ? 'bg-[#ff7e26] text-white shadow-lg shadow-[#ff7e26]/30'
                      : 'border border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:border-[#ff7e26] hover:text-white'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </AnimatedSection>

            {/* Bulk Order Button */}
            {selectedProducts.size > 0 && (
              <AnimatedSection direction="up" delay={250} className="mt-8 text-center">
                <div className="inline-flex items-center gap-4 rounded-2xl border border-[#ff7e26]/50 bg-zinc-900/50 px-6 py-3">
                  <span className="text-sm text-zinc-300">{selectedProducts.size} item(s) selected</span>
                  <a
                    href={`https://wa.me/27799381260?text=${encodeURIComponent(bulkWhatsAppMessage())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-[#ff7e26] px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:brightness-110 shadow-lg shadow-[#ff7e26]/20"
                  >
                    Order Selected
                  </a>
                  <button
                    onClick={() => setSelectedProducts(new Set())}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </AnimatedSection>
            )}

            {/* Products Grid */}
            <AnimatedSection direction="up" delay={300} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`site-card group relative rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 border-zinc-800/50 bg-zinc-900/20 ${selectedProducts.has(product.id) ? 'border-[#ff7e26] bg-[#ff7e26]/5' : 'hover:border-[#ff7e26]/50'
                    }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleProductSelection(product.id)}
                    className={`absolute top-4 right-4 z-10 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${selectedProducts.has(product.id)
                        ? 'bg-[#ff7e26] border-[#ff7e26] text-white'
                        : 'border-zinc-600 bg-zinc-900/50 hover:border-[#ff7e26]'
                      }`}
                  >
                    {selectedProducts.has(product.id) && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mb-3">
                    <span className="inline-block rounded-full bg-[#ff7e26]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ff7e26]">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-sm text-zinc-400 mb-4">{product.spec}</p>
                  <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                    <div>
                      <div className="text-xl font-bold text-white">{product.price}</div>
                      <div className="text-[10px] text-zinc-500">incl VAT</div>
                    </div>
                    <a
                      href={`https://wa.me/27799381260?text=${whatsappMessage(product.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-[#ff7e26] px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:brightness-110 shadow-lg shadow-[#ff7e26]/20"
                    >
                      Order
                    </a>
                  </div>
                </div>
              ))}
            </AnimatedSection>

            {/* Note */}
            <AnimatedSection direction="up" delay={400} className="mt-16 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-6 text-center">
              <p className="text-sm text-zinc-400">
                Prices are indicative and subject to stock. All items are subject to availability. Unavailable products can be pre-ordered. <a href="https://wa.me/27799381260" target="_blank" rel="noopener noreferrer" className="text-[#ff7e26] hover:underline">WhatsApp us</a> for exact pricing, bulk orders, or a professional installation quote.
              </p>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <main className="site-page text-white flex min-h-screen items-center justify-center">
          <div className="text-[#ff7e26] font-bold text-lg animate-pulse">Loading products...</div>
        </main>
        <SiteFooter />
      </>
    }>
      <ProductsContent />
    </Suspense>
  )
}
