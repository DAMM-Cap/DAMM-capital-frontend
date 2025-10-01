import { createContext, useContext } from "react";
import { HeaderData } from "../custom/table";

type TableCtx = {
  tableHeaders: HeaderData[];
  isTableMobile: boolean;
  gridColsClassName: string;
  initialCol2X: boolean;
  noColor: boolean;
};
export const TableContext = createContext<TableCtx | null>(null);

export const useTable = (): TableCtx => {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error("useTable must be used within <Table>");
  return ctx;
};
