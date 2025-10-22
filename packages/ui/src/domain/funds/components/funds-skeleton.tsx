import { Label, Table } from "@/components";

export default function FundsSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col">
          <Label label="Funds" className="domain-title" />
          <Label
            label="Choose from our selection of DeFi Funds."
            className="domain-subtitle pb-4 pt-1"
          />
        </div>

        <Table
          tableHeaders={[
            { label: "Name", className: "text-left" },
            { label: "Net APY", className: "text-left" },
            { label: "30 days Net APY", className: "text-left" },
            { label: "AUM", className: "text-left" },
            { label: "Underlying Asset", className: "text-left" },
          ]}
          isLoading={true}
          rows={Array.from({ length: 5 }).map(() => ({
            rowFields: [
              { value: "Loading..." },
              { value: "Loading..." },
              { value: "Loading..." },
              { value: "Loading..." },
              { value: "Loading..." },
            ],
          }))}
        />
      </div>
    </div>
  );
}
