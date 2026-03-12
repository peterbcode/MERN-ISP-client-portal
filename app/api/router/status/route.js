import TendaRouterAPI from '@/lib/tenda-router';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const routerIP = searchParams.get('routerIP') || '192.168.0.1';
    
    const tenda = new TendaRouterAPI(routerIP);
    
    // Try to login with default password (you should make this configurable)
    const loginResult = await tenda.login('admin'); // Default Tenda password
    
    if (loginResult.success) {
      const statusResult = await tenda.getStatus();
      return Response.json({
        success: true,
        data: statusResult
      });
    } else {
      return Response.json({
        success: false,
        message: 'Failed to authenticate with router'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Router status error:', error);
    return Response.json({
      success: false,
      message: 'Failed to get router status'
    }, { status: 500 });
  }
}
