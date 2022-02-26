import React, { useState, useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Backdrop, Fade, Modal as MuiModal } from "@material-ui/core";
import { Button } from "./styled/button";
import { ApprovalState, useApproveCallback } from "../hooks/useApproveCallback";
import { Token, TokenAmount } from "@sushiswap/sdk";
import { useWeb3React } from "@web3-react/core";
import { BalanceProps } from "../hooks/useTokenBalance";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther, formatUnits } from "@ethersproject/units";
import { formatToBalance } from "../utils";
import { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import ERC20ABI from "../abi/ERC20.abi.json";
import NumberFormat from "react-number-format";
import useSwanLake from "../hooks/useSwanLake";
import Grid from "@material-ui/core/Grid";
import { USDC, DISTRIBUTION_POOL_ADDRESS } from "../constants";
import { StyledTextField } from "./styled/text-field";
import { Slider } from "@material-ui/core";
import useDistributionPool from "../hooks/useDistributionPool";
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
    disabledInput: {
      color: theme.palette.text.primary,
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
    USDC[chainId].address,
    "balanceOf",
    account,
  ]);

  React.useEffect((): any => {
    // listen for changes on an Ethereum address
    console.log(`listening for Transfer...`);
    const contract = new Contract(USDC[chainId].address, ERC20ABI);
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

export default function DistributionPoolDepositForm() {
  const { account, library, chainId } = useWeb3React<Web3Provider>(); //metamask
  const classes = useStyles();
  const { allowance, stake, withdrawStake, collectRewards } =
    useDistributionPool();
  const [amount, setAmount] = useState<number>(0);
  const parsedInput: BalanceProps = formatToBalance(
    amount.toString() !== "." ? amount.toString() : "",
    6
  );
  const { data: balance, mutate } = useSWR([
    USDC[chainId].address,
    "balanceOf",
    account,
  ]);
  const { data: staked } = useSWR([
    DISTRIBUTION_POOL_ADDRESS[chainId],
    "balanceOf",
    account,
  ]);
  const [stageApprove, setStageApprove] = useState<string>("approve");
  const [balanceNumber, setBalanceNumber] = useState<number>();
  const [pendingTx, setPendingTx] = useState(false);
  const [sliderVal, setSliderVal] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const { toggleTheme, isDark } = useContext(ToggleThemeContext);
  const handleClose = () => {
    setOpen(false);
  };
  const handleSlide = (event: any, newValue: number | number[]) => {
    setSliderVal(newValue as number);
    setAmount(
      ((newValue as number) / 100) * parseFloat(formatUnits(balance, 6))
    );
  };
  const walletConnected = !!account;
  const buttonDisabled = pendingTx || amount === 0;
  const insufficientFunds = balanceNumber < amount;
  const inputError = insufficientFunds;
  React.useEffect((): any => {
    if (balance != undefined) {
      setBalanceNumber(parseFloat(formatUnits(balance, 6)));
    }
  });
  const handleChange = (event) => {
    if (balance != undefined) {
      setBalanceNumber(parseFloat(formatUnits(balance, 6)));
    }
    setAmount(event.target.value);
    setSliderVal(
      (event.target.value / parseFloat(formatUnits(balance, 6))) * 100
    );
  };
  const [approvalState, approve] = useApproveCallback(
    new TokenAmount(USDC[chainId], parsedInput.value.toString()),
    DISTRIBUTION_POOL_ADDRESS[chainId]
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
    <div>
      {staked != undefined && parseFloat(formatUnits(staked, 6)) !== 0.0 ? (
        <Button
          className={
            isDark
              ? "bg-white bg-opacity-20  rounded w-full xs hover:bg-opacity-80 disabled:bg-opacity-20"
              : "bg-black bg-opacity-30  rounded w-full xs hover:bg-opacity-80 disabled:bg-opacity-20"
          }
          style={{
            color: "#4353ff ",
            fontWeight: 700,

            fontFamily: "Roboto Mono",
          }}
          onClick={handleOpen}
        >
          +
        </Button>
      ) : (
        <Button
          className={
            isDark
              ? "bg-white  w-full outline-blue rounded text-black hover:bg-opacity-30 hover:text-gray disabled:bg-opacity-20"
              : "bg-black bg-opacity-80 w-full outline-blue rounded text-white hover:bg-opacity-30 hover:text-gray disabled:bg-opacity-20"
          }
          onClick={handleOpen}
        >
          DEPOSIT
        </Button>
      )}
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
                  <Balance />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <StyledTextField
                    label="Enter Amount"
                    variant="outlined"
                    value={amount}
                    fullWidth
                    disabled={stageApprove != "approve"}
                    onChange={handleChange}
                    name="numberformat"
                    id="formatted-numberformat-input"
                    InputProps={{
                      inputComponent: NumberFormatCustom as any,
                      classes: {
                        notchedOutline: classes.notchedOutline,
                        disabled: classes.disabledInput,
                      },
                    }}
                    InputLabelProps={{
                      style: { color: "black" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Slider
                    step={5}
                    valueLabelDisplay="auto"
                    value={sliderVal}
                    onChange={handleSlide}
                    marks={marks}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
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
              </Grid>
            </form>
          </div>
        </Fade>
      </MuiModal>
    </div>
  );
}
