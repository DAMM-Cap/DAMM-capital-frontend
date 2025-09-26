import { Button, InfoModal } from "@/components";

interface WhitelistingModalProps {
  openModalWhitelisting: boolean;
  setOpenModalWhitelisting: (openModalWhitelisting: boolean) => void;
}

export default function WhitelistingModal({
  openModalWhitelisting,
  setOpenModalWhitelisting,
}: WhitelistingModalProps) {
  if (!openModalWhitelisting) return null;
  return (
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
      Your wallet address is not whitelisted, so deposits are not allowed. To request access, please
      email us at{" "}
      <a className="underline" href="mailto:team@dammcap.finance">
        team@dammcap.finance
      </a>{" "}
      or ask in our{" "}
      <a className="underline" href="">
        FAQ Telegram Group
      </a>
      .
    </InfoModal>
  );
}
