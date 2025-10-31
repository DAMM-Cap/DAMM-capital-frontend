import { Button, Card, InfoModal } from "@/components";
import { ActivityIcon, BookOpenCheckIcon, GavelIcon, MapPinIcon, ScaleIcon } from "lucide-react";

interface AcknowledgeTermsModalProps {
  openModalTerms: boolean;
  setOpenModalTerms: (openModalTerms: boolean) => void;
  handleAccept: () => void;
}

export default function AcknowledgeTermsModal({
  openModalTerms,
  setOpenModalTerms,
  handleAccept,
}: AcknowledgeTermsModalProps) {
  if (!openModalTerms) return null;
  return (
    <InfoModal
      open={openModalTerms}
      onClose={() => setOpenModalTerms(false)}
      title="Acknowledge Terms"
      actions={() => (
        <>
          <Button className="w-1/4" onClick={() => setOpenModalTerms(false)} variant="secondary">
            Reject
          </Button>
          <Button
            className="w-3/4"
            onClick={() => {
              handleAccept();
              setOpenModalTerms(false);
            }}
            variant="primary"
          >
            Accept
          </Button>
        </>
      )}
    >
      By accessing or using DAMM Capital’s products and services, I agree to the{" "}
      <a className="underline" href="https://dammcap.finance/Terms-And-Conditions">
        Terms And Conditions
      </a>{" "}
      and{" "}
      <a className="underline" href="https://dammcap.finance/cookies-and-privacy">
        Cookies and privacy
      </a>
      . I further confirm that:{" "}
      <Card leftIcon={<MapPinIcon size={20} />}>
        I am not located in a jurisdiction where the use of DAMM services is restricted by law.
      </Card>
      <Card leftIcon={<ScaleIcon size={20} />}>
        I am authorized to use DAMM Capital’s platform in accordance with the laws and regulations
        of my country.
      </Card>
      <Card leftIcon={<GavelIcon size={20} />}>
        I am not a sanctioned individual nor acting on behalf of one.
      </Card>
      <Card leftIcon={<ActivityIcon size={20} />}>
        I understand that using decentralized finance (DeFi) protocols carries inherent risks,
        including potential loss of funds.
      </Card>
      <Card leftIcon={<BookOpenCheckIcon size={20} />}>
        I acknowledge that DAMM Capital does not provide financial advice or custodial services and
        that I am fully responsible for my actions.
      </Card>
    </InfoModal>
  );
}
