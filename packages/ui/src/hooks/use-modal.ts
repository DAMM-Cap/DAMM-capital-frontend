import { useCallback, useState } from "react";

export function useModal(initial = false, opts?: { onOpen?: () => void; onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(initial);

  const toggle = useCallback(
    (next?: boolean) => {
      setIsOpen((prev: boolean) => {
        const value = typeof next === "boolean" ? next : !prev;
        value ? opts?.onOpen?.() : opts?.onClose?.();
        return value;
      });
    },
    [opts],
  );

  const open = useCallback(() => toggle(true), [toggle]);
  const close = useCallback(() => toggle(false), [toggle]);

  return { isOpen, open, close, toggle, setIsOpen };
}
