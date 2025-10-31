import { PositionData, VaultData, VaultDataResponse } from "@/services/api/types/vault-data";

export const mockedVaultData: VaultData = {
  tvl: 133000,
  tvlChange: 2.3,
  apr: 6.2,
  aprChange: 0.5,
  valueGained: 12.4,
  valueGainedUSD: 25.5,
  position: 200,
  positionUSD: 412.0,
  entranceRate: 0.001,
  exitRate: 0.001,
  performanceFee: 0.001,
  managementFee: 0.001,
  sharePrice: 0.001,
  aum: 0,
};

export const mockedPositionData: PositionData = {
  totalValue: 200,
  totalValueUSD: 412,
  wldBalance: 175,
  usdcBalance: 50,
  availableToRedeem: 100,
  availableToRedeemUSD: 206,
  vaultShare: 0.15,
  claimableShares: 25,
  sharesInWallet: 50,
};

export function getNullMockedVaultData(): VaultDataResponse {
  return {
    vaultMetrics: [],
    vaultsData: [
      {
        staticData: {
          vault_id: "1",
          vault_name: "Vault 1",
          vault_symbol: "V1",
          vault_address: "0x123",
          vault_decimals: 18,
          vault_status: "open",
          token_symbol: "T1",
          token_address: "0x123",
          token_decimals: 18,
          fee_receiver_address: "0x123",
        },
        vaultData: {
          tvl: 0,
          tvlChange: 0,
          apr: 0,
          aprChange: 0,
          valueGained: 0,
          valueGainedUSD: 0,
          position: 0,
          positionUSD: 0,
          entranceRate: 0,
          exitRate: 0,
          performanceFee: 0,
          managementFee: 0,
          sharePrice: 0,
          aum: 0,
        },
        positionData: {
          totalValue: 0,
          totalValueUSD: 0,
          wldBalance: 0,
          usdcBalance: 0,
          availableToRedeem: 0,
          availableToRedeemUSD: 0,
          vaultShare: 0,
          claimableShares: 0,
          sharesInWallet: 0,
        },
      },
    ],
  };
}

export function getMockedVaultData() {
  return {
    vaultsData: [
      {
        staticData: {
          vault_id: "1",
          vault_name: "Vault 1",
          vault_symbol: "V1",
          vault_address: "0x123",
          vault_decimals: 18,
          vault_status: "open",
          token_symbol: "T1",
          token_address: "0x123",
          token_decimals: 18,
          fee_receiver_address: "0x123",
        },
        vaultData: mockedVaultData,
        positionData: mockedPositionData,
      },
    ],
  };
}
