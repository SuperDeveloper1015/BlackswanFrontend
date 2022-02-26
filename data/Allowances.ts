import { Token, TokenAmount } from "@sushiswap/sdk";
import { useMemo } from "react";
import { useTokenContract } from "../hooks/useContract";
import useSWR from "swr";
export function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string
): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false);

  const inputs = useMemo(() => [owner, spender], [owner, spender]);
  const { data: allowance, mutate } = useSWR([
    token.address,
    "allowance",
    owner,
    spender,
  ]);
  return useMemo(
    () =>
      token && allowance
        ? new TokenAmount(token, allowance.toString())
        : undefined,
    [token, allowance]
  );
}
