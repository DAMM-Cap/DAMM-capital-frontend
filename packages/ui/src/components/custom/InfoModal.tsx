import React from "react";
import Modal from "../core/Modal";
import InfoLabel from "./InfoLabel";
interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: () => React.ReactNode;
  className?: string;
}

const InfoModal: React.FC<InfoModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  className = "w-[40rem]",
}) => {
  return (
    <Modal open={open} onClose={onClose} title={title} className={className} actions={actions}>
      <InfoLabel>{children}</InfoLabel>
    </Modal>
  );
};

export default InfoModal;
