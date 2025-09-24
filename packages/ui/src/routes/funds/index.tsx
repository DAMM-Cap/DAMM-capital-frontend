import { Button, Card, DammStableIcon, Label, TableFunds } from "@/components";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogInIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/funds/")({
  component: Funds,
});

function Funds() {
  const navigate = useNavigate();
  const [isLoadingFund, setIsLoadingFund] = useState(false);

  useEffect(() => {
    setIsLoadingFund(true);
    setTimeout(() => {
      setIsLoadingFund(false);
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col">
        <Label label="Funds" className="domain-title" />
        <Label
          label="Choose from our selection of DeFi Funds."
          className="domain-subtitle pb-4 pt-1"
        />
      </div>

      <TableFunds
        funds={[
          {
            leftIcon: <DammStableIcon size={20} />,
            title: "DAMM Stable",
            subtitle: "Managed by DAMM Capital",
            secondColumnText: "9.02%",
            thirdColumnText: "8.28%",
            fourthColumnText: "$31.6M",
            tokenIcon: <DammStableIcon size={20} />,
            tokenName: "DUSDC",
            onClick: () => {
              navigate({ to: "/deposit" });
            },
            isLoading: isLoadingFund,
          },
          {
            leftIcon: <DammStableIcon size={20} />,
            title: "DAMM Stable",
            subtitle: "Managed by DAMM Capital",
            secondColumnText: "9.02%",
            thirdColumnText: "8.28%",
            fourthColumnText: "$31.6M",
            tokenIcon: <DammStableIcon size={20} />,
            tokenName: "DUSDC",
            onClick: () => {
              navigate({ to: "/deposit" });
            },
            isLoading: isLoadingFund,
          },
          {
            leftIcon: <DammStableIcon size={20} />,
            title: "DAMM Stable",
            subtitle: "Managed by DAMM Capital",
            secondColumnText: "9.02%",
            thirdColumnText: "8.28%",
            fourthColumnText: "$31.6M",
            tokenIcon: <DammStableIcon size={20} />,
            tokenName: "DUSDC",
            onClick: () => {
              navigate({ to: "/deposit" });
            },
            isLoading: isLoadingFund,
          },
        ]}
      />

      <Card
        variant="fund"
        className="flex flex-col gap-0 items-center text-center !p-6 lg:!p-8 !mt-2 lg:!mt-16"
      >
        <div className="w-full flex justify-center">
          <Label label="Ready to start Earning?" className="mb-4 domain-secondary-title" />
        </div>
        <div className="w-full flex justify-center">
          <Label label="Connect your wallet to deposit into any of our funds." className="pb-4" />
        </div>
        <div className="w-full flex justify-center">
          <Button onClick={() => {}} className="!text-xs">
            <LogInIcon size={16} />
            Connect Wallet to Get Started
          </Button>
        </div>
      </Card>
    </div>
  );
}
