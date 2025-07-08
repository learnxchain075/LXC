const prod = "production";
const uat = "uat";
const dev = "dev";

// Correctly access environment variables using Vite's `import.meta.env`
const appStage = import.meta.env.VITE_APP_STAGE || prod;

const developmentConfig = {
  BASE_URL: "http://localhost:3000",
  apiGateway: {
    // BASE_URL: "http://localhost:5000/api/v1",
   BASE_URL: "https://api.learnxchain.io/api/v1",
  },
};

const productionConfig = {
  BASE_URL: "http://localhost:3000",
  apiGateway: {
    // BASE_URL: "http://localhost:5000/api/v1",
     BASE_URL: "https://api.learnxchain.io/api/v1",
  },
};

const uatConfig = {
  BASE_URL: "http://localhost:3000",
  apiGateway: {
    // BASE_URL: "http://localhost:5000/api/v1",
     BASE_URL: "https://api.learnxchain.io/api/v1",
  },
};

// Fix: Use `appStage` instead of `process.env.REACT_APP_STAGE`
const baseConfig =
  appStage === prod
    ? productionConfig
    : appStage === uat
    ? uatConfig
    : developmentConfig;

const AppConfig = {
  APP_NAME: "LXC",
  APP_STAGE: appStage,
  IS_DEV_ENV: appStage === dev,
  IS_UAT_ENV: appStage === uat,
  IS_PROD_ENV: appStage === prod,
  LOCAL_STORAGE_ACCESS_TOKEN_KEY: "proAccessToken",
  LOCAL_STORAGE_REFRESH_TOKEN_KEY: "proRefreshToken",
  LOCALSTORAGE_APP_CONFIG: "CASINO-APP-CONFIG",
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
  ...baseConfig,
};

export default AppConfig;

// const developmentConfig = {
//   BASE_URL: "http://localhost:3000",
//   apiGateway: {
//     BASE_URL: "https://api.learnxchain.io/api/v1",
//   },
// };

// const productionConfig = {
//   BASE_URL: "http://localhost:3000",
//   apiGateway: {
//     BASE_URL: "https://api.learnxchain.io/api/v1",
//   },
// };

// const uatConfig = {
//   BASE_URL: "http://localhost:3000",
//   apiGateway: {
//     BASE_URL: "https://api.learnxchain.io/api/v1",
//   },
// };

// const prod = "production";
// const uat = "uat";
// const dev = "dev";

// const baseConfig =
//   process.env.REACT_APP_STAGE === prod
//     ? productionConfig
//     : process.env.REACT_APP_STAGE === uat
//     ? uatConfig
//     : developmentConfig;

// const AppConfig = {
//   APP_NAME: "LXC",
//   APP_STAGE: process.env.REACT_APP_STAGE || prod,
//   IS_DEV_ENV: process.env.REACT_APP_STAGE === dev ? true : false,
//   IS_UAT_ENV: process.env.REACT_APP_STAGE === uat ? true : false,
//   IS_PROD_ENV: process.env.REACT_APP_STAGE === prod ? true : false,
//   LOCAL_STORAGE_ACCESS_TOKEN_KEY: "proAccessToken",
//   LOCAL_STORAGE_REFRESH_TOKEN_KEY: "proRefreshToken",
//   LOCALSTORAGE_APP_CONFIG: "CASINO-APP-CONFIG",
//   ...baseConfig,
// };

// export default AppConfig;
