import { Button, Label, Table } from "@/components";
import { useSession } from "@/context/session-context";
import { useVaults } from "@/context/vault-context";
import { useModal } from "@/hooks/use-modal";
import { VaultsDataView } from "@/services/api/types/data-presenter";
import { useTokensBalance } from "@/services/shared/use-tokens-balance";
import { getNetworkConfig } from "@/shared/config/network";
import { LogInIcon, SendIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ReceiveTokensDialog } from "./components/receive-tokens-dialog";
import SendTokensDialog, { Tokens } from "./components/send-tokens-dialog";

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

  const [isLoadingFund, setIsLoadingFund] = useState(false);
  const { vaults, isLoading } = useVaults();
  const vaultsData: VaultsDataView[] | undefined = vaults?.vaultsData;
  const { data: tokensBalance } = useTokensBalance();
  const [tokens, setTokens] = useState<Tokens | undefined>(undefined);

  useEffect(() => {
    if (vaultsData) {
      const tokens: Tokens = {};
      vaultsData.map(
        (fund) =>
          (tokens[fund.staticData.vault_id.toString()] = {
            icon: () => (
              <img
                src={fund.staticData.vault_icon}
                alt={fund.staticData.vault_name}
                className="w-5 h-5 object-cover rounded-full"
              />
            ),
            name: fund.staticData.vault_name,
            symbol: fund.staticData.token_symbol,
            balance:
              tokensBalance?.vaultBalances[fund.staticData.vault_id.toString()]?.availableSupply ||
              "0",
            metadata: {
              address: fund.staticData.token_address,
              decimals: fund.staticData.token_decimals,
            },
          }),
      );
      setTokens(tokens);
    }
  }, [vaultsData, tokensBalance]);

  useEffect(() => {
    setIsLoadingFund(true);
    setTimeout(() => {
      setIsLoadingFund(false);
    }, 1000);
  }, [isLoading]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row justify-between mb-10">
        <Label label="Wallet Overview" className="domain-title" />

        <div className="flex flex-row gap-4">
          <Button
            onClick={openReceiveTokens}
            disabled={!isSignedIn || isConnecting || !isSmartAccount}
          >
            <LogInIcon className="rotate-90" />
            Receive
          </Button>
          <Button
            onClick={openSendTokens}
            disabled={!isSignedIn || isConnecting || !isSmartAccount}
            variant="secondary"
          >
            <SendIcon />
            Send
          </Button>
        </div>
      </div>
      {vaultsData && tokens && (
        <Table
          tableHeaders={[
            { label: "Assets", className: "text-left" },
            { label: "Amount", className: "text-right" },
          ]}
          isLoading={isLoadingFund}
          rows={vaultsData.map((fund) => ({
            rowFields: [
              {
                leftIcon: tokens[fund.staticData.vault_id.toString()].icon,
                value: tokens[fund.staticData.vault_id.toString()].symbol,
                className: "text-left font-bold text-lg",
              },
              {
                value: tokens[fund.staticData.vault_id].balance,
                className: "text-right",
              },
            ],
          }))}
        />
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
