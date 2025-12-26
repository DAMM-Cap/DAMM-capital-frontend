import { IntegratedDataResponse } from "@/services/api/types/vault-data";
import { formatToMaxDefinition } from "@/shared/utils";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";

export type IntegratedPosition = {
  vault_id: string;
  vault_name: string;
  vault_symbol: string;
  vault_address: string;
  vault_decimals: number;
  vault_status: string;
  token_symbol: string;
  token_address: string;
  token_decimals: number;
  fee_receiver_address: string;
  latest_tvl: number;
  tvl_12h_ago: number;
  latest_apy: number;
  apy_12h_ago: number;
  share_price: number;
  deposit_value: number;
  withdrawal_value: number;
  position_value: number;
  user_total_shares: number;
  total_shares: number;
  completed_deposits: number;
  settled_redeems: number;
  completed_redeems: number;
  entrance_rate: number;
  exit_rate: number;
  performance_rate: number;
  management_rate: number;
  performance_fee: number;
  management_fee: number;
  shares_balance: number;
};

export function getNullMockedIntegratedPosition(): {
  positions: IntegratedPosition[];
} {
  return {
    positions: [
      {
        vault_id: "",
        vault_name: "",
        vault_symbol: "",
        vault_address: "",
        vault_decimals: 0,
        vault_status: "",
        token_symbol: "",
        token_address: "",
        token_decimals: 0,
        fee_receiver_address: "",
        latest_tvl: 0,
        tvl_12h_ago: 0,
        latest_apy: 0,
        apy_12h_ago: 0,
        share_price: 0,
        deposit_value: 0,
        withdrawal_value: 0,
        position_value: 0,
        user_total_shares: 0,
        total_shares: 0,
        completed_deposits: 0,
        settled_redeems: 0,
        completed_redeems: 0,
        entrance_rate: 0,
        exit_rate: 0,
        performance_rate: 0,
        management_rate: 0,
        performance_fee: 0,
        management_fee: 0,
        shares_balance: 0,
      },
    ],
  };
}

function computeAvailableToRedeem(settledRedeems: number, decimals: number): number {
  // TODO: check if this is correct. Should we use the share price?
  return Number(formatUnits(BigNumber.from(settledRedeems.toString()), decimals));
}

function computeClaimableSharesFromRaw(
  completedDeposits: number, // e.g. 1000000 USDC
  sharePriceFixed: BigNumber, // e.g. 9.99999e-13
  completedRedeems: number, // e.g. 999999 (in 18 decimals)
  decimals: number,
): number {
  const deposits = BigNumber.from(completedDeposits.toString());
  const redeems = BigNumber.from(completedRedeems.toString());

  const sharesFromDeposits = sharePriceFixed.gt(0)
    ? deposits
        .mul(BigNumber.from(10).pow(decimals)) // scale to 18 decimals
        .div(sharePriceFixed)
    : BigNumber.from(0);

  let rawOutput = sharesFromDeposits.sub(redeems);
  if (rawOutput.lt(0)) {
    rawOutput = BigNumber.from(0);
  }

  return Number(formatUnits(rawOutput, decimals));
}

export function convertIntegratedPosition(
  response: { positions: IntegratedPosition[] },
  //sharesInWallet: number | null = null,
  wldUsdPrice: number = 1, // hardcoded or fetched elsewhere
  wldBalance: number | null = null,
  usdcBalance: number | null = null,
): IntegratedDataResponse[] {
  const result: IntegratedDataResponse[] = [];

  for (const p of response.positions) {
    const tvlChangePct =
      p.tvl_12h_ago > 0 ? ((p.latest_tvl - p.tvl_12h_ago) / p.tvl_12h_ago) * 100 : 0;

    const apyChangePct = p.latest_apy - p.apy_12h_ago;

    const valueGainedWLD = p.position_value - (p.deposit_value - p.withdrawal_value);
    const valueGainedUSD = valueGainedWLD * wldUsdPrice;

    const vaultSharePct =
      p.total_shares > 0 ? ((p.user_total_shares - p.settled_redeems) / p.total_shares) * 100 : 0;

    // Convert scientific notation to fixed decimal string
    const sharePriceStr = Number(p.share_price).toFixed(p.vault_decimals);
    const sharePriceFixed = parseUnits(sharePriceStr, p.vault_decimals);

    const availableToRedeemWLD = computeAvailableToRedeem(p.settled_redeems, p.token_decimals);

    const claimableShares = computeClaimableSharesFromRaw(
      p.completed_deposits,
      sharePriceFixed,
      p.completed_redeems,
      p.vault_decimals,
    );

    const formattedPositionValue = p.position_value / 10 ** p.token_decimals;
    const formattedUserTotalSharesValue = p.user_total_shares / 10 ** p.vault_decimals;
    const formattedPositionConvertedValue =
      (p.user_total_shares * p.share_price) / 10 ** p.token_decimals;

    const thisVaultData: IntegratedDataResponse = {
      staticData: {
        vault_id: p.vault_id,
        vault_name: p.vault_name,
        vault_symbol: p.vault_symbol,
        vault_address: p.vault_address,
        vault_decimals: p.vault_decimals,
        vault_status: p.vault_status,
        token_symbol: p.token_symbol,
        token_address: p.token_address,
        token_decimals: p.token_decimals,
        fee_receiver_address: p.fee_receiver_address,
      },
      vaultData: {
        tvl: formatToMaxDefinition(p.latest_tvl / 10 ** p.token_decimals),
        tvlChange: formatToMaxDefinition(tvlChangePct),
        apr: formatToMaxDefinition(p.latest_apy),
        aprChange: formatToMaxDefinition(apyChangePct),
        valueGained: formatToMaxDefinition(valueGainedWLD),
        valueGainedUSD: formatToMaxDefinition(valueGainedUSD),
        position: formatToMaxDefinition(formattedPositionValue),
        positionUSD: formatToMaxDefinition(formattedPositionValue * wldUsdPrice),
        entranceRate: formatToMaxDefinition(p.entrance_rate / 100), // Convert basis points to percentage
        exitRate: formatToMaxDefinition(p.exit_rate / 100), // Convert basis points to percentage
        performanceRate: formatToMaxDefinition(p.performance_rate / 100), // Convert basis points to percentage
        managementRate: formatToMaxDefinition(p.management_rate / 100), // Convert basis points to percentage
        sharePrice: Number(p.share_price),
        aum: formatToMaxDefinition((p.latest_tvl / 10 ** p.token_decimals) * p.share_price),
      },
      positionData: {
        totalValue: formatToMaxDefinition(formattedUserTotalSharesValue),
        totalValueUSD: formatToMaxDefinition(formattedPositionConvertedValue),
        availableToRedeem: formatToMaxDefinition(availableToRedeemWLD),
        availableToRedeemUSD: formatToMaxDefinition(availableToRedeemWLD * wldUsdPrice),
        claimableShares: formatToMaxDefinition(claimableShares),
        vaultShare: formatToMaxDefinition(vaultSharePct),
        sharesInWallet: formatToMaxDefinition(p.shares_balance),
        wldBalance: formatToMaxDefinition(wldBalance || 0),
        usdcBalance: formatToMaxDefinition(usdcBalance || 0),
      },
    };

    result.push(thisVaultData);
  }
  return result;
}
