import TendaRouterAPI from '@/lib/tenda-router';
import { getProtectedRouterConfig } from '@/lib/router-security';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const config = await getProtectedRouterConfig(request);
    if (config.error) return config.error;
    
    const tenda = new TendaRouterAPI(config.routerIP);
    
    const loginResult = await tenda.login(config.routerPassword);
    
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
