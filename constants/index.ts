import { ChainId, JSBI, Percent, Token, WETH } from "@sushiswap/sdk";
import { injected } from "../connectors";

import { AbstractConnector } from "@web3-react/abstract-connector";

export const POOL_DENY = ["14", "29", "45", "30"];

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

type ChainTokenMap = {
  readonly [chainId in ChainId]?: Token;
};

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 2;
export const BLOCKS_PER_YEAR = 15768000;
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320;
export const PROPOSAL_LENGTH_IN_SECS =
  AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS;

export const TIMELOCK_ADDRESS = "0x1a9C8182C09F50C8318d769245beA52c32BE35BC";
// SWAN
export const SWAN: ChainTokenMap = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    "0x8381C292F0d9188417d63db950247D787e013edD",
    18,
    "SWAN",
    "BLACKSWAN TOKEN"
  ),
  [ChainId.MATIC]: new Token(
    ChainId.MATIC,
    "0xab7589dE4C581Db0fb265e25a8e7809D84cCd7E8",
    18,
    "SWAN",
    "BLACKSWAN TOKEN"
  ),
};
export const BPT_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MATIC_TESTNET]: "0x933b3AC5235B444a46448bFB144ca9bE9f13eDB4",
  [ChainId.MATIC]: "0xD3293BdE855033c77B7919da40ABD1DF9EB5eB46",
};
export const SWANLAKE_HELPER: { [chainId in ChainId]?: string } = {
  [ChainId.MATIC_TESTNET]: "0x933b3AC5235B444a46448bFB144ca9bE9f13eDB4",
  [ChainId.MATIC]: "0x6b892D371e50113c6872311C3ae76D73Fb2Cd8F8",
};
export const SWAN_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MATIC_TESTNET]: "0x46e0e252b6868F093F88d7F5197b0fb91866406C",
  [ChainId.MATIC]: "0xab7589dE4C581Db0fb265e25a8e7809D84cCd7E8",
};
export const POLICY_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MATIC_TESTNET]: "0x46e0e252b6868F093F88d7F5197b0fb91866406C",
  [ChainId.MATIC]: "0xa42b6a479A2fA07bE5665D60c004fb3C6C9E9171",
};
export const SWANLAKE_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MATIC_TESTNET]: "0x9D32edeA539625DE9F2092fD8ab4ed2982eebDb9",
  [ChainId.MATIC]: "0xE420CC7F8F0df0f145d146e9FDC8a4237660Eecb",
};
export const REWARD_POOL_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MATIC_TESTNET]: "0xcFe1844FCf19Ca39037cdaAeC0694f697eE4F974",
  [ChainId.MATIC]: "0x238B4584F472502298f8E38A3a10f24FF65BFEd8",
};
export const ORACLE_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MATIC_TESTNET]: "0xcFe1844FCf19Ca39037cdaAeC0694f697eE4F974",
  [ChainId.MATIC]: "0x4C4bF6d5b4E9f4028677e07333BD44aa06EF3d14",
};
export const DISTRIBUTION_POOL_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MATIC_TESTNET]: "0x073d7740fEd5C221F9851c71A0b8b28ac7090a3B",
  [ChainId.MATIC]: "0xbCf0734600AC0AcC1BaD85f62c0BE82BBC8Ca3B5",
};
export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  // [UNI_ADDRESS]: 'UNI',
  [TIMELOCK_ADDRESS]: "Timelock",
};
export const MATIC: { [key: string]: Token } = {
  USDC: new Token(
    ChainId.MATIC,
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    6,
    "USDC",
    "USD Coin"
  ),
  WBTC: new Token(
    ChainId.MATIC,
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    8,
    "WBTC",
    "Wrapped Bitcoin"
  ),
  DAI: new Token(
    ChainId.MATIC,
    "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    18,
    "DAI",
    "Dai Stablecoin"
  ),
  WETH: new Token(
    ChainId.MATIC,
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    18,
    "WETH",
    "Wrapped Ether"
  ),
  USDT: new Token(
    ChainId.MATIC,
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    6,
    "USDT",
    "Tether USD"
  ),
  TEL: new Token(
    ChainId.MATIC,
    "0xdF7837DE1F2Fa4631D716CF2502f8b230F1dcc32",
    2,
    "TEL",
    "Telcoin"
  ),
  SUSHI: new Token(
    ChainId.MATIC,
    "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a",
    18,
    "SUSHI",
    "SushiToken"
  ),
  AAVE: new Token(
    ChainId.MATIC,
    "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    18,
    "AAVE",
    "Aave"
  ),
  FRAX: new Token(
    ChainId.MATIC,
    "0x104592a158490a9228070E0A8e5343B499e125D0",
    18,
    "FRAX",
    "Frax"
  ),
  FXS: new Token(
    ChainId.MATIC,
    "0x3e121107F6F22DA4911079845a470757aF4e1A1b",
    18,
    "FXS",
    "Frax Share"
  ),
};
// USDC
export const USDC: ChainTokenMap = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.MATIC_TESTNET]: new Token(
    ChainId.MATIC_TESTNET,
    "0x83107fb21b8172ac604a6999e3e42dbb01c07507",
    6,
    "USDC",
    "USD Coin"
  ),
  [ChainId.MATIC]: new Token(
    ChainId.MATIC,
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    6,
    "USDC",
    "USD Coin"
  ),
};
// Default Ethereum chain tokens
export const DAI = new Token(
  ChainId.MAINNET,
  "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  18,
  "DAI",
  "Dai Stablecoin"
);
export const USDT = new Token(
  ChainId.MAINNET,
  "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  6,
  "USDT",
  "Tether USD"
);
export const AMPL = new Token(
  ChainId.MAINNET,
  "0xD46bA6D942050d489DBd938a2C909A5d5039A161",
  9,
  "AMPL",
  "Ampleforth"
);
export const WBTC = new Token(
  ChainId.MAINNET,
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  8,
  "WBTC",
  "Wrapped BTC"
);
export const RUNE = new Token(
  ChainId.MAINNET,
  "0x3155BA85D5F96b2d030a4966AF206230e46849cb",
  18,
  "RUNE",
  "RUNE.ETH"
);
export const NFTX = new Token(
  ChainId.MAINNET,
  "0x87d73E916D7057945c9BcD8cdd94e42A6F47f776",
  18,
  "NFTX",
  "NFTX"
);
export const STETH = new Token(
  ChainId.MAINNET,
  "0xDFe66B14D37C77F4E9b180cEb433d1b164f0281D",
  18,
  "stETH",
  "stakedETH"
);

export const CREAM = new Token(
  ChainId.MAINNET,
  "0x2ba592F78dB6436527729929AAf6c908497cB200",
  18,
  "CREAM",
  "Cream"
);
export const BAC = new Token(
  ChainId.MAINNET,
  "0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a",
  18,
  "BAC",
  "Basis Cash"
);
export const FXS = new Token(
  ChainId.MAINNET,
  "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0",
  18,
  "FXS",
  "Frax Share"
);
export const ALPHA = new Token(
  ChainId.MAINNET,
  "0xa1faa113cbE53436Df28FF0aEe54275c13B40975",
  18,
  "ALPHA",
  "AlphaToken"
);
export const USDP = new Token(
  ChainId.MAINNET,
  "0x1456688345527bE1f37E9e627DA0837D6f08C925",
  18,
  "USDP",
  "USDP Stablecoin"
);
export const DUCK = new Token(
  ChainId.MAINNET,
  "0x92E187a03B6CD19CB6AF293ba17F2745Fd2357D5",
  18,
  "DUCK",
  "DUCK"
);
export const BAB = new Token(
  ChainId.MAINNET,
  "0xC36824905dfF2eAAEE7EcC09fCC63abc0af5Abc5",
  18,
  "BAB",
  "BAB"
);
export const HBTC = new Token(
  ChainId.MAINNET,
  "0x0316EB71485b0Ab14103307bf65a021042c6d380",
  18,
  "HBTC",
  "Huobi BTC"
);
export const FRAX = new Token(
  ChainId.MAINNET,
  "0x853d955aCEf822Db058eb8505911ED77F175b99e",
  18,
  "FRAX",
  "FRAX"
);
export const IBETH = new Token(
  ChainId.MAINNET,
  "0xeEa3311250FE4c3268F8E684f7C87A82fF183Ec1",
  8,
  "ibETHv2",
  "Interest Bearing Ether v2"
);
export const PONT = new Token(
  ChainId.MAINNET,
  "0xcb46C550539ac3DB72dc7aF7c89B11c306C727c2",
  9,
  "pONT",
  "Poly Ontology Token"
);
export const PWING = new Token(
  ChainId.MAINNET,
  "0xDb0f18081b505A7DE20B18ac41856BCB4Ba86A1a",
  9,
  "pWING",
  "Poly Ontology Wing Token"
);

export const UMA = new Token(
  ChainId.MAINNET,
  "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828",
  18,
  "UMA",
  "UMA"
);

export const UMA_CALL = new Token(
  ChainId.MAINNET,
  "0x1062aD0E59fa67fa0b27369113098cC941Dd0D5F",
  18,
  "UMA",
  "UMA 35 Call [30 Apr 2021]"
);

export const DOUGH = new Token(
  ChainId.MAINNET,
  "0xad32A8e6220741182940c5aBF610bDE99E737b2D",
  18,
  "DOUGH",
  "PieDAO Dough v2"
);

export const PLAY = new Token(
  ChainId.MAINNET,
  "0x33e18a092a93ff21aD04746c7Da12e35D34DC7C4",
  18,
  "PLAY",
  "Metaverse NFT Index"
);

export const XSUSHI_CALL = new Token(
  ChainId.MAINNET,
  "0xada279f9301C01A4eF914127a6C2a493Ad733924",
  18,
  "XSUc25-0531",
  "XSUSHI 25 Call [31 May 2021]"
);

export const XSUSHI = new Token(
  ChainId.MAINNET,
  "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272",
  18,
  "xSUSHI",
  "SushiBar"
);
export const LIFT = new Token(
  ChainId.MAINNET,
  "0xf9209d900f7ad1DC45376a2caA61c78f6dEA53B6",
  18,
  "LIFT",
  "LiftKitchen"
);
export const LFBTC = new Token(
  ChainId.MAINNET,
  "0xafcE9B78D409bF74980CACF610AFB851BF02F257",
  18,
  "LFBTC",
  "LiftKitchen BTC"
);

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: "Injected",
    iconName: "arrow-right.svg",
    description: "Injected web3 provider.",
    href: null,
    color: "#010101",
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: "MetaMask",
    iconName: "metamask.png",
    description: "Easy-to-use browser extension.",
    href: null,
    color: "#E8831D",
  },
};

export const NetworkContextName = "NETWORK";

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7);

export const BIG_INT_ZERO = JSBI.BigInt(0);

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(
  JSBI.BigInt(100),
  BIPS_BASE
); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(
  JSBI.BigInt(300),
  BIPS_BASE
); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(
  JSBI.BigInt(500),
  BIPS_BASE
); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(
  JSBI.BigInt(1000),
  BIPS_BASE
); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(
  JSBI.BigInt(1500),
  BIPS_BASE
); // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(
  JSBI.BigInt(10),
  JSBI.BigInt(16)
); // .01 ETH
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(
  JSBI.BigInt(50),
  JSBI.BigInt(10000)
);

export const ZERO_PERCENT = new Percent("0");
export const ONE_HUNDRED_PERCENT = new Percent("1");
export * from "./countdownDates";
