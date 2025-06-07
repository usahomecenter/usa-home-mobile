# USA Home - Mobile App

A comprehensive home solutions platform for American homeowners with building, design, and financing tools.

## Features
- Home Building Services
- Interior & Exterior Design
- Real Estate & Financing
- 8 Language Support
- Location-based Professional Search

## Tech Stack
- React + TypeScript
- Capacitor (iOS/Android)
- Tailwind CSS
- Express.js Backend
- PostgreSQL Database

## Cloud Build Setup

This repository is configured for automatic iOS app building using cloud services.

### Required Files Included:
- `codemagic.yaml` - Build configuration
- `ios/` - Complete Xcode project
- `client/` - Web app source
- `server/` - Backend API
- `capacitor.config.ts` - Mobile configuration

### Build Process:
1. Connect repository to Codemagic
2. Add Apple Developer credentials
3. Configure build workflow
4. Automatic App Store upload

See `ios-cloud-build-guide.md` for detailed instructions.

## Bundle ID
- **iOS**: center.usahome.app
- **Android**: com.usahome.app

## Version
- **Current**: 1.0
- **Build**: 1