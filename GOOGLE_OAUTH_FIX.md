# Fix: Google OAuth Origin Error & Cookie Issues

## Issue Summary
Two errors encountered:
1. ❌ `GET /api/users/me 401 (Unauthorized)` - Cookie not being sent
2. ❌ `The given origin is not allowed for the given client ID` - Google OAuth origin not configured

## ✅ Solutions Implemented

### 1. Cookie SameSite Fix (DONE)
**Problem:** Cookie had `sameSite: "strict"` which prevents cross-origin cookies in development.

**Solution:** Updated backend cookie settings to use `sameSite: "lax"` in development:
```javascript
sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
```

**File:** `backend/src/controllers/userController.js`

---

### 2. Google OAuth Origin Configuration (MANUAL STEP REQUIRED)

**Problem:** Google OAuth requires explicit authorization of origins where your app will request tokens.

**Current Setup:**
- Frontend: `http://localhost:3000` 
- Backend Client ID: `53334409647-b61empbbl9kmsmet0jhi7jqcv5ibudpe.apps.googleusercontent.com`

**To Fix:**

#### Step 1: Open Google Cloud Console
- Go to: https://console.cloud.google.com/
- Select your project (you may need to search for one with the client ID)

#### Step 2: Find Credentials
1. In left sidebar → Click "Credentials"
2. Find your OAuth 2.0 Client ID (Web Application)
3. Name should contain your app name or client ID

#### Step 3: Add Authorized Origins
1. Click on the credential to edit it
2. Under "Authorized JavaScript origins", add:
   - `http://localhost:3000` (local development)
   - `http://localhost:8080` (if using alternate ports)
   - Your production domain when deployed

3. Under "Authorized redirect URIs", add:
   - `http://localhost:3000` (frontend URL)
   - Your production domain when deployed

#### Step 4: Save Changes
- Click "Save" button
- Wait 5-10 seconds for changes to propagate

#### Step 5: Restart Frontend
```bash
docker-compose -f docker-compose.local.yml restart studentpath_fe_local
```

---

## Testing the Fix

### 1. Restart Backend
```bash
docker-compose -f docker-compose.local.yml restart studentpath_be_local
```

### 2. Clear Browser Data
- Open DevTools (F12)
- Go to "Application" tab
- Clear Cookies for `localhost:5000`
- Clear Local Storage

### 3. Reload Page
- Go to `http://localhost:3000`
- Try Google login
- Check browser console for messages:
  - ✅ Should NOT see "origin is not allowed"
  - ✅ Should see user logged in
  - ✅ NavbarAuth should show user profile

---

## Verification Checklist

- [ ] Backend cookie is set with `sameSite: lax` for development
- [ ] Google OAuth app has `http://localhost:3000` in authorized origins
- [ ] Browser cookies for `localhost:5000` are cleared
- [ ] Frontend `.env.local` has correct `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- [ ] Can see cookie `userToken` in DevTools → Application → Cookies after login
- [ ] `/api/users/me` returns 200 with user data (not 401)
- [ ] Navbar shows logged-in user profile after Google login

---

## Production Deployment Notes

When deploying to production:

1. **Update Google OAuth Origins** with your actual domain:
   - `https://yourdomain.com`
   - `https://api.yourdomain.com` (if backend on different subdomain)

2. **Update Cookie Settings** (already done):
   - Production uses `sameSite: "strict"` + `secure: true`
   - This requires HTTPS

3. **Update CORS Origin** in backend:
   - Set env var: `FRONTEND_URL=https://yourdomain.com`

4. **Update Frontend API URL**:
   - Set env var: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`

---

## Debugging If Still Having Issues

### Check Backend Logs
```bash
docker logs studentpath_be_local | grep -i "cookie\|auth\|login"
```

### Check Network Tab
1. Open DevTools → Network tab
2. Make request to `/api/users/me`
3. Look for `Cookie` header in Request Headers
4. Look for `Set-Cookie` in Response Headers

### CORS Headers Should Be
```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: http://localhost:3000
```

### Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid origin" from Google | Add the origin to Google Cloud Console authorized origins |
| 401 on `/api/users/me` | Cookie not being sent - check Network tab for Cookie header |
| Cookie not persisting | Check sameSite setting (should be "lax" in dev) |
| CORS error | Verify `origin` in backend CORS config matches `FRONTEND_URL` |

