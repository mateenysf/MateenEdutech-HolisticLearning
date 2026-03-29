# Inner Architecture Development Lab
### By Mateen Yousuf — Teacher, School Education Department Kashmir
### Aligned with NEP 2020 · Offline PWA Edition

---

## 📁 File Structure
```
inner-arch-lab/
├── index.html          ← Complete app (single file)
├── manifest.json       ← PWA configuration
├── service-worker.js   ← Offline caching
├── author.jpg          ← Author photo (place in same folder)
└── README.md           ← This file
```

---

## 🖥️ How to Run Locally

### Option 1 — VS Code Live Server (Recommended)
1. Install VS Code + Live Server extension
2. Open the project folder in VS Code
3. Right-click `index.html` → "Open with Live Server"
4. App runs at `http://localhost:5500`

### Option 2 — Python Simple Server
```bash
cd inner-arch-lab
python -m http.server 8000
# Open http://localhost:8000
```

### Option 3 — Node.js
```bash
npx serve .
# Follow the URL shown in terminal
```

---

## 🌐 How to Host for Free

### GitHub Pages
1. Create a GitHub account at github.com
2. Create a new repository named `inner-arch-lab`
3. Upload all files to the repository
4. Go to Settings → Pages → Source: Deploy from main branch
5. Your app will be live at `https://yourusername.github.io/inner-arch-lab`

### Netlify (Drag & Drop)
1. Go to netlify.com → Sign up free
2. Drag your project folder onto the deploy zone
3. App is live instantly with a free URL

### Cloudflare Pages
1. Go to pages.cloudflare.com
2. Connect GitHub repository or upload files
3. Free hosting with global CDN

---

## 📱 APK Conversion Guide (Android App)

### Method 1: PWA Builder (Easiest — No Coding Required)
1. Host the app on GitHub Pages or Netlify (see above)
2. Go to **pwabuilder.com**
3. Enter your app URL
4. Click "Build My PWA" → Select Android → Download APK package
5. Install the APK on Android by enabling "Install from unknown sources"

### Method 2: Android Studio WebView Wrapper
1. Install Android Studio (free from developer.android.com)
2. Create a new project → "Empty Activity"
3. In `activity_main.xml`, replace content with:
```xml
<WebView
    android:id="@+id/webView"
    android:layout_width="match_parent"
    android:layout_height="match_parent"/>
```
4. In `MainActivity.java`:
```java
WebView webView = findViewById(R.id.webView);
webView.getSettings().setJavaScriptEnabled(true);
webView.getSettings().setDomStorageEnabled(true);
webView.loadUrl("file:///android_asset/index.html");
```
5. Copy all app files to `app/src/main/assets/`
6. Build → Generate Signed APK

### Method 3: Capacitor (Cross-Platform)
```bash
npm install -g @capacitor/cli
npx cap init "Inner Architecture Lab" "com.mateenyousuf.innerarch"
npx cap add android
# Copy app files to www/ folder
npx cap copy
npx cap open android
# Build from Android Studio
```

### APK Signing (Required for Distribution)
```bash
keytool -genkey -v -keystore inner-arch.keystore -alias innerarch -keyalg RSA -keysize 2048 -validity 10000
# Then in Android Studio: Build → Generate Signed Bundle/APK
```

### Splash Screen Setup
- Place icon files in `res/mipmap-*/` folders (48x48, 72x72, 96x96, 144x144, 192x192 px)
- Splash background: #0a1628 (deep navy)
- App icon: Use the bronze ✦ symbol on navy background

---

## 💾 Data Storage Notes

All user data is stored in **LocalStorage** under these keys:
- `innerArchScores` — All calculated scores (discipline, purpose, ethics, resilience, habit)
- `readChapters` — Array of chapter indices the user has read

**Backup & Restore:**
```javascript
// Export (run in browser console)
const data = {
  scores: localStorage.getItem('innerArchScores'),
  chapters: localStorage.getItem('readChapters')
};
console.log(JSON.stringify(data));

// Import (run in browser console)
const data = JSON.parse('PASTE_EXPORTED_DATA_HERE');
localStorage.setItem('innerArchScores', data.scores);
localStorage.setItem('readChapters', data.chapters);
location.reload();
```

---

## 🔢 Formula Reference

| Metric | Formula |
|--------|---------|
| Discipline Stability Index | `(Study/12×35) + (1−Dist/20)×25 + (Sleep−3)/7×20 + Exer/7×10 + Refl/60×10` |
| Impulse Control Score | `100 − (Dist/20×60) + (Refl/60×20) + (Exer/7×20)` |
| Habit Strength Score | `(Freq/7×35) + (Trigger/10×25) + (Reward/10×20) + (Motivation/10×20)` |
| Purpose Clarity Index | `WordScores + Alignment×3` |
| Ethical Consistency | `(ΣEthicsChoices / MaxEthics) × 100` |
| Resilience Score | `AverageStressRating × 10` |
| Generational Cascade | `Family=Indiv×0.82 → Community=Family×0.74 → Society=Community×0.68` |

---

## 📜 License
© 2024 Mateen Yousuf · School Education Department, Kashmir
Free for educational use. Please credit the author when sharing.
