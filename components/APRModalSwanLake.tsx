import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Backdrop,
  Fade,
  Modal as MuiModal,
  IconButton,
  Divider,
} from "@material-ui/core";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import { Grid, Slider, Typography } from "@material-ui/core";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import { DISTRIBUTION_POOL_ADDRESS, SWANLAKE_ADDRESS } from "../constants";
import { formatToBalance } from "../utils";
import useDistributionPool from "../hooks/useDistributionPool";
import { BalanceProps } from "../hooks/useTokenBalance";
import NumberFormat from "react-number-format";
import { StyledTextField } from "./styled/text-field";
import { Button } from "./styled/button";

import { formatUnits } from "ethers/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { calculateTokensEarned } from "../utils/index";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    button: {
      "&:disabled": {
        backgroundColor: "grey",
      },
    },
    notchedOutline: {
      borderWidth: "1px",
      borderColor: "grey !important",
    },

    textField: {
      "& p": {
        color: "blue",
      },
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: "#ffffff",
      borderRadius: "20px",
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);
interface AprProps {
  rewardsPerBlock: number;
  totalStaked: number;
  tokenPrice: number;
}
const APRModalSwanLake = (props: AprProps) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const result = calculateTokensEarned(
    props.totalStaked,
    props.tokenPrice,
    props.rewardsPerBlock,
    1
  );

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <div style={{ color: "black" }}>
        <FontAwesomeIcon onClick={handleOpen} icon={faCalculator} size="1x" />
      </div>
      <MuiModal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <form className={classes.root} noValidate autoComplete="off">
              <Grid
                container
                alignContent="center"
                alignItems="center"
                justify="center"
                spacing={3}
              >
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Typography
                    style={{
                      fontFamily: "Roboto Mono",
                      fontSize: "40px",
                      fontWeight: 600,
                      textAlign: "left",
                    }}
                  >
                    ROI
                    <Divider style={{ backgroundColor: "black" }} />
                  </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>TIMEFRAME</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>ROI</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>Swan Per $1000</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>1d</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>%{result.roi.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>{result.earnedTokens.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>7d</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>%{(result.roi * 7).toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>
                    {(7 * result.earnedTokens).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>30d</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>%{(result.roi * 30).toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>
                    {(30 * result.earnedTokens).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>365d(APY)</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>%{(result.roi * 365).toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Typography>
                    {(365 * result.earnedTokens).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </div>
        </Fade>
      </MuiModal>
    </div>
  );
};

export default APRModalSwanLake;
