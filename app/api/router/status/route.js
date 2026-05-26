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
