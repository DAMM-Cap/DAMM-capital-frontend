import { useSession } from "@/context/session-context";
import { useVaults } from "@/context/vault-context";
import { VaultsDataView } from "@/services/api/types/data-presenter";
import { useOperationState } from "@/services/lagoon/use-operation-state";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function usePortfolioData(vaultId?: string) {
  const { vaults, isLoading } = useVaults();
  const [selectedVault, setSelectedVault] = useState<VaultsDataView | undefined>(undefined);
  const { isSignedIn } = useSession();
  const {
    isPendingDepositRequest,
    isPendingRedeemRequest,
    isClaimableDepositRequest,
    isClaimableRedeemRequest,
  } = useOperationState();
  // Operation state polled via TanStack Query

  useEffect(() => {
    if (vaultId && vaults?.vaultsData) {
      const foundVault = vaults.vaultsData.find((v) => v.staticData.vault_id === vaultId);
      setSelectedVault(foundVault);
    }
  }, [vaultId, vaults]);

  const {
    data: opState = {
      isPendingDeposit: false,
      isPendingRedeem: false,
      isClaimableDeposit: false,
      isClaimableRedeem: false,
    },
  } = useQuery({
    queryKey: ["operationState", selectedVault?.staticData.vault_address, isSignedIn],
    queryFn: async () => {
      if (!selectedVault) {
        return {
          isPendingDeposit: false,
          isPendingRedeem: false,
          isClaimableDeposit: false,
          isClaimableRedeem: false,
        };
      }
      const [pendingDep, pendingRed, claimDep, claimRed] = await Promise.all([
        isPendingDepositRequest(selectedVault.staticData.vault_address),
        isPendingRedeemRequest(selectedVault.staticData.vault_address),
        isClaimableDepositRequest(selectedVault.staticData.vault_address),
        isClaimableRedeemRequest(selectedVault.staticData.vault_address),
      ]);
      return {
        isPendingDeposit: pendingDep,
        isPendingRedeem: pendingRed,
        isClaimableDeposit: claimDep,
        isClaimableRedeem: claimRed,
      };
    },
    enabled: Boolean(selectedVault && isSignedIn),
    refetchInterval: 5000,
  });

  function useFundData() {
    if (!selectedVault) {
      return {
        vault_name: "",
        apr: "0",
        vault_icon: "",
        token_symbol: "",
        positionSize: "0",
        yieldEarned: "0",
        operation: "",
        operationVariant: "outline-secondary",
      };
    }

    let operation = "Confirmed";
    let operationVariant = "outline-secondary";
    if (opState.isPendingDeposit) {
      operation = "Deposit Pending";
      operationVariant = "outline-secondary";
    }
    if (opState.isPendingRedeem) {
      operation = "Withdraw Pending";
      operationVariant = "outline-secondary";
    }
    if (opState.isClaimableDeposit) {
      operation = "Shares Claimable";
      operationVariant = "outline";
    }
    if (opState.isClaimableRedeem) {
      operation = "Assets Claimable";
      operationVariant = "outline";
    }
    return {
      vault_name: selectedVault.staticData.vault_name,
      apr: selectedVault.vaultData.apr,
      positionSize: selectedVault.vaultData.positionRaw,
      yieldEarned:
        selectedVault.vaultData.positionRaw * selectedVault.vaultData.sharePrice -
        selectedVault.vaultData.positionRaw,
      vault_icon: selectedVault.staticData.vault_icon,
      token_symbol: selectedVault.staticData.token_symbol,
      operation: operation,
      operationVariant: operationVariant,
    };
  }

  function usePortfolioSingleValuesData() {
    const { tvl, yieldEarned, deposited } = vaults?.vaultsData
      ?.map((fund) => ({
        tvl: fund.vaultData.positionRaw * fund.vaultData.sharePrice,
        yieldEarned:
          fund.vaultData.positionRaw * fund.vaultData.sharePrice - fund.vaultData.positionRaw,
        deposited: fund.vaultData.positionRaw,
      }))
      .reduce(
        (acc, curr) => ({
          tvl: Number(acc.tvl) + Number(curr.tvl),
          yieldEarned: Number(acc.yieldEarned) + Number(curr.yieldEarned),
          deposited: Number(acc.deposited) + Number(curr.deposited),
        }),
        { tvl: 0, yieldEarned: 0, deposited: 0 },
      ) ?? { tvl: 0, yieldEarned: 0, deposited: 0 };
    return {
      tvl,
      yieldEarned,
      deposited,
    };
  }

  return {
    useFundData,
    usePortfolioSingleValuesData,
    vaultIds: vaults?.vaultsData?.map((fund) => fund.staticData.vault_id),
    isLoading: isLoading,
  };
}
