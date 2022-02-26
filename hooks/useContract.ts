import { Contract } from "@ethersproject/contracts";
import ERC20ABI from "../abi/ERC20.abi.json";

import REWARDPOOL_ABI from "../abi/RewardPool.json";
import BLACKSWANLAKE_ABI from "../abi/BlackSwanLake.json";
import DISTRIBUTIONPOOL_ABI from "../abi/DistributionPool.json";
import { abi as UNI_FACTORY_ABI } from "@uniswap/v2-core/build/UniswapV2Factory.json";

import { useMemo } from "react";
import {
  SWANLAKE_ADDRESS,
  BPT_ADDRESS,
  DISTRIBUTION_POOL_ADDRESS,
  USDC,
} from "../constants";

import { getContract } from "../utils";
import { useActiveWeb3React } from "./useActiveWeb3React";

// returns null on errors
export function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20ABI, withSignerIfPossible);
}

export function useSwanLakeContract(
  withSignerIfPossible = true
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && SWANLAKE_ADDRESS[chainId],
    BLACKSWANLAKE_ABI,
    withSignerIfPossible
  );
}

export function useDistributionPoolContract(
  withSignerIfPossible = true
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && DISTRIBUTION_POOL_ADDRESS[chainId],
    DISTRIBUTIONPOOL_ABI,
    withSignerIfPossible
  );
}

export function useBPTContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useTokenContract(
    chainId && BPT_ADDRESS[chainId],
    withSignerIfPossible
  );
}

export function useUSDCContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useTokenContract(
    chainId && USDC[chainId].address,
    withSignerIfPossible
  );
}
