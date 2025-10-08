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
import SendTokensDialog from "./components/send-tokens-dialog";

interface TokenType {
  iconSrc: string;
  iconAlt: string;
  symbol: string;
  amount: string;
  tokenAddress: string;
  tokenDecimals: number;
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
  } = useModal(false, { onClose: () => setSelectedToken(undefined) });

  const [isLoadingFund, setIsLoadingFund] = useState(false);
  const { vaults, isLoading } = useVaults();
  const vaultsData: VaultsDataView[] | undefined = vaults?.vaultsData;
  const { data: tokensBalance } = useTokensBalance();
  const [selectedToken, setSelectedToken] = useState<TokenType | undefined>(undefined);

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
            disabled={!isSignedIn || isConnecting || !isSmartAccount || !selectedToken}
            variant="secondary"
          >
            <SendIcon />
            Send
          </Button>
        </div>
      </div>
      {vaultsData && (
        <Table
          tableHeaders={[
            { label: "Assets", className: "text-left" },
            { label: "Amount", className: "text-right" },
          ]}
          isLoading={isLoadingFund}
          rows={vaultsData!.map((fund) => ({
            onClick: () =>
              setSelectedToken({
                iconSrc: fund.staticData.vault_icon,
                iconAlt: fund.staticData.vault_name,
                symbol: fund.staticData.token_symbol,
                amount:
                  tokensBalance?.vaultBalances[fund.staticData.vault_id.toString()]
                    ?.availableSupply || "0",
                tokenAddress: fund.staticData.token_address,
                tokenDecimals: fund.staticData.token_decimals,
              }),
            rowFields: [
              {
                leftIcon: () => (
                  <img
                    src={fund.staticData.vault_icon}
                    alt={fund.staticData.vault_name}
                    className="w-5 h-5 object-cover rounded-full"
                  />
                ),
                value: fund.staticData.token_symbol,
                className: "text-left font-bold text-lg",
              },
              {
                value:
                  tokensBalance?.vaultBalances[fund.staticData.vault_id.toString()]
                    ?.availableSupply || "0",
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
      <SendTokensDialog
        isOpen={isOpenSendTokens}
        setIsOpen={closeSendTokens}
        token={{
          tokenData: {
            leftIcon: () => (
              <img
                src={selectedToken?.iconSrc}
                alt={selectedToken?.iconAlt}
                className="w-5 h-5 object-cover rounded-full"
              />
            ),
            value: selectedToken?.symbol || "",
          },
          tokenBalance: {
            value: selectedToken?.amount || "",
          },
          tokenMetaData: {
            tokenAddress: selectedToken?.tokenAddress || "",
            tokenDecimals: selectedToken?.tokenDecimals || 0,
          },
        }}
      />
    </div>
  );
}
