import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import Fraction from "../entities/Fraction";
import { useActiveWeb3React } from "./useActiveWeb3React";
import { useDistributionPoolContract, useUSDCContract } from "./useContract";
import { BalanceProps } from "./useTokenBalance";
import { useTransactionAdder } from "../state/transactions/hooks";
const { BigNumber } = ethers;

const useDistributionPool = () => {
  const { account } = useActiveWeb3React();
  const usdcContract = useUSDCContract(true); // withSigner
  const barContract = useDistributionPoolContract(true); // withSigner
  const addTransaction = useTransactionAdder();
  const [allowance, setAllowance] = useState("0");

  const fetchAllowance = useCallback(async () => {
    if (account) {
      try {
        const allowance = await usdcContract?.allowance(
          account,
          barContract?.address
        );
        const formatted = Fraction.from(
          BigNumber.from(allowance),
          BigNumber.from(10).pow(6)
        ).toString();
        setAllowance(formatted);
      } catch (error) {
        setAllowance("0");
        throw error;
      }
    }
  }, [account, barContract, usdcContract]);

  useEffect(() => {
    if (account && barContract && usdcContract) {
      fetchAllowance();
    }
    const refreshInterval = setInterval(fetchAllowance, 10000);
    return () => clearInterval(refreshInterval);
  }, [account, barContract, fetchAllowance, usdcContract]);

  const approve = useCallback(async () => {
    try {
      const tx = await usdcContract?.approve(
        barContract?.address,
        ethers.constants.MaxUint256.toString()
      );
    } catch (e) {
      return e;
    }
  }, [barContract, usdcContract]);

  const stake = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await barContract?.stake(amount?.value);
          return addTransaction(tx, { summary: "Stake Distribution Pool" });
        } catch (e) {
          return e;
        }
      }
    },
    [addTransaction, barContract]
  );

  const collectRewards = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async () => {
      try {
        const tx = await barContract?.claimRewards();
        return addTransaction(tx, { summary: "Claim Rewards" });
      } catch (e) {
        return e;
      }
    },
    [addTransaction, barContract]
  );

  const withdrawStake = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await barContract?.withdrawStake(amount?.value);
          return addTransaction(tx, { summary: "Withdraw Distribution Pool" });
          //const tx = await barContract?.leave(ethers.utils.parseUnits(amount)) // where amount is string
          return;
        } catch (e) {
          return e;
        }
      }
    },
    [addTransaction, barContract]
  );

  return { allowance, approve, stake, withdrawStake, collectRewards };
};

export default useDistributionPool;
