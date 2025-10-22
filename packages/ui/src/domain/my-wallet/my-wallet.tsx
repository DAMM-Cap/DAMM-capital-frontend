import { Button, Card, Label, Table } from "@/components";
import { useSession } from "@/context/session-context";
import { useModal } from "@/hooks/use-modal";
import { useTokensBalance } from "@/services/shared/use-tokens-balance";
import { getNetworkConfig } from "@/shared/config/network";
import { LogInIcon, SendIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ReceiveTokensDialog } from "./components/receive-tokens-dialog";
import SendTokensDialog, { Tokens } from "./components/send-tokens-dialog";
import MyWalletSkeleton from "./components/my-wallet-skeleton";
import { useGetVaults } from "@/services/api/use-get-vaults";

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

  const { vaults = [], hasVaults, isLoading } = useGetVaults(evmAddress);
  const { data: tokensBalance } = useTokensBalance(vaults);
  const [tokens, setTokens] = useState<Tokens | undefined>(undefined);

  useEffect(() => {
    if (hasVaults && vaults) {
      const tokens: Tokens = {};
      vaults.map(
        (fund) =>
          (tokens[fund.address] = {
            icon: () => (
              <img
                src={fund.icon}
                alt={fund.name}
                className="w-5 h-5 object-cover rounded-full"
              />
            ),
            name: fund.name,
            symbol: fund.tokenSymbol,
            balance:
              tokensBalance?.vaultBalances[fund.id.toString()]?.availableSupply ||
              "0",
            metadata: {
              address: fund.tokenAddress,
              decimals: fund.tokenDecimals,
            },
          }),
      );
      setTokens(tokens);
    }
  }, [vaults, tokensBalance]);

  const isLoadingFund = isConnecting || isLoading;

  if (isLoadingFund) {
    return <div className="flex flex-col gap-4 w-full">
      <MyWalletSkeleton  />
    </div>
  }

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

      {hasVaults && tokens && (
        <Table
          tableHeaders={[
            { label: "Assets", className: "text-left" },
            { label: "Amount", className: "text-right" },
          ]}
          isLoading={isLoadingFund}
          rows={vaults?.map((fund) => ({
            rowFields: [
              {
                leftIcon: tokens[fund.id.toString()].icon,
                value: tokens[fund.id.toString()].symbol,
                className: "text-left font-bold text-lg",
              },
              {
                value: tokens[fund.id.toString()].balance,
                className: "text-right",
              },
            ],
          }))}
        />
      )}

      {!hasVaults && (
        <Card variant="fund" className="flex flex-col gap-4">
          <Label
            label="We currently have no active funds in this chain."
            className="domain-subtitle"
          />
        </Card>
      )}
      <ReceiveTokensDialog
        isOpen={isOpenReceiveTokens}
        onClose={closeReceiveTokens}
        address={evmAddress}
        network={network}
      />
      {tokens && (
        <SendTokensDialog isOpen={isOpenSendTokens} setIsOpen={closeSendTokens} tokens={tokens} />
      )}
    </div>
  );
}
