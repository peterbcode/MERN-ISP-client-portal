'use client'

import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      if (!visible) setVisible(true)
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [visible])

  if (!visible) return null

  return (
    <>
      {/* OUTER CIRCLE - High visibility Orange */}
      <div 
        data-custom-cursor="true"
        style={{
          position: 'fixed',
          top: pos.y,
          left: pos.x,
          width: '40px',
          height: '40px',
          border: '2px solid #f97316',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 2147483646,
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          display: 'block',
          visibility: 'visible',
          opacity: 1
        }} 
      />
      {/* INNER DOT - Solid Orange */}
      <div 
        data-custom-cursor="true"
        style={{
          position: 'fixed',
          top: pos.y,
          left: pos.x,
          width: '8px',
          height: '8px',
          backgroundColor: '#f97316',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 2147483647,
          transform: 'translate(-50%, -50%)',
          display: 'block',
          visibility: 'visible',
          opacity: 1
        }} 
      />
    </>
  )
}
