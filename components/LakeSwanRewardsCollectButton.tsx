import React, { useState, useCallback } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import useSWR from "swr";
import { useActiveWeb3React } from "../hooks/useActiveWeb3React";
import { SWAN_ADDRESS, SWANLAKE_ADDRESS, SWANLAKE_HELPER } from "../constants";
import { formatEther, parseEther } from "@ethersproject/units";
import { Typography, Grid } from "@material-ui/core";
import { Button } from "./styled/button";
import useSwanLake from "../hooks/useSwanLake";
import { getContract } from "../utils";
import { BigNumber, Contract, ethers } from "ethers";
import SWANLAKE_HELPER_ABI from "../abi/BlackSwanLakeHelper.json";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(1),
        height: theme.spacing(10),
      },
    },
    button: {
      borderColor: "#000000",
    },
  })
);
const sendTx = async (txFunc: () => Promise<any>): Promise<boolean> => {
  let success = true;
  try {
    const ret = await txFunc();
    if (ret?.error) {
      success = false;
    }
  } catch (e) {
    console.error(e);
    success = false;
  }
  return success;
};

const SWAN = <b style={{ color: "#4353ff" }}>$SWAN</b>;

export const LakeSwanRewardsCollectButton: React.FC<{
  fontSize: string;
  buttonText: string;
}> = ({ fontSize, buttonText }) => {
  const classes = useStyles();
  const { chainId, account, library } = useActiveWeb3React();
  const [pendingTx, setPendingTx] = useState(false);
  const { allowance, stake, withdrawStake, collectRewards } = useSwanLake();
  const [swanRewards, setSwanRewards] = useState("");
  const [lpRewards, setLpRewards] = useState("");

  const getRewards = async () => {
    const accAmountPerShareSwanValue = await library?.getStorageAt(
      SWANLAKE_ADDRESS[chainId],
      2
    );
    const swanHelper = getContract(
      SWANLAKE_HELPER[chainId],
      SWANLAKE_HELPER_ABI,
      library,
      account
    );

    const earnedRewards = await swanHelper?.getEarnedRewards(
      account,
      accAmountPerShareSwanValue
    );
    console.log(`earnedRewards ${earnedRewards[1]}`);
    setSwanRewards(formatEther(earnedRewards[1]));
    setLpRewards(formatEther(earnedRewards[0]));
  };

  const walletConnected = !!account;
  const handleRewardToUser = async () => {
    if (pendingTx) return;

    if (!walletConnected) {
    } else {
      setPendingTx(true);

      const success = await sendTx(() => collectRewards());
      if (!success) {
        setPendingTx(false);
        //setModalOpen(true)
        return;
      }

      setPendingTx(false);
    }
  };
  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item>
        <Typography variant="h6">
          {swanRewards === null ? (
            "Error"
          ) : swanRewards !== "" ? (
            <>
              {swanRewards} {SWAN}
            </>
          ) : (
            <>0.00 {SWAN}</>
          )}
          <Typography variant="h6">
            {lpRewards === null ? (
              "Error"
            ) : lpRewards !== "" ? (
              <>{lpRewards} LP Token</>
            ) : (
              <>0.00 LP Token</>
            )}
          </Typography>
        </Typography>
      </Grid>
      <Grid item>
        <Button
          onClick={handleRewardToUser}
          disabled={pendingTx}
          className="bg-dark-700 bg-opacity-100 text-high-emphesis hover:bg-opacity-80 disabled:bg-opacity-80"
        >
          {buttonText}
        </Button>
      </Grid>
      <Grid item>
        <Button
          onClick={getRewards}
          disabled={pendingTx}
          className="bg-dark-700 bg-opacity-100 text-high-emphesis hover:bg-opacity-80 disabled:bg-opacity-80"
        >
          Refresh Rewards
        </Button>
      </Grid>
      <Grid item>
        <Button
          onClick={()=> {location.href="https://quickswap.exchange/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0xab7589dE4C581Db0fb265e25a8e7809D84cCd7E8"}}
          disabled={pendingTx}
          className="bg-dark-700 bg-opacity-100 text-high-emphesis hover:bg-opacity-80 disabled:bg-opacity-80"
        >
          add liquidity
        </Button>
      </Grid>
    </Grid>
  );
};
