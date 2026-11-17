import type { CapacitorConfig } from '@capacitor/cli';

// Prepared for M3. No Android project exists yet; this file only
// describes how the web build will be wrapped when we add one.
const config: CapacitorConfig = {
  // Approved permanent ID. It cannot change after publishing to Google Play.
  appId: 'io.github.mancy07.koreanacademy',
  appName: 'Korean Academy',

  // Vite builds the web app into `dist/`; Capacitor packages that folder.
  webDir: 'dist',

  server: {
    // Serve the app from https://localhost inside the Android WebView.
    // A stable origin keeps IndexedDB (our user data) in a consistent place.
    androidScheme: 'https',
  },
};

export default config;
