import TendaRouterAPI from '@/lib/tenda-router';
import { getProtectedRouterConfig } from '@/lib/router-security';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const config = await getProtectedRouterConfig(request);
    if (config.error) return config.error;
    
    const tenda = new TendaRouterAPI(config.routerIP);
    
    const loginResult = await tenda.login(config.routerPassword);
    
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
