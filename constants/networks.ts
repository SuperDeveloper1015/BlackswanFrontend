import { ChainId } from "@sushiswap/sdk";

export const NETWORK_ICON = {
  [ChainId.MAINNET]: "/static/networks/mainnet-network.jpg",
  [ChainId.KOVAN]: "static/networks/kovan-network.jpg",
  [ChainId.MATIC_TESTNET]: "static/networks/mumbai-network.png",
  [ChainId.MATIC]: "static/networks/polygon-network.jpg",
};

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: "Ethereum",
  [ChainId.RINKEBY]: "Rinkeby",
  [ChainId.ROPSTEN]: "Ropsten",
  [ChainId.GÖRLI]: "Görli",
  [ChainId.KOVAN]: "Kovan",
  [ChainId.MATIC_TESTNET]: "Mumbai",
  [ChainId.MATIC]: "Polygon",
};
