import { useSession } from "@/context/session-context";
import { useVaults } from "@/context/vault-context";
import { publicClient } from "@/services/viem/viem";
import { getNetworkConfig } from "@/shared/config/network";
import { formatToMaxDefinition } from "@/shared/utils";
import { useQuery } from "@tanstack/react-query";
import { Abi, Address, formatUnits, isAddress, MulticallParameters } from "viem";
import IERC20ABI from "../lagoon/abis/IERC20.json";
import VaultABI from "../lagoon/abis/Vault.json";

// Helper functions
function calculateSharePrice(totalAssets: bigint, totalShares: bigint, decimals: number): bigint {
  const decimalsMultiplier = BigInt(10) ** BigInt(decimals);
  return totalShares > 0n ? (totalAssets * decimalsMultiplier) / totalShares : 0n;
}

function formatBalanceValue(value: bigint, decimals: number): string {
  return formatToMaxDefinition(Number(formatUnits(value, decimals))).toString();
}

export interface VaultBalance {
  vaultId: string;
  availableSupply: string;
  shares: string;
  assets: string;
  sharePrice: string;
}

async function fetchVaultBalance(
  tokenAddress: Address,
  vaultAddress: Address,
  vaultDecimals: number,
  tokenDecimals: number,
  userAddress: Address,
  publicClient: any,
): Promise<VaultBalance> {
  const balanceContracts: MulticallParameters["contracts"] = [
    {
      address: tokenAddress,
      abi: IERC20ABI as Abi,
      functionName: "balanceOf",
      args: [userAddress],
    },
    {
      address: vaultAddress,
      abi: VaultABI as Abi,
      functionName: "balanceOf",
      args: [userAddress],
    },
    {
      address: vaultAddress,
      abi: VaultABI as Abi,
      functionName: "claimableDepositRequest",
      args: [0, userAddress],
    },
    {
      address: vaultAddress,
      abi: VaultABI as Abi,
      functionName: "pendingRedeemRequest",
      args: [0, userAddress],
    },
  ];

  const balanceResults = await publicClient.multicall({
    contracts: balanceContracts,
    allowFailure: false,
  });

  const [
    tokenBalanceResult,
    vaultSharesBalanceResult,
    claimableDepositAmountResult,
    pendingRedeemAmountResult,
  ] = balanceResults;

  // Step 2: Convert values to assets/shares
  const conversionContracts: MulticallParameters["contracts"] = [
    {
      address: vaultAddress,
      abi: VaultABI as Abi,
      functionName: "convertToAssets",
      args: [vaultSharesBalanceResult as bigint],
    },
    {
      address: vaultAddress,
      abi: VaultABI as Abi,
      functionName: "convertToShares",
      args: [claimableDepositAmountResult as bigint],
    },
    {
      address: vaultAddress,
      abi: VaultABI as Abi,
      functionName: "convertToAssets",
      args: [pendingRedeemAmountResult as bigint],
    },
  ];

  const conversionResults = await publicClient.multicall({
    contracts: conversionContracts,
    allowFailure: false,
  });

  // Extract conversion results
  const [vaultSharesInAssets, claimableDepositInShares, pendingRedeemInAssets] = conversionResults;

  // Calculate totals with proper naming
  const availableSupply = tokenBalanceResult as bigint;
  const totalShares =
    (vaultSharesBalanceResult as bigint) +
    (claimableDepositInShares as bigint) +
    (pendingRedeemAmountResult as bigint);
  const totalAssets =
    (vaultSharesInAssets as bigint) +
    (claimableDepositAmountResult as bigint) +
    (pendingRedeemInAssets as bigint);

  // Calculate share price using helper function
  const sharePrice = calculateSharePrice(totalAssets, totalShares, vaultDecimals);

  return {
    vaultId: vaultAddress,
    availableSupply: formatBalanceValue(availableSupply, tokenDecimals),
    shares: formatBalanceValue(totalShares, vaultDecimals),
    assets: formatBalanceValue(totalAssets, tokenDecimals),
    sharePrice: formatUnits(sharePrice, tokenDecimals),
  };
}

export function useVaultBalance(
  vaultId: string,
  tokenAddress: Address,
  vaultAddress: Address,
  vaultDecimals: number,
  tokenDecimals: number,
) {
  const { vaults } = useVaults();
  const { evmAddress } = useSession();
  const chain = getNetworkConfig().chain;

  const { data, ...rest } = useQuery<VaultBalance>({
    queryKey: ["vaultBalance", evmAddress, vaultId, chain.id],
    queryFn: async () => {
      if (!evmAddress || !chain.id || !publicClient || !vaults) {
        throw new Error("Missing required data for vault balance");
      }

      if (!isAddress(evmAddress)) {
        throw new Error(`Invalid wallet address: ${evmAddress}`);
      }

      return fetchVaultBalance(
        tokenAddress,
        vaultAddress,
        vaultDecimals,
        tokenDecimals,
        evmAddress as Address,
        publicClient,
      );
    },
    enabled:
      isAddress(evmAddress) &&
      vaultId !== "" &&
      localStorage.getItem("disconnect_requested") !== "true",
    staleTime: 1000 * 30,
    refetchIntervalInBackground: true,
  });

  return { vaultBalance: data, ...rest };
}

export function useAllVaultsBalance() {
  const { vaults } = useVaults();
  const { evmAddress } = useSession();
  const chain = getNetworkConfig().chain;

  const { data, ...rest } = useQuery<{ [vaultId: string]: VaultBalance }>({
    queryKey: ["allVaultsBalance", evmAddress, chain.id],
    queryFn: async () => {
      if (!evmAddress || !chain.id || !publicClient || !vaults) {
        throw new Error("Missing required data for all vaults balance");
      } 

      const allVaultsBalance = await Promise.all(vaults.vaultsData.map((vault) => useVaultBalance(vault.staticData.vault_id, vault.staticData.token_address as Address, vault.staticData.vault_address as Address, vault.staticData.token_decimals as number, vault.staticData.vault_decimals as number))); 

      return allVaultsBalance.reduce((acc, curr) => {
        if (curr.vaultBalance) {
          acc[curr.vaultBalance.vaultId] = curr.vaultBalance;
        }
        return acc;
      }, {} as { [vaultId: string]: VaultBalance });
    },
    enabled: isAddress(evmAddress) && localStorage.getItem("disconnect_requested") !== "true",
  });

  return { allVaultsBalance: data, ...rest };
}