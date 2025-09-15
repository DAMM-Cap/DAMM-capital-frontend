import React from "react";
import Button from "../core/Button";
import Modal, { ModalActionButtons, ModalContents } from "../core/Modal";
import InfoLabel from "./InfoLabel";

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: {
    primary?: {
      text: string;
      onClick: () => void;
      className?: string;
    };
    secondary?: {
      text: string;
      onClick: () => void;
      className?: string;
    };
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
  const renderActions = () => {
    if (!actions) return [];

    const buttons = [];
    if (actions.secondary) {
      buttons.push(
        <Button
          key="secondary"
          className={actions.secondary.className}
          onClick={actions.secondary.onClick}
          variant="secondary"
        >
          {actions.secondary.text}
        </Button>,
      );
    }
    if (actions.primary) {
      buttons.push(
        <Button
          key="primary"
          className={actions.primary.className}
          onClick={actions.primary.onClick}
        >
          {actions.primary.text}
        </Button>,
      );
    }

    return buttons;
  };

  return (
    <Modal open={open} onClose={onClose} title={title} className={className}>
      <ModalContents>
        <InfoLabel>{children}</InfoLabel>
      </ModalContents>
      <ModalActionButtons>{renderActions()}</ModalActionButtons>
    </Modal>
  );
};

export default InfoModal;
