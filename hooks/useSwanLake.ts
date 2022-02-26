import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import Fraction from "../entities/Fraction";
import { useActiveWeb3React } from "./useActiveWeb3React";
import { useSwanLakeContract, useBPTContract } from "../hooks/useContract";
import { BalanceProps } from "./useTokenBalance";
import { useTransactionAdder } from "../state/transactions/hooks";
const { BigNumber } = ethers;

const useSwanLake = () => {
  const { account } = useActiveWeb3React();
  const bptContract = useBPTContract(true); // withSigner
  const barContract = useSwanLakeContract(true); // withSigner
  const addTransaction = useTransactionAdder();
  const [allowance, setAllowance] = useState("0");

  const fetchAllowance = useCallback(async () => {
    if (account) {
      try {
        const allowance = await bptContract?.allowance(
          account,
          barContract?.address
        );
        const formatted = Fraction.from(
          BigNumber.from(allowance),
          BigNumber.from(10).pow(18)
        ).toString();
        setAllowance(formatted);
      } catch (error) {
        setAllowance("0");
        throw error;
      }
    }
  }, [account, barContract, bptContract]);

  useEffect(() => {
    if (account && barContract && bptContract) {
      fetchAllowance();
    }
    const refreshInterval = setInterval(fetchAllowance, 10000);
    return () => clearInterval(refreshInterval);
  }, [account, barContract, fetchAllowance, bptContract]);

  const approve = useCallback(async () => {
    try {
      const tx = await bptContract?.approve(
        barContract?.address,
        ethers.constants.MaxUint256.toString()
      );
    } catch (e) {
      return e;
    }
  }, [barContract, bptContract]);

  const stake = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await barContract?.stake(amount?.value);
          return addTransaction(tx, { summary: "Staking to Swan Lake" });
        } catch (e) {
          return e;
        }
      }
    },
    [barContract]
  );

  const collectRewards = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async () => {
      try {
        const tx = await barContract?.claimRewards();
        return addTransaction(tx, {
          summary: "Collecting Rewards from Swan Lake",
        });
      } catch (e) {
        return e;
      }
    },
    [barContract]
  );

  const withdrawStake = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await barContract?.withdrawStake(amount?.value);
          //const tx = await barContract?.leave(ethers.utils.parseUnits(amount)) // where amount is string
          return addTransaction(tx, { summary: "Withdrawing to Swan Lake" });
        } catch (e) {
          return e;
        }
      }
    },
    [barContract]
  );

  return { allowance, approve, stake, withdrawStake, collectRewards };
};

export default useSwanLake;
