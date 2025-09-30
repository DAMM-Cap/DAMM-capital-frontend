import { Button, InfoModal } from "@/components";

interface InsufficientBalanceModalProps {
  openModalInsufficientBalance: boolean;
  setOpenModalInsufficientBalance: (openModalInsufficientBalance: boolean) => void;
}

export default function InsufficientBalanceModal({
  openModalInsufficientBalance,
  setOpenModalInsufficientBalance,
}: InsufficientBalanceModalProps) {
  if (!openModalInsufficientBalance) return null;
  return (
    <InfoModal
      open={openModalInsufficientBalance}
      onClose={() => setOpenModalInsufficientBalance(false)}
      title="Insufficient Balance"
      actions={() => (
        <>
          <Button
            className="w-1/4"
            onClick={() => setOpenModalInsufficientBalance(false)}
            variant="secondary"
          >
            Close
          </Button>
          <Button
            className="w-3/4"
            onClick={() => setOpenModalInsufficientBalance(false)}
            variant="primary"
          >
            Add Funds
          </Button>
        </>
      )}
    >
      You need funds to deposit. Open My Wallet to fund your Smart Account, then try again.
    </InfoModal>
  );
}
