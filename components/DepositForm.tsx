import React, { useState, useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Button } from "./styled/button";
import { ApprovalState, useApproveCallback } from "../hooks/useApproveCallback";
import { Token, TokenAmount } from "@sushiswap/sdk";
import { useWeb3React } from "@web3-react/core";
import { BalanceProps } from "../hooks/useTokenBalance";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import { formatToBalance } from "../utils";
import { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import ERC20ABI from "../abi/ERC20.abi.json";
import NumberFormat from "react-number-format";
import useSwanLake from "../hooks/useSwanLake";
import Grid from "@material-ui/core/Grid";
import { BPT_ADDRESS, SWANLAKE_ADDRESS } from "../constants";
import { StyledTextField } from "./styled/text-field";
import { FormControlLabel, Slider } from "@material-ui/core";
import { ToggleThemeContext } from "../theme/ThemeProvider";
import Switch from '@material-ui/core/Switch';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    button: {
      "&:disabled": {
        backgroundColor: "grey",
      },
    },
    notchedOutline: {
      color: "white",
      borderWidth: "1px",
      borderColor: "grey !important",
    },
    disabledInput: {
      color: theme.palette.text.primary,
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
    BPT_ADDRESS[chainId],
    "balanceOf",
    account,
  ]);

  React.useEffect((): any => {
    // listen for changes on an Ethereum address
    console.log(`listening for Transfer...`);
    const contract = new Contract(BPT_ADDRESS[chainId], ERC20ABI);
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

  return (
    <div style={{ textAlign: "left" }}>
      <span>Balance</span>

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

export default function DepositForm() {
  const { account, library, chainId } = useWeb3React<Web3Provider>(); //metamask
  const classes = useStyles();
  const { allowance, stake, withdrawStake, collectRewards } = useSwanLake();
  const [amount, setAmount] = useState<number>(0);
  const parsedInput: BalanceProps = formatToBalance(
    amount.toString() !== "." ? amount.toString() : ""
  );
  const { data: balance, mutate } = useSWR([
    BPT_ADDRESS[chainId],
    "balanceOf",
    account,
  ]);

  const [stageApprove, setStageApprove] = useState<string>("approve");
  const [balanceNumber, setBalanceNumber] = useState<number>();
  const [pendingTx, setPendingTx] = useState(false);
  const [sliderVal, setSliderVal] = useState<number>(10);

  const handleSlide = (event: any, newValue: number | number[]) => {
    setSliderVal(newValue as number);
    setAmount(((newValue as number) / 100) * balance);
  };
  const walletConnected = !!account;
  const buttonDisabled = pendingTx || amount === 0;
  const insufficientFunds = balanceNumber < amount;
  const { toggleTheme, isDark } = useContext(ToggleThemeContext);
  const inputError = insufficientFunds;
  React.useEffect((): any => {
    if (balance != undefined) {
      setBalanceNumber(parseFloat(formatEther(balance)));
    }
  });
  const handleChange = (event) => {
    if (balance != undefined) {
      setBalanceNumber(parseFloat(formatEther(balance)));
    }
    setAmount(event.target.value);
  };
  const [approvalState, approve] = useApproveCallback(
    new TokenAmount(
      new Token(chainId, BPT_ADDRESS[chainId], 18, "BPT", ""),
      parsedInput.value.toString()
    ),
    SWANLAKE_ADDRESS[chainId]
  );
  const handleStakeSubmit = async () => {
    if (buttonDisabled) return;
    if (!walletConnected) {
    } else {
      setPendingTx(true);

      if (Number(allowance) === 0) {
        const success = await sendTx(() => approve());
        if (!success) {
          setPendingTx(false);
          //setModalOpen(true)
          return;
        }
      }

      const success = await sendTx(() => stake(parsedInput));

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
          disabled={stageApprove != "approve"}
          onChange={handleChange}
          name="numberformat"
          id="formatted-numberformat-input"
          className="depo-width-input"
          InputProps={{
            inputComponent: NumberFormatCustom as any,
            classes: {
              notchedOutline: classes.notchedOutline,
              disabled: classes.disabledInput,
            },
            style: { color: isDark ? "white" : "black" },
          }}
          InputLabelProps={{
            style: { color: isDark ? "white" : "black" },
          }}
        />

        <Button
          type="button"
          variant="contained"
          color="primary"
          className={classes.button + " max-button"}
          onClick={toggleChecked}
        >
          MAX
        </Button>
        {approvalState === ApprovalState.NOT_APPROVED ||
        approvalState === ApprovalState.PENDING ? (
          <Button
            color="primary"
            variant="contained"
            className={`${buttonStyle} text-high-emphesis bg-black hover:bg-opacity-90`}
            onClick={handleStakeSubmit}
            fullWidth
            disabled={approvalState === ApprovalState.PENDING}
          >
            {approvalState === ApprovalState.PENDING ? (
              <span id="dots">Approving </span>
            ) : (
              "Approve"
            )}
          </Button>
        ) : (
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
            onClick={handleStakeSubmit}
            disabled={insufficientFunds || buttonDisabled}
            fullWidth
          >
            {!walletConnected
              ? `Connect Wallet`
              : amount == 0
              ? `Deposit`
              : insufficientFunds
              ? `Insufficient Balance`
              : `Confirm Staking`}
          </Button>
        )}
      </Grid>
    </form>
  );
}
