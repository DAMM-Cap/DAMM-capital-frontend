import { useOperationStateQuery } from "@/services/lagoon/use-operation-state";
import { Vault } from "@/shared/types";
import { useMemo } from "react";

export enum OperationStatus {
  CONFIRMED = "Confirmed",
  DEPOSIT_PENDING = "Deposit Pending",
  WITHDRAW_PENDING = "Withdraw Pending",
  SHARES_CLAIMABLE = "Shares Claimable",
  ASSETS_CLAIMABLE = "Assets Claimable",
}

export interface OperationState {
  status: OperationStatus;
  variant: "outline-secondary" | "outline";
  isActive: boolean;
}

export interface OperationStateData {
  vaultId: string;
  operation: OperationStatus;
  operationVariant: "outline-secondary" | "outline";
  operationActive: boolean;
}

export function useOperationStatus(vaultsData: Vault[]) {
  const { data: opState } = useOperationStateQuery(
    vaultsData?.map(vault => ({
      vaultId: vault.id,
      vaultAddress: vault.address,
      tokenDecimals: vault.tokenDecimals,
      vaultDecimals: vault.decimals,
    })) ?? []
  );

  const operationStates = useMemo((): Record<string, OperationStateData> => {
    if (!vaultsData || !opState) {
      return {};
    }

    const states: Record<string, OperationStateData> = {};

    vaultsData.forEach((vault) => {
      const vaultId = vault.id;
      const thisOpState = opState.find((o) => o.vaultId === vaultId);
      
      if (!thisOpState) {
        states[vaultId] = {
          vaultId,
          operation: OperationStatus.CONFIRMED,
          operationVariant: "outline-secondary",
          operationActive: false,
        };
        return;
      }

      let operation = OperationStatus.CONFIRMED;
      let operationVariant: "outline-secondary" | "outline" = "outline-secondary";
      
      if (thisOpState.pendingDepositRequest > 0) {
        operation = OperationStatus.DEPOSIT_PENDING;
        operationVariant = "outline-secondary";
      }
      if (thisOpState.pendingRedeemRequest > 0) {
        operation = OperationStatus.WITHDRAW_PENDING;
        operationVariant = "outline-secondary";
      }
      if (thisOpState.claimableDepositRequest > 0) {
        operation = OperationStatus.SHARES_CLAIMABLE;
        operationVariant = "outline";
      }
      if (thisOpState.claimableRedeemRequest > 0) {
        operation = OperationStatus.ASSETS_CLAIMABLE;
        operationVariant = "outline";
      }

      states[vaultId] = {
        vaultId,
        operation,
        operationVariant,
        operationActive: operation !== OperationStatus.CONFIRMED,
      };
    });

    return states;
  }, [vaultsData, opState]);

  const getOperationState = (vaultId: string): OperationStateData => {
    return operationStates[vaultId] || {
      vaultId,
      operation: OperationStatus.CONFIRMED,
      operationVariant: "outline-secondary",
      operationActive: false,
    };
  };

  return {
    operationStates,
    getOperationState,
  };
}
