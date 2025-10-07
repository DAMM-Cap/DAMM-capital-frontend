import { Label } from "@/components";

import { Button } from "@/components";

import { Card } from "@/components";
import { useWithdraw } from "@/services/lagoon/use-withdraw";
import { CircleCheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFundOperateData } from "../hooks/use-fund-operate-data";

export default function SecondaryActionCard({
  vaultId,
  handleLoading,
}: {
  vaultId: string;
  handleLoading: (isLoading: boolean) => void;
}) {
  const { useWithdrawData } = useFundOperateData(vaultId!);
  const { isClaimableRedeem, claimableRedeemRequest } = useWithdrawData();

  const [isLoading, setIsLoading] = useState(false);

  const { submitRedeem } = useWithdraw();
  const {
    position,
    conversionValue,
    vault_address,
    availableToRedeemRaw,
    vault_status,
    token_symbol,
    token_address,
    fee_receiver_address,
    exitRate,
    availableAssets: max,
  } = useWithdrawData();

  useEffect(() => {
    handleLoading(isLoading);
  }, [isLoading]);

  const handleRedeem = async () => {
    setIsLoading(true);

    // Execute transaction
    const amount = String(availableToRedeemRaw);
    // Execute transaction
    const tx = await submitRedeem(
      vault_address,
      token_address,
      fee_receiver_address,
      exitRate,
      amount,
    );

    // Wait for confirmation
    await tx.wait();

    setIsLoading(false);
  };

  return (
    isClaimableRedeem && (
      <div className="flex flex-row justify-center gap-4">
        <Card>
          <Label
            label="Withdraw Request Settled"
            className="!font-bold !text-lg !text-textLight mb-1"
          />
          <div className="flex flex-row justify-between gap-2">
            <div className="flex flex-row gap-2 items-center">
              <img
                src={token_symbol} // TODO: Replace with token icon
                alt={token_symbol}
                className="w-5 h-5 object-cover rounded-full -mt-2"
              />
              <Label label={token_symbol} className="!text-lg !text-textLight mb-1" />
            </div>
            <CircleCheckIcon size={28} />
          </div>
          <Label label={`${claimableRedeemRequest.toString()} ${token_symbol}`} className="mb-4" />

          <Button variant="primary" className="w-full" onClick={handleRedeem}>
            Redeem
          </Button>
        </Card>
      </div>
    )
  );
}
