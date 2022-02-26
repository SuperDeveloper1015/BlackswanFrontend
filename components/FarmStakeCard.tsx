import React, { useContext } from "react";
import Image from "next/image";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import DepositForm from "./DepositForm";
import WithDrawForm from "./WithdrawForm";
import { LakeSwanRewardsCollectButton } from "./LakeSwanRewardsCollectButton";
import { makeStyles } from "@material-ui/core";
import BPTRewardsInfoCard from "./BPTRewardsInfoCard";
import SwanLakeCountdown from "./SwanLakeCountdown";
import { SWAN_LAKE_COUNTDOWN_DATE } from "../constants";
import { ToggleThemeContext } from "../theme/ThemeProvider";
export default function FarmStakeCard() {
  const useClasses = makeStyles({
    root: {
      "& span": {
        display: "inline-flex",
        verticalAlign: "baseline",
      },
      padding: "12px 0 0 12px",
    },
  });
  const countdownDate = new Date(SWAN_LAKE_COUNTDOWN_DATE).getTime();
  const { toggleTheme, isDark } = useContext(ToggleThemeContext);
  let now = new Date().getTime();
  return (
    <div style={{ flexGrow: 1 }}>
      {now < countdownDate ? (
        <SwanLakeCountdown />
      ) : (
        <Card
          style={{
            minWidth: 800,
            backgroundColor: isDark ? "rgb(11, 23, 29)" : "white",
            color: isDark ? "white" : "black",
            borderColor: "black",
            borderRadius: "20px",
            width: "120%",
            marginLeft: "-10%",
          }}
        >
          <CardHeader
            className={useClasses().root}
            style={{ width: "100%", borderBottom: "solid 1px #000000" }}
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
                <Typography style={{ paddingLeft: "6px" }}>
                  SWAN/USDC
                </Typography>
              </>
            }
          />
          <CardContent style={{ padding: 25 }}>
            <Grid
              container
              alignContent="center"
              alignItems="center"
              justify="center"
              style={{ width: "100%" }}
            >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <BPTRewardsInfoCard />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                style={{ padding: 25 }}
              >
                <DepositForm />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                style={{ padding: 25 }}
              >
                <div style={{ margin: 10 }} />
                <WithDrawForm />
                <div style={{ marginTop: 10 }} />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <LakeSwanRewardsCollectButton
                  fontSize="24px"
                  buttonText="Claim"
                />
              </Grid>
              {/* <Grid
                item
                xs={6}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                style={{ marginTop: "10px", height: "100%" }}
              >
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                lg={6}0
                xl={6}
                style={{ marginTop: "10px", height: "full" }}
              >
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6} />
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              </Grid> */}
            </Grid>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
