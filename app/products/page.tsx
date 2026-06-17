'use client'

import { useState } from 'react'
import Navbar from '../components/navbar'
import SiteFooter from '../components/site-footer'
import AnimatedSection from '../components/ui/animated-section'
import PremiumButton from '../components/ui/premium-button'

type Category = 'all' | 'router' | 'radio' | 'cable' | 'accessory'

const products = [
  {
    id: 1,
    name: 'N300 Wireless Series',
    category: 'router' as Category,
    spec: '300 Mbps · 4-port · Wireless N',
    price: 'R 850',
    image: '/images/N300 Wireless series Tenda.jpg'
  },
  {
    id: 3,
    name: 'Ubiquiti LiteBeam 5AC',
    category: 'radio' as Category,
    spec: '5 GHz · 23 dBi · Point-to-point',
    price: 'R 1 450',
    image: '/images/Ubiquiti LiteBeam 5AC.jpg'
  },
  {
    id: 4,
    name: 'MikroTik SXTsq 5 ac',
    category: 'radio' as Category,
    spec: '5 GHz · 16 dBi · Compact outdoor',
    price: 'R 1 200',
    image: '/images/MikroTik SXTsq 5 ac.webp'
  },
  {
    id: 6,
    name: 'RJ45 Patch Cable 2 m',
    category: 'cable' as Category,
    spec: 'Cat6 · Booted · Various colours',
    price: 'R 65',
    image: '/images/RJ45 Patch Cable 2 m.jpg'
  },
  {
    id: 7,
    name: '8-Port Managed Switch',
    category: 'accessory' as Category,
    spec: 'Gigabit · VLAN · PoE+ capable',
    price: 'R 1 650',
    image: '/images/8-Port Managed Switch.jpg'
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
    id: 11,
    name: 'Ubiquiti airMAX Nanobeam M5 16dBi',
    category: 'radio' as Category,
    spec: '5 GHz · 16 dBi · Integrated PoE',
    price: 'R 1 850',
    image: '/images/Ubiquiti airMAX Nanobeam M5 16dBi.jpg'
  },
]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const categories: { key: Category; label: string }[] = [
    { key: 'all', label: 'All items' },
    { key: 'router', label: 'Routers' },
    { key: 'radio', label: 'Radios' },
    { key: 'cable', label: 'Cables' },
    { key: 'accessory', label: 'Accessories' },
  ]

  const whatsappMessage = (productName: string) => 
    `Hi, interested in ${encodeURIComponent(productName)}`

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
              Quality hardware — sold over the counter or professionally installed. WhatsApp us to order.
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
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
                    selectedCategory === cat.key
                      ? 'bg-[#ff7e26] text-white shadow-lg shadow-[#ff7e26]/30'
                      : 'border border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:border-[#ff7e26] hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </AnimatedSection>

            {/* Products Grid */}
            <AnimatedSection direction="up" delay={300} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="site-card group relative rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-[#ff7e26]/50 border-zinc-800/50 bg-zinc-900/20"
                >
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
                Prices are indicative and subject to stock. WhatsApp us for exact pricing, bulk orders, or a professional installation quote.
              </p>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
