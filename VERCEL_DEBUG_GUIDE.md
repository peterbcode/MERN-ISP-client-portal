# Vercel Deployment Debug Guide

## 🚨 500 Error on /api/auth/register

### Immediate Steps to Fix:

1. **Check Vercel Environment Variables**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Ensure these are set:
     ```
     MONGODB_URI=mongodb+srv://admin:admin123@cluster0.cszm9.mongodb.net/mern-isp-portal?appName=Cluster0
     MONGODB_DBNAME=mern-isp-portal
     JWT_SECRET=your-super-secret-jwt-key-here
     JWT_EXPIRE=7d
     DEBUG_API_ERRORS=true
     ```

2. **Check Vercel Function Logs**
   - Go to Vercel dashboard → your project → Logs
   - Look for the specific error message
   - Check for MongoDB connection errors

3. **Test Health Endpoint**
   - Visit: `https://your-app.vercel.app/api/health`
   - If this works, the serverless functions are running
   - If this fails, there's a fundamental deployment issue

### Common Issues & Solutions:

#### Issue 1: MongoDB Connection Timeout
```
Error: querySrv ETIMEOUT _mongodb._tcp.cluster0.cszm9.mongodb.net
```
**Solution:**
- Ensure MongoDB Atlas allows access from anywhere (0.0.0.0/0)
- Check if your IP is whitelisted in MongoDB Atlas
- Try using a simpler connection string

#### Issue 2: Missing JWT_SECRET
```
Error: Missing environment variable: JWT_SECRET
```
**Solution:**
- Add JWT_SECRET in Vercel dashboard
- Use a strong, random string

#### Issue 3: Module Import Error
```
Error: Cannot find module 'mongoose'
```
**Solution:**
- Check package.json includes all dependencies
- Redeploy after adding missing dependencies

### Quick Test Commands:

```bash
# Test health endpoint
curl https://your-app.vercel.app/api/health

# Test registration with debug
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456","firstName":"Test","lastName":"User"}'
```

### If Still Failing:

1. **Check Vercel Build Logs**
   - Look for any build errors
   - Ensure all dependencies are installed

2. **MongoDB Atlas Settings**
   - Network Access: Allow all IPs (0.0.0.0/0)
   - Database User: Ensure credentials are correct
   - Cluster: Check cluster status

3. **Redeploy Manually**
   - Push a small change to trigger redeploy
   - Or use Vercel dashboard to redeploy

### Environment Variable Template:

Copy these exactly to Vercel dashboard:
```
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.cszm9.mongodb.net/mern-isp-portal?appName=Cluster0
MONGODB_DBNAME=mern-isp-portal
JWT_SECRET=2b4467afe65f3901761f8cf09533d4a4dd690b3f8118bbb6d44920291f17d5ad3856cf91b9ae3e4daccd7cfa70168cdf6a665420a5fbd4f67c565c5c8850a5c0
JWT_EXPIRE=7d
DEBUG_API_ERRORS=true
```

### Next Steps:
1. Add environment variables to Vercel
2. Test health endpoint
3. Check Vercel logs for specific errors
4. Reply with the exact error message from logs
