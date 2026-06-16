'use client'

import { useEffect } from 'react'

export default function ProductsPage() {
  useEffect(() => {
    // Filter functionality
    const handleFilterClick = (btn: HTMLButtonElement) => {
      document.querySelectorAll('.fb').forEach((b: any) => b.classList.remove('on'))
      btn.classList.add('on')
      const cat = btn.dataset.cat
      document.querySelectorAll('.card').forEach((c: any) => {
        c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none'
      })
    }

    document.querySelectorAll('.fb').forEach((btn: any) => {
      btn.addEventListener('click', () => handleFilterClick(btn))
    })

    return () => {
      document.querySelectorAll('.fb').forEach((btn: any) => {
        btn.removeEventListener('click', () => handleFilterClick(btn))
      })
    }
  }, [])

  return (
    <>
      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .wrap { background: #080807; padding: 1.5rem 1rem 3rem; font-family: var(--font-sans, system-ui, sans-serif); }

        .shop-header { border-bottom: 0.5px solid rgba(255,255,255,0.08); padding-bottom: 1.25rem; margin-bottom: 1.5rem; }
        .eyebrow { font-size: 11px; letter-spacing: 0.14em; color: #FF4500; text-transform: uppercase; margin-bottom: 0.35rem; }
        .shop-title { font-size: 22px; font-weight: 500; color: #f0ede8; }
        .shop-sub { font-size: 13px; color: #6b6960; margin-top: 0.3rem; }

        .filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .fb { background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.08); color: #6b6960;
          font-size: 12px; padding: 5px 14px; border-radius: 20px; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .fb:hover { border-color: rgba(255,69,0,0.5); color: #f0ede8; }
        .fb.on { background: rgba(255,69,0,0.12); border-color: rgba(255,69,0,0.5); color: #FF4500; }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 12px; }

        .card { background: #0e0e0c; border: 0.5px solid rgba(255,255,255,0.07); border-radius: 10px;
          overflow: hidden; display: flex; flex-direction: column; transition: border-color 0.2s, transform 0.18s; cursor: default; }
        .card:hover { border-color: rgba(255,69,0,0.35); transform: translateY(-2px); }

        .img-wrap { position: relative; width: 100%; aspect-ratio: 4/3; background: #111110; overflow: hidden; }
        .img-wrap svg { width: 100%; height: 100%; }

        .cat-pill { position: absolute; top: 9px; left: 9px; font-size: 10px; letter-spacing: 0.09em;
          text-transform: uppercase; background: rgba(255,69,0,0.15); color: #FF4500;
          border: 0.5px solid rgba(255,69,0,0.3); border-radius: 4px; padding: 2px 7px; }

        .sig-bars { position: absolute; bottom: 9px; right: 9px; display: flex; align-items: flex-end; gap: 3px; opacity: 0; transition: opacity 0.2s; }
        .card:hover .sig-bars { opacity: 1; }
        .sig-bars span { width: 4px; background: #FF4500; border-radius: 2px; animation: sig 1s ease-in-out infinite; }
        .sig-bars span:nth-child(1) { height: 5px; animation-delay: 0s; }
        .sig-bars span:nth-child(2) { height: 9px; animation-delay: 0.15s; }
        .sig-bars span:nth-child(3) { height: 14px; animation-delay: 0.3s; }
        .sig-bars span:nth-child(4) { height: 19px; animation-delay: 0.45s; }
        @keyframes sig { 0%,100%{opacity:0.3}50%{opacity:1} }

        .info { padding: 11px 13px 13px; flex: 1; display: flex; flex-direction: column; gap: 5px; }
        .pname { font-size: 13px; font-weight: 500; color: #f0ede8; line-height: 1.35; }
        .pspec { font-size: 11px; color: #6b6960; }
        .footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 9px; border-top: 0.5px solid rgba(255,255,255,0.07); }
        .price { font-size: 14px; font-weight: 500; color: #f0ede8; }
        .price em { font-size: 10px; color: #6b6960; font-style: normal; }
        .wa { display: flex; align-items: center; gap: 4px; background: none; border: 0.5px solid rgba(255,255,255,0.1);
          color: #6b6960; font-size: 11px; padding: 4px 9px; border-radius: 6px; cursor: pointer;
          transition: all 0.2s; font-family: inherit; text-decoration: none; }
        .wa:hover { border-color: rgba(255,69,0,0.5); color: #FF4500; background: rgba(255,69,0,0.08); }
        .wa i { font-size: 13px; }

        .note { margin-top: 1.75rem; padding-top: 1.25rem; border-top: 0.5px solid rgba(255,255,255,0.07);
          font-size: 12px; color: #6b6960; display: flex; align-items: center; gap: 8px; }
        .note i { color: #FF4500; font-size: 15px; flex-shrink: 0; }
      `}</style>

      <h2 className="sr-only">Valley Computers hardware shop — routers, radios, cables and accessories</h2>

      <div className="wrap">
        <div className="shop-header">
          <div className="eyebrow">Hardware Shop</div>
          <div className="shop-title">Equipment &amp; Accessories</div>
          <div className="shop-sub">Quality hardware — sold over the counter or professionally installed. WhatsApp us to order.</div>
        </div>

        <div className="filters">
          <button className="fb on" data-cat="all">All items</button>
          <button className="fb" data-cat="router">Routers</button>
          <button className="fb" data-cat="radio">Radios</button>
          <button className="fb" data-cat="cable">Cables</button>
          <button className="fb" data-cat="accessory">Accessories</button>
        </div>

        <div className="grid" id="g">

          <div className="card" data-cat="router">
            <div className="img-wrap">
              <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
                <rect width="240" height="180" fill="#111110"/>
                <rect x="55" y="95" width="130" height="38" rx="6" fill="#1a1a17" stroke="#2a2a26" strokeWidth="0.5"/>
                <rect x="65" y="103" width="8" height="8" rx="1.5" fill="#222220"/>
                <rect x="79" y="103" width="8" height="8" rx="1.5" fill="#222220"/>
                <rect x="93" y="103" width="8" height="8" rx="1.5" fill="#222220"/>
                <rect x="107" y="103" width="8" height="8" rx="1.5" fill="#222220"/>
                <circle cx="158" cy="107" r="4" fill="#FF4500" opacity="0.8"/>
                <circle cx="158" cy="107" r="2" fill="#FF4500"/>
                <line x1="120" y1="95" x2="90" y2="60" stroke="#2a2a26" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="120" y1="95" x2="150" y2="55" stroke="#2a2a26" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="87" y="52" width="6" height="16" rx="3" fill="#333330"/>
                <rect x="147" y="47" width="6" height="16" rx="3" fill="#333330"/>
                <path d="M75 80 Q120 55 165 80" stroke="#FF4500" strokeWidth="0.5" fill="none" opacity="0.3"/>
                <path d="M85 70 Q120 48 155 70" stroke="#FF4500" strokeWidth="0.5" fill="none" opacity="0.2"/>
                <text x="120" y="148" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#3a3a36" letterSpacing="1">MIKROTIK · HAP AX3</text>
              </svg>
              <div className="cat-pill">Router</div>
              <div className="sig-bars"><span></span><span></span><span></span><span></span></div>
            </div>
            <div className="info">
              <div className="pname">MikroTik hAP ax³</div>
              <div className="pspec">Wi-Fi 6 · Dual-band · 4-port · RouterOS</div>
              <div className="footer">
                <div className="price">R 2 850 <em>incl VAT</em></div>
                <a className="wa" href="https://wa.me/27799381260?text=Hi%2C%20interested%20in%20MikroTik%20hAP%20ax3" target="_blank"><i className="ti ti-brand-whatsapp" aria-hidden="true"></i>Order</a>
              </div>
            </div>
          </div>

          <div className="card" data-cat="router">
            <div className="img-wrap">
              <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
                <rect width="240" height="180" fill="#111110"/>
                <rect x="50" y="90" width="140" height="45" rx="8" fill="#181816" stroke="#2a2a26" strokeWidth="0.5"/>
                <rect x="60" y="100" width="9" height="9" rx="2" fill="#222220"/>
                <rect x="75" y="100" width="9" height="9" rx="2" fill="#222220"/>
                <rect x="90" y="100" width="9" height="9" rx="2" fill="#222220"/>
                <rect x="105" y="100" width="9" height="9" rx="2" fill="#222220"/>
                <circle cx="163" cy="104" r="5" fill="#FF4500" opacity="0.7"/>
                <circle cx="163" cy="104" r="2.5" fill="#FF4500"/>
                <line x1="120" y1="90" x2="120" y2="55" stroke="#2a2a26" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="116.5" y="45" width="7" height="18" rx="3.5" fill="#2e2e2a"/>
                <path d="M90 72 Q120 58 150 72" stroke="#FF4500" strokeWidth="0.5" fill="none" opacity="0.35"/>
                <path d="M82 63 Q120 46 158 63" stroke="#FF4500" strokeWidth="0.5" fill="none" opacity="0.2"/>
                <text x="120" y="148" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#3a3a36" letterSpacing="1">TENDA · AC10</text>
              </svg>
              <div className="cat-pill">Router</div>
              <div className="sig-bars"><span></span><span></span><span></span><span></span></div>
            </div>
            <div className="info">
              <div className="pname">Tenda AC10</div>
              <div className="pspec">AC1200 · Dual-band · Beamforming</div>
              <div className="footer">
                <div className="price">R 850 <em>incl VAT</em></div>
                <a className="wa" href="https://wa.me/27799381260?text=Hi%2C%20interested%20in%20Tenda%20AC10" target="_blank"><i className="ti ti-brand-whatsapp" aria-hidden="true"></i>Order</a>
              </div>
            </div>
          </div>

          <div className="card" data-cat="radio">
            <div className="img-wrap">
              <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
                <rect width="240" height="180" fill="#111110"/>
                <ellipse cx="120" cy="95" rx="38" ry="38" fill="#161614" stroke="#252522" strokeWidth="0.5"/>
                <ellipse cx="120" cy="95" rx="28" ry="28" fill="#111110" stroke="#252522" strokeWidth="0.5"/>
                <ellipse cx="120" cy="95" rx="18" ry="18" fill="#0e0e0c" stroke="#252522" strokeWidth="0.5"/>
                <circle cx="120" cy="95" r="5" fill="#FF4500" opacity="0.9"/>
                <rect x="116" y="133" width="8" height="22" rx="3" fill="#252522"/>
                <path d="M58 95 Q80 70 102 85" stroke="#FF4500" strokeWidth="0.5" fill="none" opacity="0.3"/>
                <path d="M182 95 Q160 70 138 85" stroke="#FF4500" strokeWidth="0.5" fill="none" opacity="0.3"/>
                <text x="120" y="168" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#3a3a36" letterSpacing="1">UBIQUITI · LITEBEAM 5AC</text>
              </svg>
              <div className="cat-pill">Radio</div>
              <div className="sig-bars"><span></span><span></span><span></span><span></span></div>
            </div>
            <div className="info">
              <div className="pname">Ubiquiti LiteBeam 5AC</div>
              <div className="pspec">5 GHz · 23 dBi · Point-to-point</div>
              <div className="footer">
                <div className="price">R 1 450 <em>incl VAT</em></div>
                <a className="wa" href="https://wa.me/27799381260?text=Hi%2C%20interested%20in%20Ubiquiti%20LiteBeam%205AC" target="_blank"><i className="ti ti-brand-whatsapp" aria-hidden="true"></i>Order</a>
              </div>
            </div>
          </div>

          <div className="card" data-cat="radio">
            <div className="img-wrap">
              <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
                <rect width="240" height="180" fill="#111110"/>
                <rect x="90" y="58" width="60" height="75" rx="6" fill="#161614" stroke="#252522" strokeWidth="0.5"/>
                <rect x="96" y="64" width="48" height="36" rx="3" fill="#0e0e0c" stroke="#1e1e1c" strokeWidth="0.5"/>
                <circle cx="120" cy="82" r="10" fill="#141412" stroke="#252522" strokeWidth="0.5"/>
                <circle cx="120" cy="82" r="4" fill="#FF4500" opacity="0.8"/>
                <circle cx="104" cy="108" r="3" fill="#222220"/>
                <circle cx="120" cy="108" r="3" fill="#FF4500" opacity="0.6"/>
                <circle cx="136" cy="108" r="3" fill="#222220"/>
                <rect x="113" y="133" width="14" height="8" rx="2" fill="#252522"/>
                <path d="M75 75 Q90 60 105 70" stroke="#FF4500" strokeWidth="0.5" fill="none" opacity="0.3"/>
                <path d="M165 75 Q150 60 135 70" stroke="#FF4500" strokeWidth="0.5" fill="none" opacity="0.3"/>
                <text x="120" y="158" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#3a3a36" letterSpacing="1">MIKROTIK · SXTSQ 5AC</text>
              </svg>
              <div className="cat-pill">Radio</div>
              <div className="sig-bars"><span></span><span></span><span></span><span></span></div>
            </div>
            <div className="info">
              <div className="pname">MikroTik SXTsq 5 ac</div>
              <div className="pspec">5 GHz · 16 dBi · Compact outdoor</div>
              <div className="footer">
                <div className="price">R 1 200 <em>incl VAT</em></div>
                <a className="wa" href="https://wa.me/27799381260?text=Hi%2C%20interested%20in%20MikroTik%20SXTsq%205ac" target="_blank"><i className="ti ti-brand-whatsapp" aria-hidden="true"></i>Order</a>
              </div>
            </div>
          </div>

          <div className="card" data-cat="cable">
            <div className="img-wrap">
              <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
                <rect width="240" height="180" fill="#111110"/>
                <circle cx="120" cy="90" r="52" fill="none" stroke="#1e1e1c" strokeWidth="14"/>
                <circle cx="120" cy="90" r="52" fill="none" stroke="#252522" strokeWidth="12" strokeDasharray="6 4"/>
                <circle cx="120" cy="90" r="52" fill="none" stroke="#FF4500" strokeWidth="1" strokeDasharray="3 9" opacity="0.4"/>
                <circle cx="120" cy="90" r="18" fill="#161614" stroke="#252522" strokeWidth="0.5"/>
                <circle cx="120" cy="90" r="8" fill="#1e1e1c"/>
                <circle cx="120" cy="90" r="3" fill="#252522"/>
                <rect x="45" y="87" width="18" height="6" rx="3" fill="#FF4500" opacity="0.7"/>
                <text x="120" y="160" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#3a3a36" letterSpacing="1">CAT6 · 305M DRUM</text>
              </svg>
              <div className="cat-pill">Cable</div>
              <div className="sig-bars"><span></span><span></span><span></span><span></span></div>
            </div>
            <div className="info">
              <div className="pname">Cat6 Ethernet Cable</div>
              <div className="pspec">305 m drum · UTP · CMR rated</div>
              <div className="footer">
                <div className="price">R 1 100 <em>incl VAT</em></div>
                <a className="wa" href="https://wa.me/27799381260?text=Hi%2C%20interested%20in%20Cat6%20cable%20drum" target="_blank"><i className="ti ti-brand-whatsapp" aria-hidden="true"></i>Order</a>
              </div>
            </div>
          </div>

          <div className="card" data-cat="cable">
            <div className="img-wrap">
              <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
                <rect width="240" height="180" fill="#111110"/>
                <path d="M55 90 Q80 60 120 90 Q160 120 185 90" stroke="#FF4500" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7"/>
                <path d="M55 90 Q80 60 120 90 Q160 120 185 90" stroke="#FF4500" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.3"/>
                <rect x="44" y="82" width="16" height="16" rx="3" fill="#1e1e1c" stroke="#2e2e2a" strokeWidth="0.5"/>
                <rect x="180" y="82" width="16" height="16" rx="3" fill="#1e1e1c" stroke="#2e2e2a" strokeWidth="0.5"/>
                <rect x="48" y="86" width="8" height="8" rx="1" fill="#252522"/>
                <rect x="184" y="86" width="8" height="8" rx="1" fill="#252522"/>
                <line x1="48" y1="89" x2="44" y2="89" stroke="#FF4500" strokeWidth="1" opacity="0.5"/>
                <line x1="192" y1="89" x2="196" y2="89" stroke="#FF4500" strokeWidth="1" opacity="0.5"/>
                <text x="120" y="145" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#3a3a36" letterSpacing="1">RJ45 · PATCH CABLE · 2M</text>
              </svg>
              <div className="cat-pill">Cable</div>
              <div className="sig-bars"><span></span><span></span><span></span><span></span></div>
            </div>
            <div className="info">
              <div className="pname">RJ45 Patch Cable 2 m</div>
              <div className="pspec">Cat6 · Booted · Various colours</div>
              <div className="footer">
                <div className="price">R 65 <em>incl VAT</em></div>
                <a className="wa" href="https://wa.me/27799381260?text=Hi%2C%20interested%20in%20RJ45%20patch%20cables" target="_blank"><i className="ti ti-brand-whatsapp" aria-hidden="true"></i>Order</a>
              </div>
            </div>
          </div>

          <div className="card" data-cat="accessory">
            <div className="img-wrap">
              <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
                <rect width="240" height="180" fill="#111110"/>
                <rect x="45" y="68" width="150" height="60" rx="5" fill="#161614" stroke="#252522" strokeWidth="0.5"/>
                <rect x="52" y="75" width="136" height="46" rx="3" fill="#111110" stroke="#1e1e1c" strokeWidth="0.5"/>
                <circle cx="68" cy="98" r="4" fill="#FF4500" opacity="0.8"/>
                <circle cx="68" cy="98" r="2" fill="#FF4500"/>
                <rect x="80" y="82" width="9" height="32" rx="2" fill="#1e1e1c"/>
                <rect x="95" y="82" width="9" height="32" rx="2" fill="#1e1e1c"/>
                <rect x="110" y="82" width="9" height="32" rx="2" fill="#1e1e1c"/>
                <rect x="125" y="82" width="9" height="32" rx="2" fill="#1e1e1c"/>
                <rect x="140" y="82" width="9" height="32" rx="2" fill="#1e1e1c"/>
                <rect x="155" y="82" width="9" height="32" rx="2" fill="#1e1e1c"/>
                <rect x="170" y="82" width="9" height="32" rx="2" fill="#1e1e1c"/>
                <text x="120" y="148" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#3a3a36" letterSpacing="1">8-PORT MANAGED SWITCH</text>
              </svg>
              <div className="cat-pill">Accessory</div>
              <div className="sig-bars"><span></span><span></span><span></span><span></span></div>
            </div>
            <div className="info">
              <div className="pname">8-Port Managed Switch</div>
              <div className="pspec">Gigabit · VLAN · PoE+ capable</div>
              <div className="footer">
                <div className="price">R 1 650 <em>incl VAT</em></div>
                <a className="wa" href="https://wa.me/27799381260?text=Hi%2C%20interested%20in%208-Port%20Switch" target="_blank"><i className="ti ti-brand-whatsapp" aria-hidden="true"></i>Order</a>
              </div>
            </div>
          </div>

          <div className="card" data-cat="accessory">
            <div className="img-wrap">
              <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
                <rect width="240" height="180" fill="#111110"/>
                <rect x="80" y="65" width="80" height="55" rx="5" fill="#161614" stroke="#252522" strokeWidth="0.5"/>
                <rect x="88" y="73" width="64" height="8" rx="2" fill="#1e1e1c"/>
                <rect x="88" y="85" width="64" height="8" rx="2" fill="#1e1e1c"/>
                <rect x="100" y="120" width="18" height="10" rx="2" fill="#252522"/>
                <rect x="122" y="120" width="18" height="10" rx="2" fill="#252522"/>
                <rect x="108" y="130" width="24" height="5" rx="1" fill="#1e1e1c"/>
                <circle cx="152" cy="77" r="5" fill="#FF4500" opacity="0.8"/>
                <circle cx="152" cy="77" r="2.5" fill="#FF4500"/>
                <line x1="120" y1="65" x2="120" y2="50" stroke="#2a2a26" strokeWidth="1"/>
                <line x1="120" y1="50" x2="100" y2="38" stroke="#FF4500" strokeWidth="0.5" opacity="0.4"/>
                <line x1="120" y1="50" x2="140" y2="38" stroke="#FF4500" strokeWidth="0.5" opacity="0.4"/>
                <text x="120" y="155" textAnchor="middle" fontFamily="system-ui" fontSize="10" fill="#3a3a36" letterSpacing="1">POE INJECTOR · 48V</text>
              </svg>
              <div className="cat-pill">Accessory</div>
              <div className="sig-bars"><span></span><span></span><span></span><span></span></div>
            </div>
            <div className="info">
              <div className="pname">PoE Injector 48V</div>
              <div className="pspec">802.3af · 15.4 W · Passive option avail.</div>
              <div className="footer">
                <div className="price">R 320 <em>incl VAT</em></div>
                <a className="wa" href="https://wa.me/27799381260?text=Hi%2C%20interested%20in%20PoE%20Injector" target="_blank"><i className="ti ti-brand-whatsapp" aria-hidden="true"></i>Order</a>
              </div>
            </div>
          </div>

        </div>

        <div className="note">
          <i className="ti ti-info-circle" aria-hidden="true"></i>
          Prices are indicative and subject to stock. WhatsApp us for exact pricing, bulk orders, or a professional installation quote.
        </div>
      </div>
    </>
  )
}
