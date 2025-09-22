import { Button, Card, DammStableIcon, Label, TableFunds, TitleComponent } from "@/components";
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
      <TitleComponent title="Funds" className="mb-2 [&_h4]:!text-[30px]" />
      <Label
        label="Choose from our selection of DeFi Funds."
        className="-mt-4 pb-4 [&_label]:!text-[17px] !font-bold text-textLight]"
      />

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

      <Card variant="fund" className="flex flex-col gap-0 items-center text-center !p-8 !mt-16">
        <div className="w-full flex justify-center -mb-4">
          <TitleComponent title="Ready to start Earning?" className="mb-2 [&_h4]:!text-[17px]" />
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
