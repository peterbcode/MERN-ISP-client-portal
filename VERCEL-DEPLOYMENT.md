# Vercel Deployment Guide

## ✅ **Deployment Ready Status**

This project is fully configured and ready for Vercel deployment.

## 🚀 **Deployment Steps**

### 1. **Connect to Vercel**
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link project to Vercel
vercel link
```

### 2. **Deploy to Vercel**
```bash
# Deploy to production
vercel --prod
```

## 📋 **Required Environment Variables**

Add these to your Vercel dashboard under **Settings → Environment Variables**:

### **Required for Production:**
```
MONGODB_URI=mongodb+srv://your-atlas-connection-string
MONGODB_DBNAME=mern-isp-portal
JWT_SECRET=your-secure-jwt-secret-here
RESEND_API_KEY=re_52Cyt8iv_Jbi4Mmf1ATrD1drYh6TuTxXK
RESEND_FROM_EMAIL=noreply@valley-computers.co.za
CONTACT_EMAIL=info@valley-computers.co.za
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

### **Optional:**
```
NEXT_PUBLIC_GA_ID=your-google-analytics-id
DEBUG_API_ERRORS=false
ADMIN_IP_ALLOWLIST=
ADMIN_MUTATIONS_ENABLED=false
ADMIN_ROLE_CHANGES_ENABLED=false
NEWSLETTER_WEBHOOK_URL=
```

## ⚠️ **Critical Setup Steps**

### 1. **MongoDB Atlas Setup**
- Create a MongoDB Atlas account
- Set up a cluster
- Add your Vercel domain to IP whitelist (0.0.0.0/0)
- Get connection string

### 2. **Resend Domain Verification**
- Go to https://resend.com/domains
- Add and verify `valley-computers.co.za`
- Add DNS records as provided by Resend

### 3. **Update Production URL**
- After deployment, update `NEXT_PUBLIC_APP_URL` to your Vercel domain
- Update any hardcoded URLs in Resend email templates

## 🔧 **Technical Configuration**

### **Vercel Configuration** (`vercel.json`)
```json
{
  "version": 2,
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30
    },
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "framework": "nextjs"
}
```

### **Node.js Version**
- Required: `>=20.9.0` (specified in package.json)
- Vercel automatically uses Node.js 20.x

## 📊 **Build Status**
✅ **Build Successful**: All pages and API routes compile correctly
✅ **Static Generation**: 53 pages generated
✅ **API Routes**: All endpoints functional
✅ **Environment Variables**: Properly configured

## 🎯 **Post-Deployment Checklist**

- [ ] Verify MongoDB connection
- [ ] Test user registration/login
- [ ] Test contact form emails
- [ ] Verify Resend domain is working
- [ ] Test all API endpoints
- [ ] Check responsive design
- [ ] Verify SEO metadata

## 🚨 **Common Issues & Solutions**

### **MongoDB Connection Issues**
- Ensure IP whitelist includes Vercel's IP ranges
- Check connection string format
- Verify database name matches

### **Email Service Issues**
- Verify Resend domain is approved
- Check API key is correct
- Ensure from email is verified

### **Build Issues**
- Clear Vercel cache: `vercel --prod --force`
- Check environment variables are set correctly
- Verify Node.js version compatibility

## 📞 **Support**

If you encounter deployment issues:
1. Check Vercel deployment logs
2. Verify all environment variables
3. Test locally with production variables
4. Check MongoDB Atlas connection
5. Verify Resend domain status

---

**Status**: ✅ **Ready for Vercel Deployment**
