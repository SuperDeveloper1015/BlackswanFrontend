import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import useSWR from "swr";
import { useActiveWeb3React } from "../hooks/useActiveWeb3React";
import {
  SWAN_ADDRESS,
  REWARD_POOL_ADDRESS,
  SWANLAKE_ADDRESS,
  BPT_ADDRESS,
  USDC,
} from "../constants";
import { formatEther, parseEther, formatUnits } from "@ethersproject/units";
import { Typography } from "@material-ui/core";
import {
  calculateEmissionRate,
  calculateTVL,
  calculateTokenPrices,
  getFarmApr,
} from "../utils";
import APRModal from "./APRModal";
// import { Providers } from "ethers/providers";
import { ethers } from "ethers";
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
  })
);

const SWAN = <b style={{ color: "#4353ff" }}>$SWAN</b>;
export default function BPTRewardsInfoCard() {
  const classes = useStyles();
  const { chainId, library } = useActiveWeb3React();
  const { data: balance, mutate } = useSWR([
    REWARD_POOL_ADDRESS[chainId],
    "balance",
  ]);
  const { data: swanBalance } = useSWR([
    SWAN_ADDRESS[chainId],
    "balanceOf",
    SWANLAKE_ADDRESS[chainId],
  ]);

  const { data: mintedShareSwan } = useSWR([
    SWAN_ADDRESS[chainId],
    "mintedShareSwan",
  ]);
  const { data: totalShareSwan } = useSWR([
    SWAN_ADDRESS[chainId],
    "totalShareSwan",
  ]);
  const { data: mintedShare } = useSWR([SWAN_ADDRESS[chainId], "mintedShare"]);
  const { data: totalShare } = useSWR([
    SWAN_ADDRESS[chainId],
    "totalShareSwan",
  ]);
  const { data: reserve } = useSWR([BPT_ADDRESS[chainId], "getReserves"]);
  const tokenPrices =
    reserve &&
    parseFloat(formatEther(reserve[0])) !== 0.0 &&
    parseFloat(formatUnits(reserve[1], 6)) !== 0.0 &&
    calculateTokenPrices(
      parseFloat(formatUnits(reserve[0], 6)),
      parseFloat(formatEther(reserve[1]))
    );

  const { data: totalSupply } = useSWR([BPT_ADDRESS[chainId], "totalSupply"]);
  const { data: poolUsdcBalance } = useSWR([
    USDC[chainId].address,
    "balanceOf",
    BPT_ADDRESS[chainId],
  ]);
  const { data: totalLocked } = useSWR([
    SWANLAKE_ADDRESS[chainId],
    "totalSupply",
  ]);
  const tvl =
    totalLocked !== undefined &&
    poolUsdcBalance !== undefined &&
    totalSupply !== undefined
      ? calculateTVL(
          parseFloat(formatEther(totalLocked)),
          parseFloat(formatUnits(poolUsdcBalance, 6)),
          parseFloat(formatEther(totalSupply))
        )
      : 0.0;
  const LPEmissionRate = calculateEmissionRate(
    mintedShare != undefined ? parseFloat(formatEther(mintedShare)) : 0,
    totalShare != undefined ? parseFloat(formatEther(totalShare)) : 0,
    balance != undefined ? parseFloat(formatEther(balance)) : 0
  );
  const swanEmissionRate = calculateEmissionRate(
    mintedShareSwan != undefined ? parseFloat(formatEther(mintedShareSwan)) : 0,
    totalShareSwan != undefined ? parseFloat(formatEther(totalShareSwan)) : 0,
    swanBalance != undefined ? parseFloat(formatEther(swanBalance)) : 0
  );
  return (
    <div>
      <div
        style={{ display: "flex", width: "100%", justifyContent: "space-around" }}
      >
        <Typography className="text-center">
          LP token Emission Rate<br />
          {LPEmissionRate === null
            ? "Error"
            : LPEmissionRate
            ? `${LPEmissionRate.toFixed(2)} LP Token / Day`
            : LPEmissionRate + ' LP Token / Day'}
        </Typography>
        <Typography className="text-center">
          {swanBalance === null ? (
            "Error"
          ) : swanEmissionRate ? (
            <>
              Swan Emission Rate<br />
              {` ${swanEmissionRate.toFixed(2)}`} {SWAN}/ Day
            </>
          ) : (
            ""
          )}
        </Typography>
        <Typography className="text-center">
            {swanEmissionRate &&
              tokenPrices &&
              tokenPrices.swanPriceInUSD &&
              poolUsdcBalance && (
                <>
                  APR for SWAN<br />
                  <span>{getFarmApr(
                    swanEmissionRate / 43200,
                    tokenPrices.swanPriceInUSD,
                    parseFloat(formatUnits(poolUsdcBalance, 6)) * 2
                  ).swanRewardsApr.toFixed(2) + `%`}{" "}
                  <APRModal
                    rewardsPerBlock={swanEmissionRate ? swanEmissionRate / 43200 : 0.0}
                    totalStaked={
                      poolUsdcBalance
                        ? parseFloat(formatUnits(poolUsdcBalance, 6)) * 2
                        : 1.0
                    }
                    tokenPrice={
                      tokenPrices && tokenPrices.swanPriceInUSD > 0
                        ? tokenPrices.swanPriceInUSD
                        : 0.0
                    }
                    aprswan={ getFarmApr(
                      swanEmissionRate / 43200,
                      tokenPrices.swanPriceInUSD,
                      parseFloat(formatUnits(poolUsdcBalance, 6)) * 2
                    ).swanRewardsApr.toFixed(2) }
                  />
                  </span>
                </>
              )}
          </Typography>
          <Typography className="text-center">
            Total Liquidity<br />
            {poolUsdcBalance === null
              ? "Error"
              : poolUsdcBalance
              ? ` ${formatUnits(poolUsdcBalance, 6)} $`
              : ""}
          </Typography>
      </div>
      <hr />
    </div>
  );
}
