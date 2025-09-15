import { Button, Card, DammStableIcon, DepositModal, InfoModal, Link } from "@/components";
import WithdrawModal from "@/components/custom/WithdrawModal";
import ActivityIcon from "@/components/icons/Activity";
import BookOpenCheckIcon from "@/components/icons/BookOpenCheck";
import EnterIcon from "@/components/icons/EnterIcon";
import GavelIcon from "@/components/icons/Gavel";
import MapPinIcon from "@/components/icons/MapPin";
import RedeemIcon from "@/components/icons/RedeemIcon";
import ScaleIcon from "@/components/icons/Scale";
import envParsed from "@/envParsed";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/deposit/")({
  component: Deposit,
});

function Deposit() {
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

  const handleDeposit = () => {
    setIsLoading(true);
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
          <EnterIcon />
          Deposit
        </Button>

        <Button
          onClick={() => {
            setOpenModalWithdraw(true);
          }}
          variant="secondary"
        >
          <RedeemIcon />
          Withdraw
        </Button>

        {/* Modal */}
        <DepositModal
          open={openModal}
          onClose={() => handleCloseModal()}
          amount={amount}
          onAmountChange={setAmount}
          onMaxClick={() => setAmount(max.toString())}
          max={max}
          position={position}
          conversionValue={conversionValue}
          positionConverted={position * conversionValue}
          referralCode={referral}
          invalidReferral={invalidReferral}
          validReferral={validReferral}
          onReferralCodeChange={setReferral}
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
          onAmountChange={setAmount}
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
          actions={{
            secondary: {
              text: "Close",
              onClick: () => setOpenModalInProgress(false),
              className: "w-1/4",
            },
            primary: {
              text: "Go to my Portfolio",
              onClick: () => setOpenModalInProgress(false),
              className: "w-3/4",
            },
          }}
        >
          Your deposit has been successfully submitted and is now awaiting confirmation. Processing
          may take up to 48 hours. To check the status of your deposit, you can track the
          transaction on <Link href="https://etherscan.io/">Etherscan</Link> using your wallet
          address.
        </InfoModal>

        <InfoModal
          open={openModalWhitelisting}
          onClose={() => setOpenModalWhitelisting(false)}
          title="Whitelisting Required"
          actions={{
            secondary: {
              text: "Close",
              onClick: () => setOpenModalWhitelisting(false),
            },
          }}
        >
          Your wallet address is not whitelisted, so deposits are not allowed. To request access,
          please email us at <Link href="mailto:team@dammcap.finance">team@dammcap.finance</Link> or
          ask in our <Link href="">FAQ Telegram Group</Link>.
        </InfoModal>

        <InfoModal
          open={openModalTerms}
          onClose={() => setOpenModalTerms(false)}
          title="Acknowledge Terms"
          actions={{
            secondary: {
              text: "Reject",
              onClick: () => setOpenModalTerms(false),
              className: "w-1/4",
            },
            primary: {
              text: "Accept",
              onClick: () => setOpenModalTerms(false),
              className: "w-3/4",
            },
          }}
        >
          By accessing or using DAMM Capital’s products and services, I agree to the{" "}
          <Link href="">Terms And Conditions</Link> and <Link href="">Cookies and privacy</Link>. I
          further confirm that:{" "}
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
