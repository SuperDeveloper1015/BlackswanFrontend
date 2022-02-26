import React, { useState, useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormControlLabel, Grid, Slider, Typography } from "@material-ui/core";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import { SWANLAKE_ADDRESS } from "../constants";
import { formatToBalance } from "../utils";
import useSwanLake from "../hooks/useSwanLake";
import { BalanceProps } from "../hooks/useTokenBalance";
import NumberFormat from "react-number-format";
import { StyledTextField } from "./styled/text-field";
import { Button } from "./styled/button";
import BPTRewardsInfoCard from "./BPTRewardsInfoCard";
import Switch from '@material-ui/core/Switch';
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
    SWANLAKE_ADDRESS[chainId],
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
          ? ` ${formatEther(balance)} LP Token`
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

export default function WithDrawForm() {
  const { account, library, chainId } = useWeb3React<Web3Provider>();
  const { data: balance, mutate } = useSWR([
    SWANLAKE_ADDRESS[chainId],
    "balanceOf",
    account,
  ]);
  const { allowance, stake, withdrawStake } = useSwanLake();
  const [sliderVal, setSliderVal] = useState<number>(10);
  const [amount, setAmount] = useState<number>(0);
  const [toggle, setToggle] = useState<boolean>(false);

  const classes = useStyles();
  const parsedInput: BalanceProps = formatToBalance(
    amount.toString() !== "." ? amount.toString() : "",
    18
  );
  const { toggleTheme, isDark } = useContext(ToggleThemeContext);
  const [balanceNumber, setBalanceNumber] = useState<number>();
  const [pendingTx, setPendingTx] = useState(false);
  const walletConnected = !!account;
  const buttonDisabled = pendingTx || amount === 0;
  const insufficientFunds = balanceNumber < amount;
  const handleMax = () => {
    setAmount(balanceNumber);
  };
  const handleChange = (event) => {
    if (balance != undefined) {
      setBalanceNumber(parseFloat(formatEther(balance)));
    }
    setAmount(event.target.value);
  };
  React.useEffect((): any => {
    if (balance != undefined) {
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

      setAmount(0);
      setPendingTx(false);
    }
  };

  const toggleChecked = () => {
    setAmount(parseFloat(formatEther(balance)));
  }

  const marks = [
    {
      value: 10,
      label: "10%",
    },
    {
      value: 50,
      label: "50%",
    },
    {
      value: 100,
      label: "100%",
    },
  ];

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Grid
        container
        alignContent="center"
        alignItems="center"
        justify="center"
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ marginBottom: "20px" }}
        >
          <Balance />
        </Grid>
        <StyledTextField
          fullWidth
          label="Enter Amount"
          variant="outlined"
          value={amount}
          onChange={handleChange}
          name="numberformat"
          id="formatted-numberformat-input"
          className="depo-width-input"
          InputProps={{
            inputComponent: NumberFormatCustom as any,
            classes: {
              notchedOutline: classes.notchedOutline,
            },
            style: { color: isDark ? "white" : "black" },
          }}
          InputLabelProps={{
            style: { color: isDark ? "white" : "black" },
          }}
        ></StyledTextField>

        <Button
          type="button"
          variant="contained"
          color="primary"
          className={classes.button + " max-button"}
          onClick={toggleChecked}
        >
          MAX
        </Button>

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
    </form>
  );
}
