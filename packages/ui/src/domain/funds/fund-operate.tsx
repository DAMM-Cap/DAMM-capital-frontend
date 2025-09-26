import {
  Button,
  DammStableIcon,
  DepositModal,
  Fund,
  Label,
  TitleLabel,
  WithdrawModal,
} from "@/components";
import { useSession } from "@/context/session-context";
import { useVaults } from "@/context/vault-context";
import { useDeposit } from "@/services/lagoon/use-deposit";
import { useWithdraw } from "@/services/lagoon/use-withdraw";
import { useSearch } from "@tanstack/react-router";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { useEffect, useState } from "react";
import AcknowledgeTermsModal from "./components/acknowledge-terms-modal";
import DepositInProgressModal from "./components/deposit-in-progress-modal";
import WhitelistingModal from "./components/whitelisting-modal";

export default function FundOperate() {
  const { vaultId } = useSearch({ from: "/fund-operate/" });
  const { vaults } = useVaults();
  const selectedVault = vaults?.vaultsData?.find((v) => v.staticData.vault_id === vaultId);
  const { isSignedIn } = useSession();

  const max = 1000;
  const position = selectedVault?.positionData.totalValueRaw || 0;
  const conversionValue = selectedVault?.vaultData.sharePrice || 0;
  const [amount, setAmount] = useState("");
  const [referral, setReferral] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [invalidReferral, setInvalidReferral] = useState(false);
  const [validReferral, setValidReferral] = useState(false);
  const [openModalWithdraw, setOpenModalWithdraw] = useState(false);
  const [openModalInProgress, setOpenModalInProgress] = useState(false);
  const [openModalWhitelisting, setOpenModalWhitelisting] = useState(false);
  const [openModalTerms, setOpenModalTerms] = useState(false);

  const { submitRequestDeposit } = useDeposit();
  const { submitRequestWithdraw, submitRedeem } = useWithdraw();

  useEffect(() => {
    if (referral.length > 0) {
      if (referral.startsWith("0x") && referral.length >= 4) {
        setInvalidReferral(false);
        setValidReferral(true);
      } else {
        setInvalidReferral(true);
        setValidReferral(false);
      }
    } else {
      setInvalidReferral(false);
      setValidReferral(false);
    }
  }, [referral]);

  useEffect(() => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      setInvalidAmount(true);
      setIsInsufficientBalance(false);
    } else {
      setInvalidAmount(false);
      const isInsufficientBalance = numericAmount > max;
      setIsInsufficientBalance(isInsufficientBalance);
    }
  }, [amount]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsLoading(false);
  };

  const handleDeposit = async () => {
    setIsLoading(true);

    // Execute transaction
    const tx = await submitRequestDeposit(
      selectedVault!.staticData.vault_address,
      selectedVault!.staticData.token_address,
      selectedVault!.staticData.token_decimals,
      selectedVault!.staticData.fee_receiver_address,
      selectedVault!.vaultData.entranceRate,
      amount,
    );

    // Wait for confirmation
    await tx.wait();

    setTimeout(() => {
      setIsLoading(false);
      setOpenModal(false);
      setOpenModalInProgress(true);
    }, 2000);
  };

  const handleWithdraw = async () => {
    setIsLoading(true);

    // Execute transaction
    const tx = await submitRequestWithdraw(selectedVault!.staticData.vault_address, amount);

    // Wait for confirmation
    await tx.wait();

    setTimeout(() => {
      setIsLoading(false);
      setOpenModalWithdraw(false);
    }, 2000);
  };

  const handleRedeem = async () => {
    setIsLoading(true);

    // Execute transaction
    const amount = String(selectedVault!.positionData.availableToRedeemRaw);
    // Execute transaction
    const tx = await submitRedeem(
      selectedVault!.staticData.vault_address,
      selectedVault!.staticData.token_address,
      selectedVault!.staticData.fee_receiver_address,
      selectedVault!.vaultData.exitRate,
      amount,
    );

    // Wait for confirmation
    await tx.wait();

    setTimeout(() => {
      setIsLoading(false);
      setOpenModalWithdraw(false);
    }, 2000);
  };

  return (
    selectedVault && (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col gap-4 w-full">
          <Label label="Selected Fund" className="domain-title mb-[0.5rem]" />
          <Fund
            leftIcon={<DammStableIcon size={20} />}
            title={selectedVault.staticData.vault_name}
            subtitle={selectedVault.staticData.vault_symbol}
            secondColumnText={selectedVault.vaultData.apr.toString()}
            thirdColumnText={selectedVault.vaultData.aprChange.toString()}
            fourthColumnText={selectedVault.vaultData.tvl.toString()}
            tokenIcon={
              <img
                src={selectedVault.staticData.vault_icon}
                alt={selectedVault.staticData.vault_name}
                className="w-5 h-5 object-cover rounded-full"
              />
            }
            tokenName={selectedVault.staticData.token_symbol}
            onClick={() => {}}
            isLoading={isLoading}
            className="w-full"
          />
          {isSignedIn && (
            <>
              <Label label="My position" className="domain-title mt-[1.5rem]" />
              <TitleLabel
                title={selectedVault.positionData.totalValue}
                secondaryTitle={selectedVault.positionData.vaultShare}
                label={selectedVault.positionData.claimableShares}
              />

              <Button
                onClick={() => {
                  setOpenModal(true);
                  setOpenModalWhitelisting(true);
                  setOpenModalTerms(true);
                }}
              >
                <LogInIcon size={16} />
                Deposit
              </Button>
              {(selectedVault.positionData.availableToRedeemRaw &&
                selectedVault.positionData.availableToRedeemRaw > 0) ||
              selectedVault.staticData.vault_status !== "open" ? (
                <Button onClick={() => handleRedeem()}>
                  <LogOutIcon size={16} />
                  <span>
                    {selectedVault.positionData.availableToRedeemRaw}{" "}
                    {selectedVault.staticData.token_symbol}
                  </span>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setOpenModalWithdraw(true);
                  }}
                  variant="secondary"
                >
                  <LogOutIcon size={16} />
                  Withdraw
                </Button>
              )}
            </>
          )}
          <DepositModal
            open={openModal}
            onClose={() => handleCloseModal()}
            amount={amount}
            onAmountChange={(e) => setAmount(e.target.value)}
            onMaxClick={() => setAmount(max.toString())}
            max={max}
            position={position}
            conversionValue={conversionValue}
            positionConverted={position * conversionValue}
            referralCode={referral}
            invalidReferral={invalidReferral}
            validReferral={validReferral}
            onReferralCodeChange={(e) => setReferral(e.target.value)}
            onDeposit={() => handleDeposit()}
            isLoading={isLoading}
            isInsufficientBalance={isInsufficientBalance}
            invalidAmount={invalidAmount}
            tokenSymbol="DUSDC"
            tokenIcon={<DammStableIcon size={20} />}
          />
          <WithdrawModal
            open={openModalWithdraw}
            onClose={() => setOpenModalWithdraw(false)}
            amount={amount}
            onAmountChange={(e) => setAmount(e.target.value)}
            onMaxClick={() => setAmount(max.toString())}
            max={max}
            position={position}
            positionConverted={position * conversionValue}
            onWithdraw={() => handleWithdraw()}
            isLoading={isLoading}
            isInsufficientShares={isInsufficientBalance}
            invalidAmount={invalidAmount}
            tokenSymbol="DUSDC"
            tokenIcon={<DammStableIcon size={20} />}
            conversionValue={conversionValue}
          />
          <DepositInProgressModal
            openModalInProgress={openModalInProgress}
            setOpenModalInProgress={setOpenModalInProgress}
          />
          <WhitelistingModal
            openModalWhitelisting={openModalWhitelisting}
            setOpenModalWhitelisting={setOpenModalWhitelisting}
          />
          <AcknowledgeTermsModal
            openModalTerms={openModalTerms}
            setOpenModalTerms={setOpenModalTerms}
          />
        </div>
      </div>
    )
  );
}
