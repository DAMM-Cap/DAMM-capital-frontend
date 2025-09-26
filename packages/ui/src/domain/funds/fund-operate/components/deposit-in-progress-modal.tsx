import { Button, InfoModal } from "@/components";

interface DepositInProgressModalProps {
  openModalInProgress: boolean;
  setOpenModalInProgress: (openModalInProgress: boolean) => void;
}

export default function DepositInProgressModal({
  openModalInProgress,
  setOpenModalInProgress,
}: DepositInProgressModalProps) {
  if (!openModalInProgress) return null;
  return (
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
          <Button className="w-3/4" onClick={() => setOpenModalInProgress(false)} variant="primary">
            Go to my Portfolio
          </Button>
        </>
      )}
    >
      Your deposit has been successfully submitted and is now awaiting confirmation. Processing may
      take up to 48 hours. To check the status of your deposit, you can track the transaction on{" "}
      <a className="underline" href="https://etherscan.io/">
        Etherscan
      </a>{" "}
      using your wallet address.
    </InfoModal>
  );
}
