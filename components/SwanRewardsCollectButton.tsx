import React, { useState, useContext } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import useSWR from "swr";
import { useActiveWeb3React } from "../hooks/useActiveWeb3React";
import {
  SWAN_ADDRESS,
  SWANLAKE_ADDRESS,
  DISTRIBUTION_POOL_ADDRESS,
} from "../constants";
import { formatEther, parseEther } from "@ethersproject/units";
import { Typography } from "@material-ui/core";
import { Button } from "./styled/button";
import useDistributionPool from "../hooks/useDistributionPool";
import { ToggleThemeContext } from "../theme/ThemeProvider";
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

export const SwanRewardsCollectButton: React.FC<{
  fontSize: string;
  buttonText: string;
}> = ({ fontSize, buttonText }) => {
  const classes = useStyles();
  const { chainId, account } = useActiveWeb3React();
  const [pendingTx, setPendingTx] = useState(false);
  const { allowance, stake, withdrawStake, collectRewards } =
    useDistributionPool();
  const { toggleTheme, isDark } = useContext(ToggleThemeContext);
  const { data: balance, mutate } = useSWR(
    [DISTRIBUTION_POOL_ADDRESS[chainId], "takeWithAddress", account],
    { refreshInterval: 1000 }
  );
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
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        textAlign: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h6">
        {balance === null ? (
          "Error"
        ) : balance ? (
          <>
            {formatEther(balance)} {SWAN}
          </>
        ) : (
          <>0.00 {SWAN}</>
        )}
      </Typography>
      <Button
        onClick={handleRewardToUser}
        disabled={pendingTx}
        className={
          isDark
            ? "bg-white bg-opacity-100  hover:bg-opacity-80 disabled:bg-opacity-80"
            : "bg-dark-700 bg-opacity-100 text-high-emphesis hover:bg-opacity-80 disabled:bg-opacity-80"
        }
        style={{ padding: 10 }}
      >
        {buttonText}
      </Button>
    </div>
  );
};
