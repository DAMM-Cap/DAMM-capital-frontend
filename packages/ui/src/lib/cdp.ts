/**
 * Copyright 2025-present Coinbase Global, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { RequestFaucetParams } from "@/lib/types/cdp";
import { publicClient } from "@/lib/viem";
import { CdpClient } from "@coinbase/cdp-sdk";
import { getNetworkConfig } from "./network";

export const cdpClient: CdpClient = new CdpClient({
  apiKeyId: process.env.CDP_API_KEY_ID,
  apiKeySecret: process.env.CDP_API_KEY_SECRET,
  walletSecret: process.env.CDP_WALLET_SECRET,
});

export async function requestFaucetFunds(params: RequestFaucetParams) {
  const network = getNetworkConfig().network as "ethereum-sepolia" | "base-sepolia"; // ONLY TESTNETS
  const { transactionHash } = await cdpClient.evm.requestFaucet({
    address: params.address,
    network: network,
    token: params.tokenName,
  });

  await publicClient.waitForTransactionReceipt({
    hash: transactionHash,
  });
}
