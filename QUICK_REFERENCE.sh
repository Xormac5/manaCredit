#!/bin/bash

# 🎮 ManaCredit - Quick Reference Commands
# Copy & paste these commands for common tasks

echo "📚 ManaCredit Quick Reference"
echo "=============================="
echo ""

# ─────────────────────────────────────────────────────────
# 🚀 Development
# ─────────────────────────────────────────────────────────

echo "🚀 DEVELOPMENT"
echo "npm install              # Install dependencies"
echo "npm run dev              # Start dev server (localhost:5173)"
echo "npm run build            # Production build"
echo "npm run preview          # Preview build locally"
echo "npm run lint             # Run ESLint"
echo ""

# ─────────────────────────────────────────────────────────
# ☁️  Cloud Functions
# ─────────────────────────────────────────────────────────

echo "☁️  CLOUD FUNCTIONS"
echo "cd functions"
echo "npm install              # Install functions dependencies"
echo "npm run build            # TypeScript compile"
echo "npm run serve            # Run locally (emulator)"
echo "npm run deploy           # Deploy to Firebase"
echo "cd .."
echo ""

# ─────────────────────────────────────────────────────────
# 🔥 Firebase
# ─────────────────────────────────────────────────────────

echo "🔥 FIREBASE"
echo "firebase login           # Authenticate"
echo "firebase deploy --only firestore:rules  # Deploy security rules"
echo "firebase deploy --only hosting          # Deploy frontend"
echo "firebase deploy          # Deploy everything"
echo "firebase emulators:start # Run emulators locally"
echo ""

# ─────────────────────────────────────────────────────────
# 📱 PWA & Build
# ─────────────────────────────────────────────────────────

echo "📱 PWA & BUILD"
echo "npm run build            # Generate dist/ + service worker"
echo "# Add to public/:"
echo "# - icon-192.png"
echo "# - icon-512.png"
echo "# - screenshot-192.png"
echo "# - screenshot-512.png"
echo ""

# ─────────────────────────────────────────────────────────
# 🧪 Testing
# ─────────────────────────────────────────────────────────

echo "🧪 TESTING"
echo "VITE_USE_MOCK_DATA=true npm run dev     # Mock mode (localStorage)"
echo ""

# ─────────────────────────────────────────────────────────
# 🐳 Docker (optional)
# ─────────────────────────────────────────────────────────

echo "🐳 DOCKER (Optional)"
echo "docker build -t manacredit:latest ."
echo "docker run -p 5173:5173 manacredit:latest"
echo ""

# ─────────────────────────────────────────────────────────
# 📊 Git
# ─────────────────────────────────────────────────────────

echo "📊 GIT"
echo "git status               # Check changes"
echo "git add -A && git commit -m 'message'   # Commit"
echo "git push origin main     # Push to main"
echo "git tag -a v1.0 -m 'Release'  # Create tag"
echo ""

# ─────────────────────────────────────────────────────────
# 🔍 Debugging
# ─────────────────────────────────────────────────────────

echo "🔍 DEBUGGING"
echo "npm run build            # Check for build errors"
echo "npm run lint             # Check ESLint warnings"
echo "# Browser DevTools:"
echo "# - F12 to open"
echo "# - Application tab for service worker"
echo "# - Storage tab for localStorage mock data"
echo ""

# ─────────────────────────────────────────────────────────
# 📚 Documentation
# ─────────────────────────────────────────────────────────

echo "📚 DOCUMENTATION"
echo "README.md                # Project overview"
echo "SETUP_GUIDE.md           # Complete setup guide"
echo "IMPLEMENTATION_SUMMARY.md # What was built"
echo "DEPLOYMENT_CHECKLIST.md  # Pre-deployment checklist"
echo ""

# ─────────────────────────────────────────────────────────
# 📝 Environment Variables
# ─────────────────────────────────────────────────────────

echo "📝 ENVIRONMENT VARIABLES (.env.local)"
echo "VITE_FIREBASE_API_KEY=..."
echo "VITE_FIREBASE_AUTH_DOMAIN=..."
echo "VITE_FIREBASE_PROJECT_ID=..."
echo "VITE_FIREBASE_STORAGE_BUCKET=..."
echo "VITE_FIREBASE_MESSAGING_SENDER_ID=..."
echo "VITE_FIREBASE_APP_ID=..."
echo "VITE_USE_MOCK_DATA=false    # true for mock/offline"
echo ""

# ─────────────────────────────────────────────────────────
# 🔗 Important Endpoints
# ─────────────────────────────────────────────────────────

echo "🔗 IMPORTANT ENDPOINTS"
echo "http://localhost:5173    # Dev server"
echo "/login                   # Staff login page"
echo "/                        # Dashboard (requires auth)"
echo "/scan                    # QR scanner (requires auth)"
echo "/customer?id=CUST_123    # Customer card (requires auth)"
echo "/history                 # Transaction history (requires auth)"
echo "/qr/CUST_123            # Public QR viewer (NO auth)"
echo ""

# ─────────────────────────────────────────────────────────
# ⚙️  Common Issues
# ─────────────────────────────────────────────────────────

echo "⚙️  COMMON ISSUES"
echo ""
echo "❌ Build fails with TypeScript errors"
echo "   ✅ Run: npm install && npm run build"
echo ""
echo "❌ Service worker not updating"
echo "   ✅ Clear browser cache (DevTools > Application > Clear Storage)"
echo ""
echo "❌ Firebase credentials not working"
echo "   ✅ Verify .env.local has correct values from Firebase Console"
echo ""
echo "❌ Firestore Rules rejection"
echo "   ✅ Check: Custom Claims in JWT match shop_id in path"
echo ""

# ─────────────────────────────────────────────────────────

echo "✨ Happy coding! 🚀"
