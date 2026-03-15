import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quest.app',
  appName: 'Quest',
  webDir: 'dist',
  server: {
    url: 'https://quest-ed.vercel.app',
    cleartext: true
  }
};

export default config;
