import { Label } from "@/components";
import { useSession } from "@/context/session-context";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import FundsArea from "./components/funds-area";
import SingleValueCard from "./components/single-value-card";
import { usePortfolioData } from "./hooks/use-portfolio-data";

export default function Portfolio() {
  const navigate = useNavigate();
  const { isSignedIn } = useSession();
  const [isLoadingFund, setIsLoadingFund] = useState(true);
  const { getPortfolioSingleValuesData } = usePortfolioData();

  const { tvl, yieldEarned, deposited } = getPortfolioSingleValuesData();

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingFund(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!isSignedIn) {
      navigate({ to: "/funds" });
    }
  }, [isSignedIn]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col">
        <Label label="Portfolio" className="domain-title" />
        <Label
          label="Track your deposits and earnings across all funds."
          className="domain-subtitle pb-4 pt-1"
        />
      </div>

      <div className="overflow-y-auto max-h-content-area scrollbar-visible">
        <div className="flex flex-wrap justify-between items-center gap-x-4">
          <SingleValueCard
            label="Total Portfolio Value"
            value={tvl.toString()}
            isLoading={isLoadingFund}
          />
          <SingleValueCard
            label="Total Yield Earned"
            value={yieldEarned.toString()}
            isLoading={isLoadingFund}
            className="!text-primary"
          />
          <SingleValueCard
            label="Total Deposited"
            value={deposited.toString()}
            isLoading={isLoadingFund}
          />
        </div>

        <FundsArea isLoading={isLoadingFund} />
      </div>
    </div>
  );
}
