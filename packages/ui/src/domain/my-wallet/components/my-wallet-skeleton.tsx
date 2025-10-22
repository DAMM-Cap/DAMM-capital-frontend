import { Label, Table } from "@/components";

export default function MyWalletSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row justify-between mb-10">
        <Label label="Wallet Overview" className="domain-title" />
      </div>
        <Table
          tableHeaders={[
            { label: "Assets", className: "text-left" },
            { label: "Amount", className: "text-right" },
          ]}
          isLoading={true}
          rows={Array.from({ length: 5 }).map(() => ({
            rowFields: [
              { value: "Loading..." },
              { value: "Loading..." },
            ],
          }))}
        />
    </div>
  );
}
