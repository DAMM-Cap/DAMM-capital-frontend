import { useCallback, useEffect, useState } from "react";

export interface SelectorOptions<T> {
  [vaultId: string]: T;
}

export function useSelector<T>(
  options: SelectorOptions<T>,
  defaultIndex = 0,
  opts?: {
    onReset?: () => void;
    onChange?: () => void;
    onChangeReactive?: (selectedRow: T) => void;
  },
) {
  const defaultSelection = options[Object.keys(options)[defaultIndex]];
  const [selectedRow, setSelectedRow] = useState<T>(defaultSelection);

  // Auto-select first option when options change from empty to populated
  useEffect(() => {
    if (Object.keys(options).length > 0) {
      reset();
    }
  }, [options]);

  const change = useCallback(
    (key: string) => {
      setSelectedRow(options[key]);
      opts && opts.onChange?.();
      opts && opts.onChangeReactive?.(options[key]);
    },
    [options, opts],
  );

  const reset = useCallback(() => {
    setSelectedRow(defaultSelection);
    opts && opts.onReset?.();
  }, [options, defaultIndex, opts]);

  const getNextRow = useCallback(() => {
    const keys = Object.keys(options);
    if (keys.length <= 1) return selectedRow;

    const currentIndex = keys.findIndex((key) => options[key] === selectedRow);
    const nextIndex = (currentIndex + 1) % keys.length;
    const nextKey = keys[nextIndex];

    return options[nextKey];
  }, [options, selectedRow]);

  return { selectedRow, getNextRow, change, reset };
}
