import { z } from "zod";

// NOTE: DO NOT destructure process.env

const env = {
  APP_URL: import.meta.env.VITE_APP_URL,
  API_GATEWAY: import.meta.env.VITE_API_GATEWAY,
  PRIVY_APP_ID: import.meta.env.VITE_PRIVY_APP_ID,
  PRIVY_CLIENT_ID: import.meta.env.VITE_PRIVY_CLIENT_ID,
  USE_MAINNET: import.meta.env.VITE_USE_MAINNET,
  USE_SEPOLIA: import.meta.env.VITE_USE_SEPOLIA,
  BASE_NODE_URL: import.meta.env.VITE_BASE_NODE_URL,
  SEPOLIA_NODE_URL: import.meta.env.VITE_SEPOLIA_NODE_URL,
};

const envSchema = z
  .object({
    APP_URL: z.string().url().optional().default("http://localhost:5000"),
    API_GATEWAY: z.string().url().optional().default("http://localhost:5000"),
    PRIVY_APP_ID: z.string().optional().default(""),
    PRIVY_CLIENT_ID: z.string().optional().default(""),
    USE_MAINNET: z.string().optional().default(""),
    USE_SEPOLIA: z.string().optional().default(""),
    BASE_NODE_URL: z.string().optional().default(""),
    SEPOLIA_NODE_URL: z.string().optional().default(""),
  })
  .required();

const envParsed = () => envSchema.parse(env);

export default envParsed;
