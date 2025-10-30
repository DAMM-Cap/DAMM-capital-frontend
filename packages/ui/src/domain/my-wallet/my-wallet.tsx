import { Button, Card, Label, Table } from "@/components";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import { useSession } from "@/context/session-context";
import { useVaults } from "@/context/vault-context";
import { useRescueToken } from "@/domain/my-wallet/hooks/use-rescue-token";
import { Tokens } from "@/domain/types/token";
import { useModal } from "@/hooks/use-modal";
import { VaultsDataView } from "@/services/api/types/data-presenter";
import { POLL_BALANCES_MY_WALLET_INTERVAL, POLL_VAULTS_DATA_MY_WALLET_INTERVAL } from "@/shared/config/constants";
import { getNetworkConfig } from "@/shared/config/network";
import clsx from "clsx";
import { HeartHandshakeIcon, LogInIcon, SendIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ReceiveTokensDialog, RescueTokenDialog, SendTokensDialog } from "./components";
import { useTokensBalance } from "./hooks/use-tokens-balance";

export default function MyWallet() {
  const { evmAddress, isSignedIn, isConnecting, isSmartAccount } = useSession();
  const isMobile = useIsMobile();
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
  const {
    isOpen: isOpenRescueToken,
    close: closeRescueToken,
    open: openRescueToken,
  } = useModal(false);

  const [isLoadingFund, setIsLoadingFund] = useState(true);
  const { vaults } = useVaults(POLL_VAULTS_DATA_MY_WALLET_INTERVAL);
  const vaultsData: VaultsDataView[] | undefined = vaults?.vaultsData;
  const { data: tokensBalance, refetch: refetchTokensBalance } = useTokensBalance(
    POLL_BALANCES_MY_WALLET_INTERVAL
  );
  const [tokens, setTokens] = useState<Tokens | undefined>(undefined);
  const noVaults = !vaultsData || vaultsData.length === 0 || !vaultsData?.[0]?.staticData.vault_id;
  const nullAddress = "0x0000000000000000000000000000000000000000";
  const [erc20Address, setErc20Address] = useState(nullAddress);
  const { data: rescueToken, error: rescueTokenError } = useRescueToken({
    rescueTokenAddress: erc20Address,
  });

  useEffect(() => {
    if (vaultsData) {
      const tokens: Tokens = {};
      vaultsData.map(
        (fund) =>
          (tokens[fund.staticData.token_address] = {
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
              Number(
                tokensBalance?.[fund.staticData.vault_id]?.availableSupply,
              ) || 0,
            metadata: {
              address: fund.staticData.token_address,
              decimals: fund.staticData.token_decimals,
            },
          }),
      );
      setTokens(tokens);
    }
  }, [vaultsData, tokensBalance]);

  const pushRescueToken = (erc20Address: string) => {
    setErc20Address(erc20Address);
  };

  useEffect(() => {
    if (!rescueToken || !erc20Address || !tokens) return;

    try {
      const tokensLocal: Tokens = { ...tokens };
      tokensLocal[erc20Address] = {
        name: rescueToken.name,
        symbol: rescueToken.symbol,
        balance: rescueToken.balance,
        metadata: {
          address: erc20Address,
          decimals: rescueToken.decimals,
        },
      };
      setTokens(tokensLocal);
    } catch (error) {
      setErc20Address(nullAddress);
    }
  }, [erc20Address, rescueToken]);

  useEffect(() => {
    if (rescueTokenError && erc20Address !== nullAddress) {
      setErc20Address(nullAddress);
    }
  }, [rescueTokenError]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingFund(false);
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row justify-between mb-10">
        <Label label={clsx(isMobile ? "Wallet" : "Wallet Overview")} className="domain-title" />
        {isSmartAccount && !noVaults && (
          <div className="flex flex-row gap-4">
            <Button
              onClick={openReceiveTokens}
              disabled={!isSignedIn || isConnecting}
              className={clsx(isMobile && "h-8 w-12")}
            >
              <LogInIcon className={clsx("rotate-90", isMobile && "size-4")} />
              {isMobile ? "" : "Receive"}
            </Button>
            <Button
              onClick={openSendTokens}
              disabled={!isSignedIn || isConnecting}
              variant="secondary"
              className={clsx(isMobile && "h-8 w-12")}
            >
              <SendIcon className={clsx(isMobile && "size-4")} />
              {isMobile ? "" : "Send"}
            </Button>
            <Button
              onClick={openRescueToken}
              disabled={!isSignedIn || isConnecting}
              variant="secondary"
              className={clsx(isMobile && "h-8 w-12")}
            >
              <HeartHandshakeIcon className={clsx(isMobile && "size-4")} />
              {isMobile ? "" : "Rescue"}
            </Button>
          </div>
        )}
      </div>
      {!noVaults && tokens && (
        <Table
          tableHeaders={[
            { label: "Assets", className: "text-left" },
            { label: "Amount", className: "text-right" },
          ]}
          isLoading={isLoadingFund}
          rows={Object.values(tokens).map((token) => ({
            rowFields: [
              {
                leftIcon: token.icon,
                value: token.symbol,
                className: "text-left font-bold text-lg",
              },
              {
                value: token.balance.toString(),
                className: "text-right",
              },
            ],
          }))}
        />
      )}
      {noVaults && (
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
        <SendTokensDialog
          isOpen={isOpenSendTokens}
          setIsOpen={closeSendTokens}
          tokens={tokens}
          refetchTokensBalance={refetchTokensBalance}
        />
      )}
      <RescueTokenDialog
        isOpen={isOpenRescueToken}
        setIsOpen={closeRescueToken}
        pushRescueToken={pushRescueToken}
      />
    </div>
  );
}
