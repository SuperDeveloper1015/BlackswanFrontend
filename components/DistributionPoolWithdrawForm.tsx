import React, { useState, useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Backdrop, Fade, Modal as MuiModal } from "@material-ui/core";
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
import BPTRewardsInfoCard from "./BPTRewardsInfoCard";
import { formatUnits } from "ethers/lib/utils";
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
      width: "35vw",
      backgroundColor: "#ffffff",
      borderRadius: "20px",
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);
const buttonStyle =
  "flex justify-center items-center w-full h-14 font-bold md:font-medium md:text-lg mt-5 text-sm focus:outline-none focus:ring";
const buttonStyleEnabled = `${buttonStyle} text-high-emphesis bg-black hover:opacity-90`;
const buttonStyleInsufficientFunds = `${buttonStyleEnabled} opacity-60`;
const buttonStyleDisabled = `${buttonStyle} text-secondary bg-dark-700`;
const buttonStyleConnectWallet = `${buttonStyle} text-high-emphesis bg-cyan-black hover:bg-opacity-90`;
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
function Balance() {
  const { account, library, chainId } = useWeb3React<Web3Provider>();
  const { data: balance, mutate } = useSWR([
    DISTRIBUTION_POOL_ADDRESS[chainId],
    "balanceOf",
    account,
  ]);

  return (
    <div style={{ textAlign: "left" }}>
      <span>Deposited Amount: </span>

      <span>
        {balance === null
          ? "Error"
          : balance
          ? ` ${formatUnits(balance, 6)} USDC`
          : ""}
      </span>
    </div>
  );
}
interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
}

export default function DistributionPoolWithdrawForm(props) {
  const { account, library, chainId } = useWeb3React<Web3Provider>();
  const { data: balance, mutate } = useSWR([
    DISTRIBUTION_POOL_ADDRESS[chainId],
    "balanceOf",
    account,
  ]);
  const { toggleTheme, isDark } = useContext(ToggleThemeContext);
  const { allowance, stake, withdrawStake } = useDistributionPool();
  const [sliderVal, setSliderVal] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSlide = (event: any, newValue: number | number[]) => {
    setSliderVal(newValue as number);
    setAmount(
      ((newValue as number) / 100) * parseFloat(formatUnits(balance, 6))
    );
  };

  const classes = useStyles();
  const parsedInput: BalanceProps = formatToBalance(
    amount.toString() !== "." ? amount.toString() : "",
    6
  );

  const [balanceNumber, setBalanceNumber] = useState<number>();
  const [pendingTx, setPendingTx] = useState(false);
  const walletConnected = !!account;
  const buttonDisabled = pendingTx || amount === 0;
  const insufficientFunds = balanceNumber < amount;
  const handleChange = (event) => {
    if (balance != undefined) {
      setBalanceNumber(parseFloat(formatUnits(balance, 6)));
    }
    setAmount(event.target.value);
    setSliderVal(
      (event.target.value / parseFloat(formatUnits(balance, 6))) * 100
    );
  };
  React.useEffect((): any => {
    if (balance != undefined) {
      setBalanceNumber(parseFloat(formatUnits(balance, 6)));
    }
  });
  const handleWithdrawSubmit = async () => {
    if (buttonDisabled) return;

    if (!walletConnected) {
    } else {
      setPendingTx(true);

      const success = await sendTx(() => withdrawStake(parsedInput));
      if (!success) {
        setPendingTx(false);
        //setModalOpen(true)
        return;
      }
      handleClose();
      setAmount(0);
      setPendingTx(false);
    }
  };

  const marks = [
    {
      value: 25,
      label: "25%",
    },
    {
      value: 50,
      label: "50%",
    },
    {
      value: 75,
      label: "75%",
    },
    {
      value: 100,
      label: "100%",
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      <Button
        className={
          isDark
            ? "bg-white bg-opacity-20  rounded w-full xs hover:bg-opacity-80 disabled:bg-opacity-20"
            : "bg-black bg-opacity-30  rounded w-full xs hover:bg-opacity-80 disabled:bg-opacity-20"
        }
        onClick={handleOpen}
        style={{
          color: "#4353ff ",
          fontWeight: 600,

          marginLeft: 10,
          fontFamily: "Roboto Mono",
        }}
      >
        <b>-</b>
      </Button>
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
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                  <Balance />
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} />
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <StyledTextField
                    label="Enter Amount"
                    variant="outlined"
                    value={amount}
                    fullWidth
                    onChange={handleChange}
                    name="numberformat"
                    id="formatted-numberformat-input"
                    InputProps={{
                      inputComponent: NumberFormatCustom as any,
                      classes: {
                        notchedOutline: classes.notchedOutline,
                      },
                    }}
                    InputLabelProps={{
                      style: { color: "black" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Slider
                    step={10}
                    valueLabelDisplay="auto"
                    value={sliderVal}
                    onChange={handleSlide}
                    marks={marks}
                    disabled={balanceNumber == 0}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                  <Button
                    color="primary"
                    variant="contained"
                    className={
                      buttonDisabled
                        ? buttonStyleDisabled
                        : !walletConnected
                        ? buttonStyleConnectWallet
                        : insufficientFunds
                        ? buttonStyleInsufficientFunds
                        : buttonStyleEnabled
                    }
                    onClick={handleWithdrawSubmit}
                    disabled={insufficientFunds || buttonDisabled}
                    fullWidth
                  >
                    {!walletConnected
                      ? `Connect Wallet`
                      : amount == 0
                      ? `Withdraw`
                      : insufficientFunds
                      ? `Insufficient Balance`
                      : `Confirm Withdraw`}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Fade>
      </MuiModal>
    </div>
  );
}
