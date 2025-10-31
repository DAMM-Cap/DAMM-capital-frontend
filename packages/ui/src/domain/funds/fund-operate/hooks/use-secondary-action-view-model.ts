import { useMemo } from "react";

export type SecondaryActionState =
  | "deposit-claimable"
  | "deposit-pending"
  | "redeem-claimable"
  | "redeem-pending"
  | "none";

/** Minimal enum-like tags so the component chooses what to render */
export type IconKind = "check" | "clock" | null;
export type VisualKind = "stable" | "token";

export type SecondaryActionVM = {
  visible: boolean;
  label: string;
  amountLabel: string;
  buttonLabel: string;
  disabled: boolean;
  statusIcon: IconKind;
  from: VisualKind; // which visual appears on the left
  to: VisualKind; // which visual appears on the right
  tokenSymbolFrom: string;
  tokenSymbolTo: string;
  onClick: () => Promise<void>;
};

type Amountish = string | number | bigint | { toString(): string };

type Params = {
  // deposit
  isClaimableDeposit: boolean;
  isPendingDepositRequest: boolean;
  claimableDepositRequest: Amountish;
  pendingDepositRequest: Amountish;

  // redeem
  isClaimableRedeem: boolean;
  isPendingRedeemRequest: boolean;
  claimableRedeemRequest: Amountish;
  pendingRedeemRequest: Amountish;

  // symbols
  token_symbol: string;
  vault_symbol: string;

  // actions
  handleClaim: () => Promise<void>;
  handleRedeem: () => Promise<void>;
  handleCancelDeposit: () => Promise<void>;

  /** default true = keep disabled when deposit is automatically claimed by keeper bot */
  // TODO: false to allow claiming shares manually when disabling keeper bot in production
  extraDisableOnClaimableDeposit?: boolean;
};

export function useSecondaryActionViewModel({
  isClaimableDeposit,
  isPendingDepositRequest,
  claimableDepositRequest,
  pendingDepositRequest,
  isClaimableRedeem,
  isPendingRedeemRequest,
  claimableRedeemRequest,
  pendingRedeemRequest,
  token_symbol,
  vault_symbol,
  handleClaim,
  handleRedeem,
  handleCancelDeposit,
  extraDisableOnClaimableDeposit,
}: Params): SecondaryActionVM {
  return useMemo<SecondaryActionVM>(() => {
    const state: SecondaryActionState = isClaimableDeposit
      ? "deposit-claimable"
      : isPendingDepositRequest
        ? "deposit-pending"
        : isClaimableRedeem
          ? "redeem-claimable"
          : isPendingRedeemRequest
            ? "redeem-pending"
            : "none";

    if (state === "none") {
      return {
        visible: false,
        label: "",
        amountLabel: "",
        buttonLabel: "",
        disabled: true,
        statusIcon: null,
        from: "token",
        to: "token",
        tokenSymbolFrom: "",
        tokenSymbolTo: "",
        onClick: async () => {},
      };
    }

    if (state === "redeem-claimable") {
      return {
        visible: true,
        label: "Withdraw Settled",
        amountLabel: `${String(claimableRedeemRequest)} ${vault_symbol}`,
        buttonLabel: "Redeem",
        disabled: false,
        statusIcon: "check",
        from: "stable",
        to: "token",
        tokenSymbolFrom: vault_symbol,
        tokenSymbolTo: token_symbol,
        onClick: handleRedeem,
      };
    }

    if (state === "redeem-pending") {
      return {
        visible: true,
        label: "Withdraw Requested",
        amountLabel: `${String(pendingRedeemRequest)} ${vault_symbol}`,
        buttonLabel: "Redeem",
        disabled: true,
        statusIcon: "clock",
        from: "stable",
        to: "token",
        tokenSymbolFrom: vault_symbol,
        tokenSymbolTo: token_symbol,
        onClick: handleRedeem,
      };
    }

    if (state === "deposit-claimable") {
      return {
        visible: true,
        label: "Deposit Settled",
        amountLabel: `${String(claimableDepositRequest)} ${token_symbol}`,
        buttonLabel: "Claim",
        disabled: extraDisableOnClaimableDeposit ?? true,
        statusIcon: "check",
        from: "token",
        to: "stable",
        tokenSymbolFrom: token_symbol,
        tokenSymbolTo: vault_symbol,
        onClick: handleClaim,
      };
    }

    return {
      visible: true,
      label: "Deposit Requested",
      amountLabel: `${String(pendingDepositRequest)} ${token_symbol}`,
      buttonLabel: "Cancel Deposit",
      disabled: false,
      statusIcon: "clock",
      from: "token",
      to: "stable",
      tokenSymbolFrom: token_symbol,
      tokenSymbolTo: vault_symbol,
      onClick: handleCancelDeposit,
    };
  }, [
    isClaimableDeposit,
    isPendingDepositRequest,
    isClaimableRedeem,
    isPendingRedeemRequest,
    claimableDepositRequest,
    pendingDepositRequest,
    claimableRedeemRequest,
    pendingRedeemRequest,
    token_symbol,
    vault_symbol,
    handleClaim,
    handleRedeem,
    handleCancelDeposit,
    extraDisableOnClaimableDeposit,
  ]);
}
