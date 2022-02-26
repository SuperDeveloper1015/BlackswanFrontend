import React, { useContext } from "react";
import {
  Card,
  Typography,
  Grid,
  CardHeader,
  CardContent,
} from "@material-ui/core";
import useSWR from "swr";
import {
  SWAN_ADDRESS,
  DISTRIBUTION_POOL_ADDRESS,
  REBALANCE_COUNTDOWN_DATE,
  BPT_ADDRESS,
  SWANLAKE_ADDRESS,
  USDC,
  POLICY_ADDRESS,
  ORACLE_ADDRESS,
} from "../constants";
import MyChart from "./Charts/LineChart";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther, parseEther, formatUnits } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import { ToggleThemeContext } from "../theme/ThemeProvider";
import { Button } from "./styled/button";
import AnimatedNumber from "react-animated-number";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import RebalancelCountdown from "./RebalanceCountdown";
import { calculateTokenPrices, calculateTVL } from "../utils";
import Row from "./Row";
import { BigNumber } from "ethers";
const HomeTab = () => {
  const { account, library, chainId } = useWeb3React<Web3Provider>();

  const { data: totalSupply, mutate } = useSWR([
    SWAN_ADDRESS[chainId],
    "totalSupply",
  ]);

  const { data: swanBalance } = useSWR([
    SWAN_ADDRESS[chainId],
    "balanceOf",
    account,
  ]);
  const { data: reserve } = useSWR([BPT_ADDRESS[chainId], "getReserves"]);
  const { data: tvl } = useSWR(
    [DISTRIBUTION_POOL_ADDRESS[chainId], "totalSupply"],
    { refreshInterval: 5000 }
  );
  const { data: totalSupplyPair } = useSWR([
    BPT_ADDRESS[chainId],
    "totalSupply",
  ]);
  const { data: poolUsdcBalance } = useSWR([
    USDC[chainId].address,
    "balanceOf",
    BPT_ADDRESS[chainId],
  ]);
  const { data: totalLocked } = useSWR([
    SWANLAKE_ADDRESS[chainId],
    "totalSupply",
  ]);
  const { data: targetEquilibrium } = useSWR([
    POLICY_ADDRESS[chainId],
    "liquidityTargetEquilibrium",
  ]);
  const { data: liquidityData } = useSWR([ORACLE_ADDRESS[chainId], "getData"]);
  const tvlLake =
    totalLocked !== undefined &&
    poolUsdcBalance !== undefined &&
    totalSupplyPair !== undefined
      ? calculateTVL(
          parseFloat(formatEther(totalLocked)),
          parseFloat(formatUnits(poolUsdcBalance, 6)),
          parseFloat(formatEther(totalSupplyPair))
        )
      : 0.0;
  const handleAddToken = () => {
    const params: any = {
      type: "ERC20",
      options: {
        address: SWAN_ADDRESS[chainId],
        symbol: "SWAN",
        decimals: 18,
        image:
          "https://github.com/blackswanfinance/BlackSwan/blob/main/assets/blackSwanIcon.png?raw=true",
      },
    };

    if (library && library.provider.isMetaMask && library.provider.request) {
      library.provider
        .request({
          method: "wallet_watchAsset",
          params,
        })
        .then((success) => {
          if (success) {
            console.log("Successfully added SWAN to MetaMask");
          } else {
            throw new Error("Something went wrong.");
          }
        })
        .catch(console.error);
    }
  };
  const { toggleTheme, isDark } = useContext(ToggleThemeContext);
  const countdownDate = new Date(REBALANCE_COUNTDOWN_DATE).getTime();
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
      alignContent="center"
      alignItems="center"
      spacing={1}
    >
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <div style={{ flexGrow: 1 }}>
          <Card
            style={{
              minWidth: 275,
              backgroundColor: isDark ? "rgb(11, 23, 29)" : "white",
              color: isDark ? "white" : "black",
              borderColor: "black",
              borderRadius: "40px",
              padding: 25,
            }}
          >
            {/* <Typography style={{ textAlign: "center" }} variant="h4">
              News
            </Typography> */}
            <Row>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                style={{
                  height: "100%",
                  padding: 25,
                }}
              >
                <Typography
                  style={{
                    color: "#00ff00",
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  Target Liquidity: $
                  {targetEquilibrium &&
                    parseFloat(
                      formatUnits(targetEquilibrium, 6)
                    ).toLocaleString()}
                </Typography>
                <Typography
                  style={{
                    color: "#808080 ",
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  Current Liquidity: $
                  {liquidityData &&
                    parseFloat(
                      formatUnits(liquidityData[0], 6)
                    ).toLocaleString()}
                </Typography>
                <Typography
                  style={{
                    color: "#ff0000 ",
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  Blackswan Fund Trigger Level: $
                  {targetEquilibrium &&
                    parseFloat(
                      formatUnits(
                        targetEquilibrium
                          .mul(BigNumber.from(75))
                          .div(BigNumber.from(100)),
                        6
                      )
                    ).toLocaleString()}
                </Typography>
              </Grid>
              {/* <Grid
                item
                xs={6}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                style={{
                  height: "100%",
                  padding: 25,
                }}
              >
                <MyChart />
              </Grid>*/}
            </Row>
            {/* <TwitterTimelineEmbed
              sourceType="profile"
              screenName="blackswantoken"
              options={{ height: 400 }}
            /> */}
          </Card>
        </div>
        {now >= countdownDate && (
          <div style={{ flexGrow: 1, margin: "25px 0" }}>
            <RebalancelCountdown />
          </div>
        )}
      </Grid>
      <Row xs={10} sm={10} md={10} lg={10} xl={10}>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <div style={{ flexGrow: 1, marginTop: "20px", paddingRight: "15px" }}>
            <Card
              style={{
                minWidth: 275,
                backgroundColor: isDark ? "rgb(11, 23, 29)" : "white",
                color: isDark ? "white" : "black",
                borderColor: "black",
                borderRadius: "40px",
                padding: 25,
                fontFamily: "Roboto Mono",
              }}
            >
              <CardHeader
                title="Staking"
                style={{ fontSize: "24px", textAlign: "center" }}
              />

              <Grid
                container
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                style={{ padding: 10 }}
              >
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                  <Typography style={{}}>
                    Total <strong style={{ color: "#4353ff" }}>$SWAN</strong>{" "}
                    Supply
                  </Typography>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3} />
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <Typography>
                    {totalSupply &&
                      parseFloat(
                        parseFloat(formatEther(totalSupply)).toFixed(0)
                      ).toLocaleString("en-US")}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                  <Typography>
                    <strong style={{ color: "#4353ff" }}>$SWAN</strong> in
                    wallet
                  </Typography>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3} />
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <Typography>
                    {swanBalance &&
                      parseFloat(formatEther(swanBalance)).toLocaleString(
                        "en-US"
                      )}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                  <Typography>
                    <strong style={{ color: "#4353ff" }}>$SWAN</strong> price
                  </Typography>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3} />
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <Typography>
                    $
                    {tokenPrices &&
                      tokenPrices.swanPriceInUSD &&
                      tokenPrices.swanPriceInUSD.toFixed(3)}{" "}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={10}
                  sm={10}
                  md={10}
                  lg={10}
                  xl={10}
                  className="m-auto"
                >
                  <Button
                    style={{
                      margin: "auto",
                      marginBlock: "15px",
                      fontSize: "20px",
                    }}
                    className={
                      isDark
                        ? "bg-white w-full bg-opacity-90 rounded  hover:bg-opacity-50 disabled:bg-opacity-80"
                        : "bg-black w-full bg-opacity-90 rounded text-high-emphesis hover:bg-opacity-50 disabled:bg-opacity-80"
                    }
                    onClick={handleAddToken}
                  >
                    ADD SWAN TO METAMASK
                  </Button>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>
                    {/* /* TODO: replace currentPrice */}

                    {/* /*`${swanBalance && formatEther(swanBalance)} * {currentPrice}`* */}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </div>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <div style={{ flexGrow: 1 }}>
            <Card
              style={{
                minWidth: 275,
                backgroundColor: isDark ? "rgb(11, 23, 29)" : "white",
                color: isDark ? "white" : "black",
                borderColor: "black",
                borderRadius: "40px",
                marginTop: 30,
                padding: 25,
                fontFamily: "Roboto Mono",
              }}
            >
              <CardHeader
                title="Total Value Locked (TVL) "
                style={{ fontSize: "24px" }}
              />
              <CardContent>
                <Typography style={{ fontWeight: 600, fontSize: "40px" }}>
                  $
                  <AnimatedNumber
                    value={
                      tvl &&
                      tvlLake &&
                      (
                        parseFloat(formatUnits(tvl, 6)) + tvlLake
                      ).toLocaleString("en-US")
                    }
                    duration={700}
                  />{" "}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Row>

      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <div style={{ flexGrow: 1 }}>
          <Card
            style={{
              minWidth: 275,
              backgroundColor: isDark ? "rgb(11, 23, 29)" : "white",
              color: isDark ? "white" : "black",
              borderColor: "black",
              borderRadius: "40px",
              padding: 25,
            }}
          >
            <Typography style={{ textAlign: "center" }} variant="h4">
              News
            </Typography>
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName="blackswantoken"
              options={{ height: 400 }}
            />
          </Card>
        </div>
      </Grid>
    </Grid>
  );
};

export default HomeTab;