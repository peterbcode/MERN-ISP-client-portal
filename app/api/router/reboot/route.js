import TendaRouterAPI from '@/lib/tenda-router';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const routerIP = searchParams.get('routerIP') || '192.168.0.1';
    
    const tenda = new TendaRouterAPI(routerIP);
    
    const loginResult = await tenda.login('admin');
    
    if (loginResult.success) {
      const rebootResult = await tenda.reboot();
      return Response.json({
        success: true,
        message: 'Router reboot initiated successfully'
      });
    } else {
      return Response.json({
        success: false,
        message: 'Failed to authenticate with router'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Router reboot error:', error);
    return Response.json({
      success: false,
      message: 'Failed to reboot router'
    }, { status: 500 });
  }
}
