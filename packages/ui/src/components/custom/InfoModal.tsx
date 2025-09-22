import React from "react";
import Button from "../core/Button";
import Modal, { ModalActionButtons, ModalContents } from "../core/Modal";
import InfoLabel from "./InfoLabel";

interface InfoModalAction {
  text: string;
  onClick: () => void;
  className?: string;
}

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: {
    primary?: InfoModalAction;
    secondary?: InfoModalAction;
  };
  className?: string;
}

const InfoModal: React.FC<InfoModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  className = "w-[530px]",
}) => {
  return (
    <Modal open={open} onClose={onClose} title={title} className={className}>
      <ModalContents>
        <InfoLabel>{children}</InfoLabel>
      </ModalContents>
      <ModalActionButtons>
        {Object.entries(actions || {}).map(([key, action]) => (
          <Button
            key={key}
            className={action.className}
            onClick={action.onClick}
            variant={key === "secondary" ? "secondary" : "primary"}
          >
            {action.text}
          </Button>
        ))}
      </ModalActionButtons>
    </Modal>
  );
};

export default InfoModal;
