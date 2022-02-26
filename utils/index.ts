import ERC20ABI from "../abi/ERC20.abi.json";
import REWARDPOOLABI from "../abi/RewardPool.json";
import BLACKSWANLAKEABI from "../abi/BlackSwanLake.json";
import DISTRIBUTIONPOOL_ABI from "../abi/DistributionPool.json";
import UNISWAPPAIRV2_ABI from "../abi/UniswapPair.json";
import SWANLAKE_HELPER_ABI from "../abi/BlackSwanLakeHelper.json";
import SWANPOLICY_ABI from "../abi/BlackSwanPolicy.json";
import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { Contract } from "@ethersproject/contracts";
import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { BigNumber as BigNumberJs } from "bignumber.js";
import {
  USDC,
  DISTRIBUTION_POOL_ADDRESS,
  SWAN_ADDRESS,
  BLOCKS_PER_YEAR,
  BPT_ADDRESS,
  SWANLAKE_ADDRESS,
  REWARD_POOL_ADDRESS,
  SWANLAKE_HELPER,
  POLICY_ADDRESS,
} from "../constants";
export const Networks = {
  MainNet: 1,
  Ropsten: 3,
  Rinkeby: 4,
  Goerli: 5,
  Kovan: 42,
  Mumbai: 80001,
  Matic: 137,
};

export interface IERC20 {
  symbol: string;
  address: string;
  decimals: number;
  name: string;
  abi: any;
}

export const TOKENS_BY_NETWORK: {
  [key: number]: IERC20[];
} = {
  [Networks.Mumbai]: [
    {
      address: SWAN_ADDRESS[80001],
      symbol: "SWAN",
      name: "BlackSwan Token",
      decimals: 18,
      abi: ERC20ABI,
    },
    {
      address: USDC[80001].address,
      symbol: "USDC",
      name: "USDC",
      decimals: 6,
      abi: ERC20ABI,
    },
    {
      address: DISTRIBUTION_POOL_ADDRESS[80001],
      symbol: "DPT",
      name: "Distribution pool token",
      decimals: 18,
      abi: DISTRIBUTIONPOOL_ABI,
    },
    {
      address: BPT_ADDRESS[80001],
      symbol: "BPT",
      name: "Balancer Pool Token",
      decimals: 18,
      abi: UNISWAPPAIRV2_ABI,
    },
  ],
  [Networks.Matic]: [
    {
      address: SWAN_ADDRESS[Networks.Matic],
      symbol: "SWAN",
      name: "BlackSwan Token",
      decimals: 18,
      abi: ERC20ABI,
    },
    {
      address: USDC[Networks.Matic].address,
      symbol: "USDC",
      name: "USDC",
      decimals: 6,
      abi: ERC20ABI,
    },
    {
      address: DISTRIBUTION_POOL_ADDRESS[Networks.Matic],
      symbol: "DPT",
      name: "Distribution pool token",
      decimals: 18,
      abi: DISTRIBUTIONPOOL_ABI,
    },
    {
      address: BPT_ADDRESS[Networks.Matic],
      symbol: "BPT",
      name: "Balancer Pool Token",
      decimals: 18,
      abi: UNISWAPPAIRV2_ABI,
    },
    {
      address: SWANLAKE_ADDRESS[Networks.Matic],
      symbol: "SLT",
      name: "BlackSwan Token",
      decimals: 18,
      abi: BLACKSWANLAKEABI,
    },
    {
      address: REWARD_POOL_ADDRESS[Networks.Matic],
      symbol: "Reward Pool",
      name: "RPT",
      decimals: 18,
      abi: REWARDPOOLABI,
    },
    {
      address: SWANLAKE_HELPER[Networks.Matic],
      symbol: "helper",
      name: "help",
      decimals: 18,
      abi: SWANLAKE_HELPER_ABI,
    },
    {
      address: POLICY_ADDRESS[Networks.Matic],
      symbol: "helper",
      name: "help",
      decimals: 18,
      abi: SWANPOLICY_ABI,
    },
  ],
};
export const shorter = (str) =>
  str?.length > 8 ? str.slice(0, 6) + "..." + str.slice(-4) : str;

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}
// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}
// account is not optional
export function getSigner(
  library: Web3Provider,
  account: string
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}
// account is optional
export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  );
}
export const formatBalance = (
  value: ethers.BigNumberish,
  decimals = 18,
  maxFraction = 0
) => {
  const formatted = ethers.utils.formatUnits(value, decimals);
  if (maxFraction > 0) {
    const split = formatted.split(".");
    if (split.length > 1) {
      return split[0] + "." + split[1].substr(0, maxFraction);
    }
  }
  return formatted;
};
export const parseBalance = (value: string, decimals = 18) => {
  return ethers.utils.parseUnits(value || "0", decimals);
};
export const isEmptyValue = (text: string) =>
  ethers.BigNumber.isBigNumber(text)
    ? ethers.BigNumber.from(text).isZero()
    : text === "" || text.replace(/0/g, "").replace(/\./, "") === "";

export const formatToBalance = (value: string | undefined, decimals = 18) => {
  if (value) {
    return {
      value: ethers.utils.parseUnits(Number(value).toFixed(decimals), decimals),
      decimals: decimals,
    };
  } else {
    return { value: BigNumber.from(0), decimals: decimals };
  }
};
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
    .div(BigNumber.from(10000));
}
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number
): number => {
  const totalRewardPricePerYear =
    rewardTokenPrice * tokenPerBlock * BLOCKS_PER_YEAR;
  const totalStakingTokenInPool = stakingTokenPrice * totalStaked;
  const apr = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;
  return apr === Infinity || apr === NaN ? 0.0 : apr;
};

export const calculateTokenPrices = (reserve0: number, reserve1: number) => {
  const token0Price = reserve0 / reserve1;
  const token1Price = reserve1 / reserve0;

  const result = { swanPriceInUSD: token0Price, usdcPriceInSwan: token1Price };
  return result;
};

export const calculateTokensEarned = (
  totalStaked: number,
  tokenPrice: number,
  rewardsPerBlock: number,
  timeframe: number
) => {
  const sharePerBlock = (1000 / totalStaked) * rewardsPerBlock;
  const earnedInTheTimePeriod = sharePerBlock * 43200 * timeframe;
  const roi = getRoi(earnedInTheTimePeriod * tokenPrice, 1000);
  const result = { earnedTokens: earnedInTheTimePeriod, roi: roi };
  return result;
};
export const getRoi = (amountEarned, amountInvested) => {
  const percentage = (amountEarned / amountInvested) * 100;
  return percentage;
};

export const calculateEmissionRate = (
  mintedShare: number,
  totalShare: number,
  balance: number
) => {
  const emissionRate = (mintedShare + balance - totalShare) / 1296000;
  return emissionRate * 43200;
};

export const calculateTVL = (
  totalLocked: number,
  pairUsdcBalance: number,
  pairTotalSupply: number
) => {
  const tvl = (totalLocked / pairTotalSupply) * pairUsdcBalance;
  console.log(`tvl ${tvl}`);
  return 2 * tvl;
};

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getFarmApr = (
  tokenPerBlock: number,
  swanPrice: number,
  poolLiquidityUsd: number
): { swanRewardsApr: number } => {
  console.log(`tokenPerBlock ${tokenPerBlock}`);
  const totalRewardPerYear = tokenPerBlock * BLOCKS_PER_YEAR;
  const cakeRewardsApr =
    ((totalRewardPerYear * swanPrice) / poolLiquidityUsd) * 100;

  return {
    swanRewardsApr:
      cakeRewardsApr === Infinity || cakeRewardsApr === NaN
        ? 0.0
        : cakeRewardsApr,
  };
};

export const getEarnedSwans = () => {};
