# iOS Cloud Build Guide for USA Home App

## Project Configuration Summary
- **App Name**: USA Home
- **Bundle ID**: center.usahome.app (Apple assigned: "USA HOME - usahome.center")
- **Version**: 1.0
- **Build**: 1

## Cloud Build Service Options

### Option 1: Codemagic (Recommended)
1. Go to https://codemagic.io/
2. Sign up with your Apple Developer account
3. Connect your repository (GitHub/GitLab)
4. Upload the entire project folder to your repository
5. Configure build settings:
   - Platform: iOS
   - Xcode version: Latest stable
   - Bundle ID: center.usahome.app
   - Team ID: Your Apple Developer Team ID
   - Distribution: App Store

### Option 2: Bitrise
1. Go to https://app.bitrise.io/
2. Add new app and connect repository
3. Select iOS project type
4. Configure workflows for App Store deployment

## Required Files for Cloud Build

Your project includes these essential files:
- `ios/` folder with complete Xcode project
- `capacitor.config.ts` with correct configuration
- `package.json` with all dependencies
- Built web assets (will be generated during cloud build)

## Apple Developer Requirements

Before cloud building, ensure you have:
1. **Apple Developer Account** ($99/year)
2. **Certificates & Provisioning Profiles**:
   - iOS Distribution Certificate
   - App Store Provisioning Profile for Bundle ID: center.usahome.app
3. **App Store Connect** entry completed (which you have)

## Build Process Steps

1. **Upload Project**: Push your entire project to GitHub/GitLab
2. **Configure Cloud Service**: 
   - Add Apple certificates
   - Set environment variables
   - Configure build workflow
3. **Build Commands** (automatically run by cloud service):
   ```bash
   npm install
   npm run build
   npx cap sync ios
   # iOS build process in cloud
   ```
4. **App Store Upload**: Cloud service uploads .ipa file directly to App Store Connect

## Next Steps
1. Choose a cloud build service (Codemagic recommended)
2. Create GitHub repository with this project
3. Upload Apple Developer certificates to cloud service
4. Configure and run build
5. Monitor build process and download .ipa file
6. Upload to App Store Connect if not automatic

## Bundle ID Note
Apple assigned "USA HOME - usahome.center" but standard format is "center.usahome.app". Update this in App Store Connect if needed to match Capacitor configuration.

## Support
If build fails, check:
- All dependencies in package.json
- Capacitor configuration
- Apple certificates validity
- Bundle ID consistency