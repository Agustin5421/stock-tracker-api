import type { Options } from '@wdio/types'
import path from 'path'

export const config: Options.Testrunner = {
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './tsconfig.json',
      transpileOnly: true
    }
  },
  port: 4723, // Puerto por defecto del servidor de Appium
  specs: [
    './test/specs/**/*.ts'
  ],
  exclude: [],
  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android Emulator', // Nombre genérico para capturar cualquier emulador activo de Android Studio
    'appium:app': path.join(__dirname, '..', '..', 'web', 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk'),
    'appium:newCommandTimeout': 240,
    'appium:autoGrantPermissions': true,
    'appium:chromedriverAutodownload': true
  }],
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [], // No agregamos 'appium' service aquí para que puedas correr el servidor por separado y ver los logs livianamente en tu consola
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  }
}
