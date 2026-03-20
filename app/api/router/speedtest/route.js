export const runtime = 'nodejs';

// GET /api/router/speedtest - Run speed test
export async function GET(request) {
  try {
    const startTime = Date.now();
    
    // Test download speed
    const downloadResponse = await fetch('https://speed.cloudflare.com/__down?bytes=100000000', {
      cache: 'no-store'
    });
    const downloadData = await downloadResponse.blob();
    const downloadTime = (Date.now() - startTime) / 1000;
    const downloadSpeed = (downloadData.size * 8) / (downloadTime * 1000000); // Mbps

    // Test upload speed
    const uploadStartTime = Date.now();
    const uploadData = new Blob([new ArrayBuffer(10000000)]);
    const uploadResponse = await fetch('https://speed.cloudflare.com/__up', {
      method: 'POST',
      body: uploadData,
      cache: 'no-store'
    });
    const uploadTime = (Date.now() - uploadStartTime) / 1000;
    const uploadSpeed = (uploadData.size * 8) / (uploadTime * 1000000); // Mbps

    const speedResult = {
      download: downloadSpeed.toFixed(2),
      upload: uploadSpeed.toFixed(2),
      ping: Math.round(downloadTime / 2), // Approximate
      timestamp: new Date().toISOString(),
      serverLocation: 'Cloudflare Speed Test'
    };

    // Store speed test result
    // In a real app, you'd save this to database
    
    return Response.json({
      success: true,
      data: speedResult
    });
  } catch (error) {
    console.error('Speed test error:', error);
    return Response.json({
      success: false,
      message: 'Speed test failed'
    }, { status: 500 });
  }
}
