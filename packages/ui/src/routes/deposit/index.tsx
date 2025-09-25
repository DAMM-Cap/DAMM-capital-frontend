import { Button, Card, DammStableIcon, DepositModal, InfoModal } from "@/components";
import WithdrawModal from "@/components/custom/WithdrawModal";
import { useVaults } from "@/context/vault-context";
import { useDeposit } from "@/hooks/use-deposit";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import {
  ActivityIcon,
  BookOpenCheckIcon,
  GavelIcon,
  LogInIcon,
  LogOutIcon,
  MapPinIcon,
  ScaleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

const depositSearchSchema = z.object({
  vaultId: z.string(),
});

export const Route = createFileRoute("/deposit/")({
  component: Deposit,
  validateSearch: (search) => depositSearchSchema.parse(search),
});

function Deposit() {
  const { vaultId } = useSearch({ from: "/deposit/" });
  const { vaults } = useVaults();
  const selectedVault = vaults?.vaultsData?.find((v) => v.staticData.vault_id === vaultId);

  const max = 1000;
  const position = 3500;
  const conversionValue = 0.935;
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

  const handleWithdraw = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOpenModalWithdraw(false);
    }, 2000);
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col gap-4 w-full">
        {/* Button custom */}

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

        <Button
          onClick={() => {
            setOpenModalWithdraw(true);
          }}
          variant="secondary"
          disabled={true}
        >
          <LogOutIcon size={16} />
          Withdraw
        </Button>

        {/* Modal */}
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

        <InfoModal
          open={openModalInProgress}
          onClose={() => setOpenModalInProgress(false)}
          title="Deposit in Progress"
          actions={() => (
            <>
              <Button
                className="w-1/4"
                onClick={() => setOpenModalInProgress(false)}
                variant="secondary"
              >
                Close
              </Button>
              <Button
                className="w-3/4"
                onClick={() => setOpenModalInProgress(false)}
                variant="primary"
              >
                Go to my Portfolio
              </Button>
            </>
          )}
        >
          Your deposit has been successfully submitted and is now awaiting confirmation. Processing
          may take up to 48 hours. To check the status of your deposit, you can track the
          transaction on{" "}
          <a className="underline" href="https://etherscan.io/">
            Etherscan
          </a>{" "}
          using your wallet address.
        </InfoModal>

        <InfoModal
          open={openModalWhitelisting}
          onClose={() => setOpenModalWhitelisting(false)}
          title="Whitelisting Required"
          actions={() => (
            <Button
              className="w-full"
              onClick={() => setOpenModalWhitelisting(false)}
              variant="secondary"
            >
              Close
            </Button>
          )}
        >
          Your wallet address is not whitelisted, so deposits are not allowed. To request access,
          please email us at{" "}
          <a className="underline" href="mailto:team@dammcap.finance">
            team@dammcap.finance
          </a>{" "}
          or ask in our{" "}
          <a className="underline" href="">
            FAQ Telegram Group
          </a>
          .
        </InfoModal>

        <InfoModal
          open={openModalTerms}
          onClose={() => setOpenModalTerms(false)}
          title="Acknowledge Terms"
          actions={() => (
            <>
              <Button
                className="w-1/4"
                onClick={() => setOpenModalTerms(false)}
                variant="secondary"
              >
                Reject
              </Button>
              <Button className="w-3/4" onClick={() => setOpenModalTerms(false)} variant="primary">
                Accept
              </Button>
            </>
          )}
        >
          By accessing or using DAMM Capital’s products and services, I agree to the{" "}
          <a className="underline" href="">
            Terms And Conditions
          </a>{" "}
          and{" "}
          <a className="underline" href="">
            Cookies and privacy
          </a>
          . I further confirm that:{" "}
          <Card leftIcon={<MapPinIcon size={20} />}>
            I am not located in a jurisdiction where the use of DAMM services is restricted by law.
          </Card>
          <Card leftIcon={<ScaleIcon size={20} />}>
            I am authorized to use DAMM Capital’s platform in accordance with the laws and
            regulations of my country.
          </Card>
          <Card leftIcon={<GavelIcon size={20} />}>
            I am not a sanctioned individual nor acting on behalf of one.
          </Card>
          <Card leftIcon={<ActivityIcon size={20} />}>
            I understand that using decentralized finance (DeFi) protocols carries inherent risks,
            including potential loss of funds.
          </Card>
          <Card leftIcon={<BookOpenCheckIcon size={20} />}>
            I acknowledge that DAMM Capital does not provide financial advice or custodial services
            and that I am fully responsible for my actions.
          </Card>
        </InfoModal>
      </div>
    </div>
  );
}
