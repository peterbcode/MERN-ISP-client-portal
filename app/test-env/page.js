// Test environment variables
console.log('🔗 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('🔗 NODE_ENV:', process.env.NODE_ENV);
console.log('🔗 All env vars:', Object.keys(process.env).filter(k => k.includes('API')));

export default function TestEnv() {
  return (
    <div>
      <h1>Environment Test</h1>
      <p>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL}</p>
      <p>NODE_ENV: {process.env.NODE_ENV}</p>
    </div>
  );
}
