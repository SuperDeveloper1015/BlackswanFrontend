import React, { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { SwanRewardsCollectButton } from "./SwanRewardsCollectButton";
import { makeStyles } from "@material-ui/core";
import ERC20ABI from "../abi/ERC20.abi.json";
import { Button } from "./styled/button";
import { Modal } from "./modal";
import { StyledTextField } from "./styled/text-field";
import { Web3Provider } from "@ethersproject/providers";
import DistributionPoolDepositForm from "./DistributionPoolDepositForm";
import DistributionPoolWithdrawForm from "./DistributionPoolWithdrawForm";
import { Token, TokenAmount } from "@sushiswap/sdk";
import {
  USDC,
  DISTRIBUTION_POOL_ADDRESS,
  DISTRIBUTION_POOL_COUNTDOWN_DATE,
  SWAN_ADDRESS,
  BPT_ADDRESS,
} from "../constants";
import { ApprovalState, useApproveCallback } from "../hooks/useApproveCallback";
import { BalanceProps } from "../hooks/useTokenBalance";
import { formatToBalance } from "../utils";
import useSWR from "swr";
import { formatUnits, formatEther } from "ethers/lib/utils";
import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import useDistributionPool from "../hooks/useDistributionPool";
import DistrubutionPoolCountdown from "./DistributionPoolCountdown";
import APRModal from "./APRModal";
import { getPoolApr, calculateTokenPrices } from "../utils/index";
import { ToggleThemeContext } from "../theme/ThemeProvider";
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
export default function PoolStakeCard() {
  const { account, library, chainId } = useWeb3React<Web3Provider>();
  const [claim, setClaim] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(10);
  const [pendingTx, setPendingTx] = useState(false);
  const [passed, setPassed] = useState<boolean>(false);
  const [nowTimer, setTimerNow] = useState<number>(0);
  const { allowance, stake, withdrawStake, collectRewards } =
    useDistributionPool();
  const [subtract, setSubtract] = useState<boolean>(false);
  const parsedInput: BalanceProps = formatToBalance(
    amount.toString() !== "." ? amount.toString() : ""
  );
  const { toggleTheme, isDark } = useContext(ToggleThemeContext);
  const [approvalState, approve] = useApproveCallback(
    new TokenAmount(USDC[chainId], parsedInput.value.toString()),
    DISTRIBUTION_POOL_ADDRESS[chainId]
  );
  const { data: balance, mutate } = useSWR(
    [DISTRIBUTION_POOL_ADDRESS[chainId], "balanceOf", account],
    { refreshInterval: 1000 }
  );
  const { data: emissionRate } = useSWR([
    DISTRIBUTION_POOL_ADDRESS[chainId],
    "rewardsPerBlock",
  ]);
  const { data: tvl } = useSWR([
    DISTRIBUTION_POOL_ADDRESS[chainId],
    "totalSupply",
  ]);
  const { data: reserve } = useSWR([BPT_ADDRESS[chainId], "getReserves"]);
  React.useEffect((): any => {
    // listen for changes on an Ethereum address
    console.log(`listening for Transfer...`);
    const contract = new Contract(DISTRIBUTION_POOL_ADDRESS[chainId], ERC20ABI);
    console.log(contract);
    const fromMe = contract.filters.Transfer(account, null);
    library.on(fromMe, (from, to, amount, event) => {
      console.log("Transfer|sent", { from, to, amount, event });
      mutate(undefined, true);
    });
    const toMe = contract.filters.Transfer(null, account);
    library.on(toMe, (from, to, amount, event) => {
      console.log("Transfer|received", { from, to, amount, event });
      mutate(undefined, true);
    });
    // remove listener when the component is unmounted
    return () => {
      library.removeAllListeners(toMe);
      library.removeAllListeners(fromMe);
    };
    // trigger the effect only on component mount
  }, []); // ensures refresh if referential identity of library doesn't change across chainIds
  const useClasses = makeStyles({
    root: {
      "& span": {
        verticalAlign: "baseline",
      },
      padding: "12px 0 0 12px",
    },
  });

  const handleUnlock = async () => {
    console.log(`allowance ${allowance}`);
    if (Number(allowance) === 0) {
      const success = await sendTx(() => approve());
      if (!success) {
        setPendingTx(false);
        //setModalOpen(true)
        return;
      }
    }
  };

  const countdownDate = new Date(DISTRIBUTION_POOL_COUNTDOWN_DATE).getTime();
  let now = new Date().getTime();
  const tokenPrices =
    reserve &&
    parseFloat(formatEther(reserve[0])) !== 0.0 &&
    parseFloat(formatUnits(reserve[1], 6)) !== 0.0 &&
    calculateTokenPrices(
      parseFloat(formatUnits(reserve[0], 6)),
      parseFloat(formatEther(reserve[1]))
    );

  return (
      <Grid
        container
        justify="center"
        alignItems="center"
        alignContent="center"
        style={{ display: "flex" }}
        className="mt-5"
      >
        {now < countdownDate && (
          <Grid
            item
            xs={10}
            sm={10}
            md={10}
            lg={10}
            xl={10}
            style={{ marginTop: 20 }}
          >
            {" "}
            <DistrubutionPoolCountdown />
          </Grid>
        )}
        <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
          <Card
            style={{
              // maxWidth: 500,
              backgroundColor: isDark ? "rgb(11, 23, 29)" : "white",
              color: isDark ? "white" : "black",
              borderColor: "black",
              borderRadius: "20px",
              marginTop: now < countdownDate ? 50 : 10,
            }}
          >
            <CardHeader
              className={useClasses().root}
              style={{ width: "100%", borderBottom: "solid 1px #000000", display: "block" }}
              title={
                <>
                  <Image
                    src="/static/imgs/BlackSwanIconBlack.png"
                    alt="Swan Logo"
                    width="36"
                    height="36"
                  />
                  <Image
                    src="/static/imgs/usd-coin-usdc-logo.png"
                    alt="USDC Logo"
                    width="36"
                    height="36"
                  />
                </>
              }
            >

            </CardHeader>
            <CardContent style={{ width: "100%", padding: "0 12px" }}>
              <Grid
                container
                spacing={1}
                alignContent="center"
                alignItems="center"
                justify="center"
              >
                  <div
                    style={{ display: "flex", width: "100%", justifyContent: "space-around" }}
                  >
                    <Typography className="mt-3 text-center">
                      Emission Rate<br />
                      {emissionRate &&
                        parseFloat(
                          (parseFloat(formatEther(emissionRate)) * 43200).toFixed(2)
                        ).toLocaleString("en-US")}{" "}
                      / Day
                    </Typography>
                    <Typography className="mt-3 text-center">
                      Estimated APR <br />
                      {tvl &&
                      emissionRate &&
                      tokenPrices &&
                      tokenPrices.swanPriceInUSD > 0
                        ? getPoolApr(
                            1,
                            tokenPrices.swanPriceInUSD,
                            parseFloat(formatUnits(tvl, 6)),
                            parseFloat(formatEther(emissionRate))
                          ).toFixed(2) + `%`
                        : "0.0 %"}
                      <APRModal
                        rewardsPerBlock={
                          emissionRate ? parseFloat(formatEther(emissionRate)) : 0.0
                        }
                        totalStaked={
                          tvl && tvl != 0.0 ? parseFloat(formatUnits(tvl, 6)) : 1.0
                        }
                        tokenPrice={
                          tokenPrices && tokenPrices.swanPriceInUSD > 0
                            ? tokenPrices.swanPriceInUSD
                            : 0.0
                        }
                        aprswan={ tvl &&
                          emissionRate &&
                          tokenPrices &&
                          tokenPrices.swanPriceInUSD > 0
                            ? getPoolApr(
                                1,
                                tokenPrices.swanPriceInUSD,
                                parseFloat(formatUnits(tvl, 6)),
                                parseFloat(formatEther(emissionRate))
                              ).toFixed(2)
                            : '0' }
                      />
                    </Typography>
                    <Typography className="mt-3 text-center">
                      Deposit Fee<br />
                      5%
                    </Typography>
                    <Typography className="mt-3 text-center">
                      <b style={{ color: "#4353ff" }}>USDC</b> STAKED<br />
                      {balance != undefined &&
                        parseFloat(formatUnits(balance, 6)) !== 0.0 && (
                          <Typography variant="h6" style={{ fontWeight: "bolder" }}>
                            {parseFloat(formatUnits(balance, 6)).toFixed(1)}
                          </Typography>
                        )}
                    </Typography>
                  </div>
                  <hr />
                  {balance != undefined &&
                    parseFloat(formatUnits(balance, 6)) !== 0.0 ? (
                      <Grid
                        item
                        xs={4}
                        sm={4}
                        md={4}
                        lg={6}
                        xl={6}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {approvalState === ApprovalState.APPROVED && (
                          <DistributionPoolDepositForm />
                        )}
                        {balance != undefined &&
                          parseFloat(formatUnits(balance, 6)) !== 0.0 && (
                            <DistributionPoolWithdrawForm />
                          )}
                      </Grid>
                    ) : (
                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        {approvalState === ApprovalState.APPROVED && (
                          <DistributionPoolDepositForm />
                        )}
                      </Grid>
                    )}
                  <Grid className="mt-5" item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <SwanRewardsCollectButton
                    fontSize="12px"
                    buttonText="Collect"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  style={{ display: "flex" }}
                >
                  {approvalState !== ApprovalState.PENDING &&
                    approvalState !== ApprovalState.APPROVED && (
                      <Button
                        style={{
                          width: "80%",
                          margin: "auto",
                          marginBlock: "18px",
                          padding: "10px",
                          backgroundColor: isDark ? "white" : "black",
                          color: isDark ? "black" : "white",
                        }}
                        className="bg-opacity-90 rounded  hover:bg-opacity-50 disabled:bg-opacity-80"
                        onClick={handleUnlock}
                      >
                        Approve Contract
                      </Button>
                    )}
                  </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    
  );
}
