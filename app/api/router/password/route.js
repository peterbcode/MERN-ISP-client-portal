import TendaRouterAPI from '@/lib/tenda-router';

export const runtime = 'nodejs';

// POST /api/router/password - Change router password
export async function POST(request) {
  try {
    const { routerIP, oldPassword, newPassword } = await request.json();
    
    if (!routerIP || !oldPassword || !newPassword) {
      return Response.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }
    
    const tenda = new TendaRouterAPI(routerIP);
    
    // First authenticate with old password
    const loginResult = await tenda.login(oldPassword);
    
    if (loginResult.success) {
      const changeResult = await tenda.changePassword(oldPassword, newPassword);
      return Response.json(changeResult);
    } else {
      return Response.json({
        success: false,
        message: 'Invalid current password'
      });
    }
  } catch (error) {
    console.error('Router password change error:', error);
    return Response.json({
      success: false,
      message: 'Failed to change password'
    }, { status: 500 });
  }
}
