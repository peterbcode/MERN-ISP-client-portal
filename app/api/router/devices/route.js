import TendaRouterAPI from '@/lib/tenda-router';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const routerIP = searchParams.get('routerIP') || '192.168.0.1';
    
    const tenda = new TendaRouterAPI(routerIP);
    
    const loginResult = await tenda.login('admin');
    
    if (loginResult.success) {
      const devicesResult = await tenda.getDevices();
      return Response.json({
        success: true,
        data: devicesResult
      });
    } else {
      return Response.json({
        success: false,
        message: 'Failed to authenticate with router'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Router devices error:', error);
    return Response.json({
      success: false,
      message: 'Failed to get router devices'
    }, { status: 500 });
  }
}
