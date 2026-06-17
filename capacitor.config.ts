import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.blinkmaid.app',
  appName: 'BlinkMaid',
  webDir: 'out',
  server: {
    // Direct live link so your mobile app updates instantly when you push web changes
    url: 'https://www.blinkmaid.com/', 
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: true,
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;