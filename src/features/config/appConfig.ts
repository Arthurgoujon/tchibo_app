export interface CouponAppConfig {
  firebaseWebClientId: string;
  stripeKey: string;
  apiBaseUrl: string;
  paymentConfirmApiTimeoutMs: number;
  defaultRequestTimeoutMs: number;
  couponUrlPrefix: string;
  googlePlacesToken: string;
}

function loadConfig() {
  const currentEnv = process.env.NODE_ENV;
  switch (currentEnv) {
    case 'development':
      return require('../config/appconfig.development.json') as CouponAppConfig;
    case 'production':
      return require('../config/appconfig.release.json') as CouponAppConfig;
  }
  throw Error(`Config doesn't exist for env: ${currentEnv}`);
}

const AppConfig = loadConfig();

export {AppConfig};
