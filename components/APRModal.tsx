import React, { useState, useContext } from "react";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  Backdrop,
  Fade,
  Modal as MuiModal,
  IconButton,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  StylesProvider,
} from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import Dialog from '@material-ui/core/Dialog';
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
import { ToggleThemeContext } from "../theme/ThemeProvider";
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
const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);
const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);
interface AprProps {
  rewardsPerBlock: number;
  totalStaked: number;
  tokenPrice: number;
  aprswan: string;
}
const APRModal = (props: AprProps) => {
  const { toggleTheme, isDark } = useContext(ToggleThemeContext);
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
    <div style={{display:"inline"}}>
      <span style={{ color: isDark ? "white" : "black" }}>
        {" "}<FontAwesomeIcon onClick={handleOpen} icon={faCalculator} size="1x" style={{"cursor": "pointer"}} />
      </span>
      <Dialog onClose={handleClose}  open={open} maxWidth={"md"} fullWidth={true}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography
              style={{
                fontFamily: "Roboto Mono",
                fontSize: "30px",
                fontWeight: 600,
                textAlign: "left",
                marginLeft: "20px",
                color: isDark ? "white" : "black"
              }}

            >
              ROI
            </Typography>
          </Grid>
        <DialogContent>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">TIMEFRAME</StyledTableCell>
                <StyledTableCell align="left">ROI</StyledTableCell>
                <StyledTableCell align="center">SWAP PER $1000</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell style={{color: isDark ? "white" : "black"}} align="left"><Typography>1d</Typography></StyledTableCell>
                <StyledTableCell style={{color: isDark ? "white" : "black"}} align="left"><Typography>%{result.roi.toFixed(2)}</Typography></StyledTableCell>
                <StyledTableCell style={{color: isDark ? "white" : "black"}} align="center"><Typography>{(result.earnedTokens).toFixed(2)}</Typography></StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell style={{color: isDark ? "white" : "black"}} align="left"><Typography>7d</Typography></StyledTableCell>
                <StyledTableCell style={{color: isDark ? "white" : "black"}} align="left"><Typography>%{(result.roi * 7).toFixed(2)}</Typography></StyledTableCell>
                <StyledTableCell style={{color: isDark ? "white" : "black"}} align="center">
                  <Typography>
                    {(7 * result.earnedTokens).toFixed(2)}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell style={{color: isDark ? "white" : "black"}} align="left"><Typography>30d</Typography></StyledTableCell>
                <StyledTableCell style={{color: isDark ? "white" : "black"}} align="left"><Typography>%{(result.roi * 30).toFixed(2)}</Typography></StyledTableCell>
                <StyledTableCell style={{color: isDark ? "white" : "black"}} align="center"><Typography>
                      {(30 * result.earnedTokens).toFixed(2)}
                    </Typography></StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell style={{color: isDark ? "white" : "black"}} align="left"><Typography>365d(APY)</Typography></StyledTableCell>
                <StyledTableCell style={{color: isDark ? "white" : "black"}} align="left"><Typography>%{(result.roi * 365).toFixed(2)}</Typography></StyledTableCell>
                <StyledTableCell style={{color: isDark ? "white" : "black"}} align="center"><Typography>
                      {(365 * result.earnedTokens).toFixed(2)}
                    </Typography></StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
          
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary" style={{color: isDark ? "white" : "black"}}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default APRModal;
