import { z } from "zod";

// NOTE: DO NOT destructure process.env

const env = {
  NODE_ENV: import.meta.env.NODE_ENV || import.meta.env.VITE_SEPOLIA_NODE_URL === "false"? "production" : "development",
  APP_URL: import.meta.env.VITE_APP_URL,
  API_GATEWAY: import.meta.env.VITE_API_GATEWAY,
  PRIVY_APP_ID: import.meta.env.VITE_PRIVY_APP_ID,
  PRIVY_CLIENT_ID: import.meta.env.VITE_PRIVY_CLIENT_ID,
  USE_SEPOLIA: import.meta.env.VITE_USE_SEPOLIA,
  SEPOLIA_NODE_URL: import.meta.env.VITE_SEPOLIA_NODE_URL,
  OPTIMISM_NODE_URL: import.meta.env.VITE_OPTIMISM_NODE_URL,
  BOT_CLAIMS_ON_BEHALF_ACTIVE: import.meta.env.VITE_BOT_CLAIMS_ON_BEHALF_ACTIVE,
  MAX_DEFINITION: parseInt(import.meta.env.VITE_MAX_DEFINITION || "5"),
  BLOCK_VAULT: import.meta.env.VITE_BLOCK_VAULT,
};

const envSchema = z
  .object({
    NODE_ENV: z.string().optional().default("development"),
    APP_URL: z.string().url().optional().default("http://localhost:5000"),
    API_GATEWAY: z.string().url().optional().default("http://localhost:5000"),
    PRIVY_APP_ID: z.string().optional().default(""),
    PRIVY_CLIENT_ID: z.string().optional().default(""),
    USE_SEPOLIA: z.string().optional().default(""),
    SEPOLIA_NODE_URL: z.string().optional().default(""),
    OPTIMISM_NODE_URL: z.string().optional().default(""),
    BOT_CLAIMS_ON_BEHALF_ACTIVE: z.string().optional().default(""),
    MAX_DEFINITION: z.number().optional().default(5),
    BLOCK_VAULT: z.string().optional().default(""),
  })
  .required();

const envParsed = () => envSchema.parse(env);

export default envParsed;
