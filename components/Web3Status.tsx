import { AbstractConnector } from "@web3-react/abstract-connector";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { darken, lighten } from "polished";
import React, { useMemo } from "react";
import { Activity } from "react-feather";
import { Web3Provider } from "@ethersproject/providers";
import { injected } from "../connectors";
import { NetworkContextName } from "../constants";
import { shortenAddress } from "../utils";
import { ButtonSecondary } from "./ButtonLegacy";
import { ChainId } from "@sushiswap/sdk";
import Image from "next/image";
import { Button, Typography } from "@material-ui/core";
import WalletModal from "./WalletModal";
import { useActiveWeb3React } from "../hooks/useActiveWeb3React";
import {
  isTransactionRecent,
  useAllTransactions,
} from "../state/transactions/hooks";
import { useWalletModalToggle } from "../state/application/hooks";
import { TransactionDetails } from "../state/transactions/reducer";
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime;
}
// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return <Image src="/static/imgs/white-swan.svg" height={22} width={22} />;
    // return <Identicon />
  }
  return null;
}
const PARAMS: {
  [chainId in ChainId]?: {
    chainId: string;
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
  };
} = {
  [ChainId.MATIC]: {
    chainId: "137",
    chainName: "Matic",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: [
      //'https://matic-mainnet.chainstacklabs.com/'
      "https://rpc-mainnet.maticvigil.com",
    ],
    blockExplorerUrls: ["https://explorer-mainnet.maticvigil.com"],
  },
};
const Web3StatusInner = () => {
  const { account, connector, error, library, chainId } =
    useWeb3React<Web3Provider>();
  const allTransactions = useAllTransactions();
  const toggleWalletModal = useWalletModalToggle();
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => {
      if (tx.receipt) {
        return false;
      } else if (tx.archer && tx.archer.deadline * 1000 - Date.now() < 0) {
        return false;
      } else {
        return true;
      }
    })
    .map((tx) => tx.hash);
  const handleNetworkSwitch = () => {
    const params = [
      {
        chainId: "0x89",
        chainName: "Matic",
        nativeCurrency: {
          name: "Matic",
          symbol: "MATIC",
          decimals: 18,
        },
        rpcUrls: [
          //'https://matic-mainnet.chainstacklabs.com/'
          "https://rpc-mainnet.maticvigil.com",
        ],
        blockExplorerUrls: ["https://explorer-mainnet.maticvigil.com"],
      },
    ];

    library?.provider
      .request({ method: "wallet_addEthereumChain", params })
      .then(() => console.log("Success"))
      .catch((error: Error) => console.log("Error", error.message));
  };
  const hasPendingTransactions = !!pending.length;
  if (account) {
    return (
      <div
        id="web3-status-connected"
        className="flex items-center px-3 py-2 text-sm rounded-lg bg-dark-1000 text-secondary"
        onClick={toggleWalletModal}
      >
        {hasPendingTransactions ? (
          <div className="flex items-center justify-between">
            <div className="pr-2">{pending?.length} Pending</div>{" "}
            <CircularProgress color="secondary" size="1.5rem" />
          </div>
        ) : (
          <div className="mr-2">{shortenAddress(account)}</div>
        )}
        {connector && <StatusIcon connector={connector} />}
      </div>
    );
  } else if (error) {
    return (
      <Button
        style={{
          width: "100%",
          alignItems: "center",
          padding: "0.5rem",
          borderRadius: "10px",
          cursor: "pointer",
          userSelect: "none",
          backgroundColor: "#FD4040",
          border: "border: 1px solid #FD4040",
        }}
        onClick={handleNetworkSwitch}
      >
        <Activity
          style={{
            marginLeft: "0.25rem",
            marginRight: "0.5rem",
            width: "16px",
            height: "16px",
          }}
        />
        <Typography>
          {error instanceof UnsupportedChainIdError
            ? `You are on the wrong network`
            : `Error`}
        </Typography>
      </Button>
    );
  } else {
    return <div></div>;
  }
};

export default function Web3Status() {
  const { active, account } = useWeb3React();
  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);
  const confirmed = sortedRecentTransactions
    .filter((tx) => tx.receipt)
    .map((tx) => tx.hash);
  //const contextNetwork = useWeb3React(NetworkContextName)

  return (
    <>
      <Web3StatusInner />
      <WalletModal
        ENSName={undefined}
        pendingTransactions={pending}
        confirmedTransactions={confirmed}
      />
    </>
  );
}
