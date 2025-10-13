import { useSession } from "@/context/session-context";
import { getNetworkConfig } from "@/shared/config/network.ts";
import { TransactionResponse } from "@ethersproject/providers";
import { useSign7702Authorization, useWallets } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { encodeFunctionData, LocalAccount, zeroAddress } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { EvmBatchCall } from "../privy/use-privy-txs";
import { getWalletClient } from "../viem/viem";
import accountAbi from "./abi/abi.ts";

export function useEip7702() {
  const chain = getNetworkConfig();
  const { isSignedIn, evmAddress: usersAccount } = useSession();
  const walletClient = getWalletClient(usersAccount as `0x${string}`);
  const { client } = useSmartWallets();
  const accountImplementation = "0x4Cd241E8d1510e30b2076397afc7508Ae59C66c9";
  const { signAuthorization } = useSign7702Authorization();
  const { wallets } = useWallets();

  const handlePrivy7702Authorization = async (setAuthorization: boolean = false) => {
    try {
      const authorization = await signAuthorization(
        {
          contractAddress: setAuthorization ? accountImplementation : zeroAddress,
          chainId: chain.chain.id,
        },
        {
          address: usersAccount as `0x${string}`,
        },
      );
      return authorization;
    } catch (error) {
      console.error("Failed to sign authorization:", error);
      throw new Error("Failed to sign authorization");
    }
  };

  const eip7702Authorization = async (setAuthorization: boolean = false) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const authorization = await signAuthorization({
      contractAddress: setAuthorization ? accountImplementation : zeroAddress,
      executor: "self",
    });

    /* const usersLocalWallet = wallets.find((wallet) => wallet.address === usersAccount); // as unknown as LocalAccount;
    if (!usersLocalWallet) throw new Error("Failed to get user local wallet");
    const authorization = (await usersLocalWallet.getEthereumProvider()).request({
      method: "wallet_sendCalls",
      params: [
        {
          chainId: chain.chain.id,
          nonce: Number(BigInt(Date.now())),
          contractAddress: setAuthorization ? accountImplementation : zeroAddress,
        },
      ],
    }); */

    /* if (!("signAuthorization" in usersLocalWallet) || !usersLocalWallet.signAuthorization) {
      throw new Error("Wallet does not support EIP-7702 authorization signing");
    }
    const authorization = await usersLocalWallet.signAuthorization({
      chainId: chain.chain.id,
      nonce: Number(BigInt(Date.now())),
      contractAddress: setAuthorization ? accountImplementation : zeroAddress,
    }); */

    const hash = await walletClient.sendTransaction({
      authorizationList: [authorization],
      data: "0x",
      to: usersAccount as `0x${string}`,
    });
    const txResponse = {
      hash: hash,
      wait: () => waitForTransactionReceipt(walletClient, { hash: hash as `0x${string}` }),
    } as unknown as TransactionResponse;

    return txResponse as unknown as TransactionResponse;
  };

  const eip7702ExecuteBatch = async (calls: EvmBatchCall) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const callsArray = calls.map((call) => ({
      target: call.to,
      value: call.value ?? 0n,
      data: encodeFunctionData({
        abi: call.abi,
        functionName: call.functionName,
        args: call.args,
      }),
    }));
    const hash = await walletClient.writeContract({
      abi: accountAbi,
      address: usersAccount as `0x${string}`,
      functionName: "executeBatch",
      args: [callsArray],
    });
    const txResponse = {
      hash: hash,
      wait: () => waitForTransactionReceipt(walletClient, { hash: hash as `0x${string}` }),
    } as unknown as TransactionResponse;

    return txResponse as unknown as TransactionResponse;
  };

  const handlePrivy7702ExecuteBatch = async (calls: EvmBatchCall) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    await handlePrivy7702Authorization(true);
    //await eip7702Authorization(true);
    const txResp = await eip7702ExecuteBatch(calls);
    await handlePrivy7702Authorization(false);
    //await eip7702Authorization(false);
    return txResp;
  };
  return {
    handlePrivy7702ExecuteBatch,
  };
}
