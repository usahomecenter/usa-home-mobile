# GitHub Repository Setup for Cloud iOS Build

## Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `usa-home-app`
3. Description: `USA Home - Home Building & Design Solutions App`
4. Set to **Public** (required for free cloud build services)
5. Initialize with README: **No** (you'll upload existing project)
6. Click "Create repository"

## Step 2: Upload Project Files
You need to upload these essential files from your current project:

### Required Files:
- `package.json` and `package-lock.json`
- `capacitor.config.ts`
- `ios/` folder (complete Xcode project)
- `client/` folder (web app source)
- `server/` folder (backend source)
- `shared/` folder (shared schemas)
- `codemagic.yaml` (cloud build configuration)
- `.gitignore`

### Upload Process:
1. Download your project as ZIP from Replit
2. Extract and clean up (remove node_modules, build folders)
3. Upload to GitHub using web interface or Git commands

## Step 3: Configure Codemagic
1. Go to https://codemagic.io/signup
2. Sign up with GitHub account
3. Connect your `usa-home-app` repository
4. Configure these settings:

### Required Secrets in Codemagic:
- **APP_STORE_CONNECT_ISSUER_ID**: From App Store Connect API
- **APP_STORE_CONNECT_KEY_IDENTIFIER**: API Key ID
- **APP_STORE_CONNECT_PRIVATE_KEY**: Downloaded .p8 file content
- **CERTIFICATE_PRIVATE_KEY**: iOS Distribution Certificate

### App Store Connect API Setup:
1. Go to https://appstoreconnect.apple.com/access/api
2. Create new API Key with Developer access
3. Download the .p8 file
4. Copy Issuer ID and Key ID

## Step 4: Build Process
Once configured, Codemagic will:
1. Install dependencies (`npm install`)
2. Build web app (`npm run build`)
3. Sync with iOS (`npx cap sync ios`)
4. Build iOS app with Xcode
5. Upload directly to App Store Connect

## Step 5: Monitor Build
- Build typically takes 15-30 minutes
- Check build logs for any errors
- Once successful, your app will appear in App Store Connect ready for review

## Alternative: Bitrise Setup
If Codemagic doesn't work:
1. Go to https://app.bitrise.io/
2. Add new app, select iOS
3. Connect GitHub repository
4. Configure similar settings as above

## Files Already Prepared:
✅ `codemagic.yaml` - Build configuration  
✅ `capacitor.config.ts` - Correct Bundle ID  
✅ `ios/` folder - Xcode project  
✅ Complete web app source code  

## Next Action Required:
Upload your project to GitHub and configure cloud build service with your Apple Developer credentials.