import { ChainId, CurrencyAmount } from "@sushiswap/sdk";
import { CheckCircle, Triangle, X } from "react-feather";
import React, { useCallback, useMemo } from "react";

import { AppDispatch } from "../../state";
import ExternalLink from "../ExternalLink";
import CircularProgress from "@material-ui/core/CircularProgress";
import { RowFixed } from "../Row";
import { TransactionDetails } from "../../state/transactions/reducer";
import { finalizeTransaction } from "../../state/transactions/actions";
import { getExplorerLink } from "../../functions/explorer";
import styled from "styled-components";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useAllTransactions } from "../../state/transactions/hooks";
import { useDispatch } from "react-redux";
import { classNames } from "../../functions/styling";

const TransactionStatusText = styled.div`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  :hover {
    text-decoration: underline;
  }
`;

const TransactionStateNoLink = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  padding-bottom: 0.25rem;
  font-weight: 500;
  font-size: 0.825rem;
  // color: ${({ theme }) => theme.primary1};
`;

const TransactionCancel = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  :hover {
    text-decoration: underline;
  }
`;

const TransactionExpiredBadge = styled.span`
  // color:  ${({ theme }) => theme.red1};
`;

const TransactionCancelledBadge = styled.span`
  // color:  ${({ theme }) => theme.red3};
`;

const TransactionRemainingTimeBadge = styled.span`
  // color:  ${({ theme }) => theme.primary1};
`;

const IconWrapper = styled.div<{
  pending: boolean;
  success?: boolean;
  cancelled?: boolean;
}>`
  // color: ${({ pending, success, cancelled, theme }) =>
    pending
      ? theme.primary1
      : success
      ? theme.green1
      : cancelled
      ? theme.red3
      : theme.red1};
`;

const calculateSecondsUntilDeadline = (tx: TransactionDetails): number => {
  if (tx?.archer?.deadline && tx?.addedTime) {
    const millisecondsUntilUntilDeadline =
      tx.archer.deadline * 1000 - Date.now();
    return millisecondsUntilUntilDeadline < 0
      ? -1
      : Math.ceil(millisecondsUntilUntilDeadline / 1000);
  }
  return -1;
};

export default function Transaction({ hash }: { hash: string }): any {
  const { chainId } = useActiveWeb3React();
  const allTransactions = useAllTransactions();
  const dispatch = useDispatch<AppDispatch>();

  const tx = allTransactions?.[hash];
  const summary = tx?.summary;
  const pending = !tx?.receipt;
  const success =
    !pending &&
    tx &&
    (tx.receipt?.status === 1 || typeof tx.receipt?.status === "undefined");
  const archer = tx?.archer;
  const secondsUntilDeadline = useMemo(
    () => calculateSecondsUntilDeadline(tx),
    [tx]
  );
  const mined = tx?.receipt && tx.receipt.status !== 1337;
  const cancelled = tx?.receipt && tx.receipt.status === 1337;
  const expired = secondsUntilDeadline === -1;

  if (!chainId) return null;

  return (
    <div className="flex items-center">
      <ExternalLink
        href={getExplorerLink(chainId, hash, "transaction")}
        className="flex items-center"
      >
        <RowFixed>
          <TransactionStatusText>{summary ?? hash} ↗</TransactionStatusText>
        </RowFixed>
        <div
          className={classNames(
            pending
              ? "text-primary"
              : success
              ? "text-green"
              : cancelled
              ? "text-red"
              : "text-red"
          )}
        >
          {pending ? (
            <CircularProgress color="secondary" size="1.5rem" />
          ) : success ? (
            <CheckCircle size="16" />
          ) : cancelled ? (
            <X size="16" />
          ) : (
            <Triangle size="16" />
          )}
        </div>
      </ExternalLink>
      {archer && (
        <TransactionStateNoLink>
          {pending ? (
            <>
              {secondsUntilDeadline >= 60 ? (
                <TransactionRemainingTimeBadge>
                  &#128337; {`${Math.ceil(secondsUntilDeadline / 60)} mins`}{" "}
                </TransactionRemainingTimeBadge>
              ) : (
                <TransactionRemainingTimeBadge>
                  &#128337; {`<1 min`}{" "}
                </TransactionRemainingTimeBadge>
              )}
            </>
          ) : cancelled ? (
            <TransactionCancelledBadge>Cancelled</TransactionCancelledBadge>
          ) : (
            !mined &&
            expired && (
              <TransactionExpiredBadge>Expired</TransactionExpiredBadge>
            )
          )}
        </TransactionStateNoLink>
      )}
    </div>
  );
}
