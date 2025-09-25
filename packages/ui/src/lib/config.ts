import { type Config } from "@coinbase/cdp-core";
import { type AppConfig } from "@coinbase/cdp-react";

export const CDP_CONFIG: Config = {
  projectId: import.meta.env.VITE_CDP_PROJECT_ID,
  createAccountOnLogin: "evm-smart",
};

export const APP_CONFIG: AppConfig = {
  name: "Login",
  //logoUrl: "http://localhost:3000/logo.svg",
  authMethods: ["email" /* , "sms" */],
  showCoinbaseFooter: true,
};
