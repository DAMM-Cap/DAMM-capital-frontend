import { DammStableIcon, Fund, Label, TitleLabel } from "@/components";
import { useSession } from "@/context/session-context";
import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import Deposit from "./deposit";
import { useFundOperateData } from "./hooks/use-fund-operate-data";
import Withdraw from "./withdraw";

export default function FundOperate() {
  const { vaultId } = useSearch({ from: "/fund-operate/" });
  const { useFundData, isLoading: vaultLoading } = useFundOperateData(vaultId!);
  const { isSignedIn } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  try {
    const {
      vault_name,
      vault_symbol,
      apr,
      aprChange,
      vault_icon,
      token_symbol,
      totalValue,
      vaultShare,
      claimableShares,
      tvl,
    } = useFundData();

    return (
      !vaultLoading && (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col gap-4 w-full">
            <Label label="Selected Fund" className="domain-title mb-[0.5rem]" />
            <Fund
              leftIcon={<DammStableIcon size={20} />}
              title={vault_name}
              subtitle={vault_symbol}
              secondColumnText={apr.toString()}
              thirdColumnText={aprChange.toString()}
              fourthColumnText={tvl.toString()}
              tokenIcon={
                <img
                  src={vault_icon}
                  alt={vault_name}
                  className="w-5 h-5 object-cover rounded-full"
                />
              }
              tokenName={token_symbol}
              onClick={() => {}}
              isLoading={isLoading}
              className="w-full"
            />
            {isSignedIn && (
              <>
                <Label label="My position" className="domain-title mt-[1.5rem]" />
                <TitleLabel
                  title={totalValue}
                  secondaryTitle={vaultShare}
                  label={claimableShares}
                />

                <Deposit vaultId={vaultId!} handleLoading={setIsLoading} />

                <Withdraw vaultId={vaultId!} handleLoading={setIsLoading} />
              </>
            )}
          </div>
        </div>
      )
    );
  } catch (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col gap-4 w-full text-center">
          <Label label="Vault Not Found" className="domain-title mb-[0.5rem]" />
          <p className="text-textLight">The requested vault could not be found.</p>
        </div>
      </div>
    );
  }
}
