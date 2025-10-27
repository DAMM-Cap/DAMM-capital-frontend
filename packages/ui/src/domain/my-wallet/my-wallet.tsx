import { Button, Label } from "@/components";
import { useSession } from "@/context/session-context";
import { useModal } from "@/hooks/use-modal";
import { getNetworkConfig } from "@/shared/config/network";
import { LogInIcon, SendIcon } from "lucide-react";
import { ReceiveTokensDialog } from "./components/receive-tokens-dialog";
import SendTokensDialog, { TokenType } from "./components/send-tokens-dialog";
import { useGetVaults } from "@/services/api/use-get-vaults";
import { Vault } from "@/shared/types";
import { Address } from "viem";
import { TokensSection } from "./components/tokens-section";

function getTokens(vaults: Vault[]) {
  return vaults.reduce((acc, vault) => {
    acc[vault.id as Address] = {
      icon: vault.icon,
      symbol: vault.tokenSymbol,
      name: vault.name,
      metadata: {
        address: vault.tokenAddress,
        decimals: vault.tokenDecimals,
      },
    };
    return acc;
  }, {} as Record<Address, TokenType>);
}

export default function MyWallet() {
  const { evmAddress, isSignedIn, isConnecting, isSmartAccount } = useSession();
  const network = getNetworkConfig();
  const {
    isOpen: isOpenReceiveTokens,
    close: closeReceiveTokens,
    open: openReceiveTokens,
  } = useModal(false);
  const {
    isOpen: isOpenSendTokens,
    close: closeSendTokens,
    open: openSendTokens,
  } = useModal(false);

  const { vaults = [], hasVaults = false, isLoading } = useGetVaults();

  const isLoadingFund = isConnecting || isLoading;


  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row justify-between mb-10">
        <Label label="Wallet Overview" className="domain-title" />

        {isSmartAccount && hasVaults && (
          <div className="flex flex-row gap-4">
            <Button onClick={openReceiveTokens} disabled={!isSignedIn || isConnecting}>
              <LogInIcon className="rotate-90" />
              Receive
            </Button>
            <Button
              onClick={openSendTokens}
              disabled={!isSignedIn || isConnecting}
              variant="secondary"
            >
              <SendIcon />
              Send
            </Button>
          </div>
        )}
      </div>

      <TokensSection vaults={vaults} hasVaults={hasVaults} isLoading={isLoadingFund} />

      <ReceiveTokensDialog
        isOpen={isOpenReceiveTokens}
        onClose={closeReceiveTokens}
        address={evmAddress}
        network={network}
      />
      {hasVaults && (
        <SendTokensDialog
          isOpen={isOpenSendTokens}
          setIsOpen={closeSendTokens}
          tokens={getTokens(vaults)}
        />
      )}
    </div>
  );
}
