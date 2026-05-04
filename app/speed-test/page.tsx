'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/navbar'
import SiteFooter from '../components/site-footer'
import { runSpeedTest, speedColor, speedRating } from '@/lib/speedtest'

type Result = {
  downloadMbps: number
  uploadMbps: number
  latencyMs: number
}

export default function SpeedTestPage() {
  const [result, setResult] = useState<Result | null>(null)
  const [progress, setProgress] = useState('Ready to test your connection.')
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState('')

  const startTest = async () => {
    setIsRunning(true)
    setError('')
    setProgress('Starting speed test...')

    try {
      const nextResult = await runSpeedTest({ onProgress: setProgress })
      setResult(nextResult)
      setProgress('Speed test complete.')
    } catch (testError) {
      console.error('Public speed test failed:', testError)
      setError('We could not complete the speed test. Please try again.')
      setProgress('Speed test failed.')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#070707] text-white">
        <section className="border-b border-zinc-800 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.15),transparent_34%),linear-gradient(180deg,#101010,#070707)] px-4 pb-14 pt-36 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#f97316]">
              Public Tool
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Internet Speed Test
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
              Run a quick browser-based test without signing in. For the most accurate result,
              pause downloads, streaming, VPNs, and other heavy network activity first.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="border border-zinc-800 bg-zinc-950/70 p-6 shadow-2xl shadow-black/20 sm:p-8">
              <div className="flex flex-col gap-5 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="heading-compact text-2xl font-bold text-zinc-100">
                    Connection Results
                  </h2>
                  <p className="mt-2 text-zinc-400" aria-live="polite">
                    {progress}
                  </p>
                </div>
                <button
                  onClick={startTest}
                  disabled={isRunning}
                  className="inline-flex justify-center bg-[#f97316] px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isRunning ? 'Testing...' : result ? 'Run Again' : 'Start Test'}
                </button>
              </div>

              {error && <p className="mt-5 text-red-400">{error}</p>}

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="border border-zinc-800 bg-zinc-900/80 p-5 text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    Download
                  </p>
                  <p className="mt-4 text-4xl font-black text-zinc-100">
                    {result ? result.downloadMbps.toFixed(3) : '--'}
                  </p>
                  <p className="mt-1 text-zinc-400">Mbps</p>
                  {result && (
                    <p className={`mt-3 font-semibold ${speedColor('download', result.downloadMbps)}`}>
                      {speedRating('download', result.downloadMbps)}
                    </p>
                  )}
                </div>

                <div className="border border-zinc-800 bg-zinc-900/80 p-5 text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    Upload
                  </p>
                  <p className="mt-4 text-4xl font-black text-zinc-100">
                    {result ? result.uploadMbps.toFixed(3) : '--'}
                  </p>
                  <p className="mt-1 text-zinc-400">Mbps</p>
                  {result && (
                    <p className={`mt-3 font-semibold ${speedColor('upload', result.uploadMbps)}`}>
                      {speedRating('upload', result.uploadMbps)}
                    </p>
                  )}
                </div>

                <div className="border border-zinc-800 bg-zinc-900/80 p-5 text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    Latency
                  </p>
                  <p className="mt-4 text-4xl font-black text-zinc-100">
                    {result ? result.latencyMs : '--'}
                  </p>
                  <p className="mt-1 text-zinc-400">ms</p>
                </div>
              </div>

              <div className="mt-8 border-l-4 border-[#f97316] bg-zinc-900/80 p-4">
                <p className="text-zinc-300">
                  Need help interpreting the result?{' '}
                  <Link href="/contact" className="font-semibold text-[#f97316] hover:text-orange-300">
                    Contact our support team
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
