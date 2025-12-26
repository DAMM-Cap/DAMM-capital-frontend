import { Button, InfoModal } from "@/components";
import { getNetworkConfig } from "@/shared/config/network";
import { useNavigate } from "@tanstack/react-router";

interface WithdrawInProgressModalProps {
  openModalInProgress: boolean;
  setOpenModalInProgress: (openModalInProgress: boolean) => void;
  txHash: string;
}

export default function WithdrawInProgressModal({
  openModalInProgress,
  setOpenModalInProgress,
  txHash,
}: WithdrawInProgressModalProps) {
  const navigate = useNavigate();
  const networkConfig = getNetworkConfig();
  const explorerUrl = networkConfig.explorerUrl;

  if (!openModalInProgress) return null;
  return (
    <InfoModal
      open={openModalInProgress}
      onClose={() => setOpenModalInProgress(false)}
      title="Withdraw in Progress"
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
            onClick={() => {
              setOpenModalInProgress(false);
              navigate({ to: "/portfolio" });
            }}
            variant="primary"
          >
            Go to my Portfolio
          </Button>
        </>
      )}
    >
      Your withdrawal has been successfully submitted and is now awaiting confirmation. Processing
      may take up to 48 hours. To check the status of your withdraw, you can track the transaction
      on{" "}
      <a className="underline" href={`${explorerUrl}/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
        block explorer
      </a>{" "}
      using your wallet address.
    </InfoModal>
  );
}
