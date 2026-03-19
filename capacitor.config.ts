import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.questia.app',
  appName: 'QuestIA',
  webDir: 'dist',
  backgroundColor: '#0f172a',
  server: {
    androidScheme: 'https',
    cleartext: true
  }
};

export default config;
