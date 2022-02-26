import React, { useContext } from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
const client1 = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06",
  cache: new InMemoryCache()
});
const client2 = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06",
  cache: new InMemoryCache()
});
const client3 = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06",
  cache: new InMemoryCache()
});
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
} from "../constants";
import TVL from "./Charts/TVL";
import Liquidity from "./Charts/Liquidity";
import Price from "./Charts/Price";
import APY from "./Charts/APY";
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
const StatsTab = () => {
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
      <Row>
      <ApolloProvider client={client1}>
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
                title="Blackswan Fund TVL"
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
                  <TVL />
              </Grid>
            </Card>
          </div>
        </Grid>
      </ApolloProvider> 
      <ApolloProvider client={client2}> 
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
                title="Volumn"
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
                  <APY />
              </Grid>
            </Card>
          </div>
        </Grid>
      </ApolloProvider> 
      </Row>
      <Row>
      <ApolloProvider client={client1}> 
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
                title="SWAN/USDC Price"
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
                  <Price />
              </Grid>
            </Card>
          </div>
        </Grid>
      </ApolloProvider>  
      <ApolloProvider client={client1}>
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
                title="Blackswan Liquidity"
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
                  <Liquidity />
              </Grid>
            </Card>
          </div>
        </Grid>
      </ApolloProvider> 
      </Row>
    </Grid>
  );
};

export default StatsTab;