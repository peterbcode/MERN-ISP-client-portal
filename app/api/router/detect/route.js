export const runtime = 'nodejs';

// GET /api/router/detect - Auto-detect router IP
export async function GET(request) {
  try {
    // Get client IP
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const clientIP = ipData.ip;
    
    // Common router IP patterns based on client IP
    let likelyRouterIP = '192.168.0.1'; // Default
    
    if (clientIP.startsWith('192.168.')) {
      likelyRouterIP = '192.168.0.1';
    } else if (clientIP.startsWith('10.0.')) {
      likelyRouterIP = '10.0.0.1';
    } else if (clientIP.startsWith('172.16.')) {
      likelyRouterIP = '172.16.0.1';
    }
    
    return Response.json({
      success: true,
      data: {
        clientIP,
        likelyRouterIP,
        networkRange: clientIP.split('.').slice(0, 3).join('.') + '.0.1'
      }
    });
  } catch (error) {
    console.error('IP detection error:', error);
    return Response.json({
      success: false,
      message: 'Failed to detect IP'
    }, { status: 500 });
  }
}
