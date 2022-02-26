import { BigNumber } from "@ethersproject/bignumber";
import { WETH } from "@sushiswap/sdk";
import ERC20_ABI from "../abi/ERC20.abi.json";
import { Contract } from "@ethersproject/contracts";
import { useActiveWeb3React } from "./useActiveWeb3React";
import { useContract } from "./useContract";
import { useCallback, useEffect, useState } from "react";
import { isAddress } from "../utils";

export interface BalanceProps {
  value: BigNumber;
  decimals: number;
}

// Do NOT use this hook, use the generic wallet hook for useTokenBalance
// Prefer import { useTokenBalance } from 'state/wallet/hooks'

function useTokenBalance(tokenAddress: string): BalanceProps {
  const [balance, setBalance] = useState<BalanceProps>({
    value: BigNumber.from(0),
    decimals: 18,
  });
  const { account, chainId, library } = useActiveWeb3React();

  const addressCheckSum = isAddress(tokenAddress);
  const tokenContract = useContract(
    addressCheckSum ? addressCheckSum : undefined,
    ERC20_ABI,
    false
  );
  const fetchBalance = useCallback(async () => {
    async function getBalance(
      contract: Contract | null,
      owner: string | null | undefined
    ): Promise<BalanceProps> {
      try {
        if (account && chainId && contract?.address === WETH[chainId].address) {
          const ethBalance = await library?.getBalance(account);
          return { value: BigNumber.from(ethBalance), decimals: 18 };
        }

        const balance = await contract?.balanceOf(owner);
        const decimals = await contract?.decimals();

        return { value: BigNumber.from(balance), decimals: decimals };
      } catch (error) {
        console.error(error);
        return { value: BigNumber.from(0), decimals: 18 };
      }
    }
    const balance = await getBalance(tokenContract, account);
    setBalance(balance);
  }, [account, chainId, library, tokenContract]);

  useEffect(() => {
    if (account && tokenContract) {
      fetchBalance();
    }
  }, [account, setBalance, tokenAddress, fetchBalance, tokenContract]);

  return balance;
}

export default useTokenBalance;
