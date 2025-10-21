import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'ionicProject',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resize: 'none' // Prevent content from moving when keyboard opens
    }
  }
};

export default config;
