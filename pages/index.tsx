import React, { useMemo, useState, useContext } from "react";
import Link, { LinkProps } from "next/link";
import Head from "next/head";
import styled from "styled-components";
import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError,
} from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import PropTypes from "prop-types";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import Grid from "@material-ui/core/Grid";
import { useEagerConnect, useInactiveListener } from "../hooks";
import { Networks, shorter, TOKENS_BY_NETWORK } from "../utils";
import NavBar from "../components/NavBar";
import FarmStakeCard from "../components/FarmStakeCard";
import PoolStakeCard from "../components/PoolStakeCard";
import HomeTab from "../components/HomeTab";
import dynamic from "next/dynamic";
import fetcher from "swr-eth";
import Switch from "@material-ui/core/Switch";
import useSWR, { SWRConfig } from "swr";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { ToggleThemeContext } from "../theme/ThemeProvider";
import {
  AppBar,
  Box,
  Card,
  createStyles,
  CssBaseline,
  Drawer,
  Hidden,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Tabs,
  Toolbar,
  Typography,
  withStyles,
} from "@material-ui/core";
import { default as Tab, TabProps } from "@material-ui/core/Tab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGithub,
  faTelegram,
  faYoutube,
  faReddit,
  faTwitter,
  faDiscord,
  faMedium,
} from "@fortawesome/free-brands-svg-icons";
import { Provider } from "react-redux";
import ApplicationUpdater from "../state/application/updater";
import TransactionUpdater from "../state/transactions/updater";
import store from "../state";
import withWidth from "@material-ui/core/withWidth";
import MenuIcon from "@material-ui/icons/Menu";
import { Disclosure } from "@headlessui/react";
import Web3Network from "../components/Web3Network";
import Web3Status from "../components/Web3Status";
import Image from "next/image";
import { injected } from "../connectors";
import { Button } from "../components/styled/button";
import { SwanRewardsCollectButton } from "../components/SwanRewardsCollectButton";
import { SWAN_ADDRESS } from "../constants";
import StatsTab from "../components/StatsTab";

const LinkTab: React.ComponentType<TabProps & LinkProps> =
  Tab as React.ComponentType<TabProps & LinkProps>;

const Web3ProviderNetwork = dynamic(
  () => import("../components/Web3ProviderNetwork"),
  { ssr: false }
);
function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "Please change your network to Polygon(Matic).";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider, "any");
  library.pollingInterval = 12000;
  return library;
}
function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <TransactionUpdater />
    </>
  );
}
export default function () {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <Updaters />
          <App />
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
}

export const App: React.FC = () => {
  const context = useWeb3React<Web3Provider>();

  const {
    connector,
    library,
    active,
    error,
    chainId,
    account,
    activate,
    deactivate,
  } = context;
  // console.log(useSwanLake())
  const ABIs = useMemo(() => {
    return (TOKENS_BY_NETWORK[chainId] || []).map<[string, any]>(
      ({ address, abi }) => [address, abi]
    );
  }, [chainId]);
  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>();
  const [value, setValue] = useState(0);
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);
  const { toggleTheme, isDark } = useContext(ToggleThemeContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [navClassList, setNavClassList] = useState(
    "w-screen gradiant-border-bottom z-10 backdrop-filter backdrop-blur"
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
  }

  const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
      >
        {value === index && (
          <Box style={{ paddingTop: "80px" }}>{children}</Box>
        )}
      </div>
    );
  };

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  const drawerWidth = "20vw";

  const useClasses = makeStyles((theme) => ({
    drawer: {
      "& .MuiDrawer-paperAnchorDockedLeft": {
        marginTop: "80px",
        backgroundColor: "#ffffff",
      },
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
        backgroundColor: "#ffffff",
      },
      display: "flex",
    },
    paper: {
      top: "80px",
      backgroundColor: "#ffffff",
    },
    backDrop: {
      top: "80px !important",
      "& .MuiBackdrop-root": {
        marginTop: "80px",
      },
    },
    root: {
      flexGrow: 1,
      backgroundColor: "#ffffff",
      display: "flex",
      "& .MuiTab-root": {
        borderBottom: "solid 1px #e5e7eb",
        minWidth: drawerWidth,
        [theme.breakpoints.down("xs")]: {
          minWidth: "100vw",
        },
      },
      "& .MuiPaper-root": {
        borderBottom: "solid 1px #e5e7eb",
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
      [theme.breakpoints.down("xs")]: {
        marginLeft: "12px",
      },
      color: "#000",
    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
      width: drawerWidth,
    },
    appbar: {
      "& .MuiToolbar-gutters": {
        padding: "0",
      },
      "& .MuiToolbar-root": {
        display: "inline-block",
      },
      backgroundColor: "#fff",
      boxShadow: "inset 0 -7px 10px -7px #e5e7eb",
      borderBottom: "solid 1px #e5e7eb",
      height: "80px",
    },
    logoContainer: {
      width: "20vw",
      float: "left",
      "& img": {
        minHeight: "64px",
        minWidth: "64px",
        position: "relative",
      },
      "& div": {
        overflow: "unset",
        marginLeft: "calc(10vw - 32px - 16px) !important",
        width: "64px",
      },
    },
    web3Status: {
      marginLeft: "10px",
    },
  }));
  const classes = useClasses();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const Wrapper = styled.div`
    & {
      button {
        :focus {
          outline: none;
        }
      }
    }
  `;

  const FONT = `
    font-family:Open Sans,Lato,Arial,sans-serif;
    color: '#808080';
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.6;
  `;

  function FlexDiv(props) {
    const StyledDiv = styled.div<{ width }>`
      & {
        ${FONT}
        h3 {
          font-size: 24px;
        }
        background-color: ${isDark ? "rgb(26, 29, 33)" : "rgb(250, 249, 250)"};
        color: ${isDark ? "white" : "black"};
        border-bottom: solid 1px #ebe5eb;
        width: ${({ width }) => (width === "xs" ? "100vw" : "80vw")};
        padding: 12px;
      }
    `;
    return <StyledDiv width={props.width}>{props.children}</StyledDiv>;
  }
  const Banner = withWidth()(FlexDiv);

  function FlexGrid(props) {
    const StyledDiv = styled(Grid)<{ width }>`
      & {
        width: ${({ width }) => (width === "xs" ? "100vw" : "80vw")};
        padding: 25px;
        background-color: ${isDark ? "rgb(26, 29, 33)" : "rgb(250, 249, 250)"};
        justify-content: space-around;
        display: flex;
      }
    `;
    return <StyledDiv width={props.width}>{props.children}</StyledDiv>;
  }
  const TabPanelGrid = withWidth()(FlexGrid);

  const SwanTabs = withStyles({
    root: {
      background: isDark && "rgb(25, 23, 29)",
      color: isDark && "white",
      borderRight: "solid 1px #e5e7eb",
      height: "95vh",
    },
    indicator: {
      backgroundColor: "#4353ff",
    },
  })(Tabs);

  let drawer = (
    <div>
      <SwanTabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="Home" />
        <LinkTab
          label="Swap"
          href={`https://quickswap.exchange/#/swap?outputCurrency=${SWAN_ADDRESS[chainId]}`}
        />
        <Tab label="LAKE" />
        <Tab label="Pools" />
        <Tab label="Stats" />
        <LinkTab label="Docs" href={"https://docs.blackswan.network/"} />
        <LinkTab
          label="Audit"
          href={
            "https://github.com/blackswanfinance/BlackSwan/blob/main/audit/Blackswan%20Standart%20Smart%20Contract%20Security%20Audit.pdf"
          }
        />
      </SwanTabs>

      <div
        style={{
          display: "flex",
          width: "20vw",
          bottom: 0,
          position: "fixed",
          padding: 25,

          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Link href="https://twitter.com/blackswantoken">
            <a
              href="https://twitter.com/blackswantoken"
              target="_blank"
              rel="noopener noreferrer"
              title="Twitter"
            >
              <FontAwesomeIcon
                icon={faTwitter}
                size="2x"
                color={isDark ? "white" : "black"}
              />
            </a>
          </Link>
          <Link href="https://t.me/blackswantoken">
            <a
              href="https://t.me/blackswantoken "
              target="_blank"
              rel="noopener noreferrer"
              title="Telegram"
            >
              <FontAwesomeIcon
                icon={faTelegram}
                size="2x"
                color={isDark ? "white" : "black"}
              />
            </a>
          </Link>
          <Link href="https://github.com/blackswanfinance/">
            <a
              href="https://github.com/blackswanfinance/"
              target="_blank"
              rel="noopener noreferrer"
              title="Github"
            >
              <FontAwesomeIcon
                icon={faGithub}
                size="2x"
                color={isDark ? "white" : "black"}
              />
            </a>
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "flex-end",
            marginTop: 10,
          }}
        >
          <FontAwesomeIcon
            onClick={toggleTheme}
            icon={faSun}
            size="2x"
            color={isDark ? "white" : "black"}
          />
          <Switch
            checked={isDark}
            onChange={toggleTheme}
            name="checkedA"
            color="default"
          />
          <FontAwesomeIcon
            onClick={toggleTheme}
            icon={faMoon}
            size="2x"
            color={isDark ? "white" : "black"}
          />
        </div>
      </div>
    </div>
  );

  enum ConnectorNames {
    Injected = "Connect MetaMask",
  }

  const connectorsByName: { [connectorName in ConnectorNames]: any } = {
    [ConnectorNames.Injected]: injected,
  };

  return (
    <Wrapper
      style={{
        backgroundColor: isDark ? "rgb(26, 29, 33)" : "rgb(250, 249, 250)",
        height: "100vh",
      }}
    >
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
        key="viewport"
      />
      <Head>
        <title key="title">BlackSwan Application</title>
      </Head>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appbar}>
          <Toolbar>
            <Disclosure as="nav">
              {({ open }) => (
                <div className="px-4 py-1.5">
                  <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                      >
                        <MenuIcon />
                      </IconButton>
                      <div className={`flex-shrink-0 ${classes.logoContainer}`}>
                        <Image
                          src="/static/imgs/BlackSwanIconBlack.png"
                          alt="Swan Logo"
                          width="64"
                          height="64"
                        />
                      </div>
                    </div>
                    <div>
                      <div
                        className={`flex items-center justify-between sm:justify-end w-full`}
                      >
                        {library && library.provider.isMetaMask && (
                          <div className="inline-block">
                            <Web3Network />
                          </div>
                        )}
                        <div
                          className={`${classes.web3Status} w-auto flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto`}
                        >
                          {account && chainId && (
                            <>
                              <div className="py-2 px-3 text-primary text-bold"></div>
                            </>
                          )}
                          <Web3Status />
                        </div>

                        {Object.keys(connectorsByName).map((name) => {
                          const currentConnector = connectorsByName[name];
                          const activating =
                            currentConnector === activatingConnector;
                          const connected = currentConnector === connector;
                          const disabled =
                            !triedEager ||
                            !!activatingConnector ||
                            connected ||
                            !!error;
                          if (disabled === true) {
                          } else {
                            return (
                              <div
                                className="flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
                                onClick={() => {
                                  setActivatingConnector(currentConnector);
                                  activate(connectorsByName[name]);
                                }}
                              >
                                <div className="grid grid-flow-col auto-cols-max items-center rounded-lg bg-dark-1000 text-sm text-secondary py-2 px-3 pointer-events-auto">
                                  <img
                                    src={"/static/imgs/metamask.png"}
                                    className="rounded-md mr-2"
                                    style={{ width: 22, height: 22 }}
                                  />
                                  <div className="text-primary">{name}</div>
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Disclosure>
          </Toolbar>
        </AppBar>
        {/** ************************************* */}
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              classes={{ paper: classes.paper, root: classes.backDrop }}
              variant="temporary"
              anchor={"left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer variant="permanent" open>
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main>
          {/** ************************************* */}
          <div>
            <TabPanel value={value} index={0}>
              <TabPanelGrid container>
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  {!active && (
                    <Typography
                      variant="h4"
                      color="secondary"
                      style={{ textAlign: "center" }}
                    >
                      Please Connect your Metamask
                    </Typography>
                  )}
                  {active && (
                    <SWRConfig
                      value={{ fetcher: fetcher(library, new Map(ABIs)) }}
                    >
                      {!!error && (
                        <div>
                          {" "}
                          <Typography
                            variant="h4"
                            color="secondary"
                            style={{ textAlign: "center" }}
                          >
                            {!!error && getErrorMessage(error)}
                          </Typography>
                        </div>
                      )}

                      <HomeTab />
                    </SWRConfig>
                  )}
                </Grid>
              </TabPanelGrid>
            </TabPanel>
            <TabPanel value={value} index={4}>
              <TabPanelGrid container>
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  {!active && (
                    <Typography
                      variant="h4"
                      color="secondary"
                      style={{ textAlign: "center" }}
                    >
                      Please Connect your Metamask
                    </Typography>
                  )}
                  {active && (
                    <SWRConfig
                      value={{ fetcher: fetcher(library, new Map(ABIs)) }}
                    >
                      {!!error && (
                        <div>
                          {" "}
                          <Typography
                            variant="h4"
                            color="secondary"
                            style={{ textAlign: "center" }}
                          >
                            {!!error && getErrorMessage(error)}
                          </Typography>
                        </div>
                      )}
                    <StatsTab />
                      
                    </SWRConfig>
                  )}
                </Grid>
              </TabPanelGrid>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Banner>
                <h3>Blackswan Lake</h3>
                The Blackswan Lake gives you access to aggressive rewards from
                the Blackswan Fund during periods of uncertainty and passive
                rewards during periods of stability. This is what allows $SWAN
                to become anti-fragile
              </Banner>
              <TabPanelGrid
                container
                justify="center"
                alignContent="center"
                alignItems="center"
                style={{
                  margin: "24px 0",
                }}
              >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  {active && (
                    <SWRConfig
                      value={{ fetcher: fetcher(library, new Map(ABIs)) }}
                    >
                      {!!error && (
                        <Typography
                          variant="h4"
                          color="secondary"
                          style={{ textAlign: "center" }}
                        >
                          {!!error && getErrorMessage(error)}
                        </Typography>
                      )}
                      <FarmStakeCard />
                    </SWRConfig>
                  )}
                  {!active && (
                    <Typography
                      variant="h4"
                      color="secondary"
                      style={{ textAlign: "center" }}
                    >
                      {!!error && getErrorMessage(error)}
                    </Typography>
                  )}
                </Grid>
              </TabPanelGrid>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Banner>
                <h3>
                  <strong style={{ color: "#4353ff" }}>$SWAN</strong>{" "}
                  Distribution Pool
                </h3>
                Phase 2 of the{" "}
                <strong style={{ color: "#4353ff" }}>$SWAN</strong> token launch
                includes a distribution pool with fees that contribute to the
                Blackswan Fund
              </Banner>
              <TabPanelGrid
                container
                justify="center"
                alignContent="center"
                alignItems="center"
              >
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  {!active && (
                    <Typography
                      variant="h4"
                      color="secondary"
                      style={{ textAlign: "center" }}
                    >
                      Please Connect your Metamask
                    </Typography>
                  )}
                  {active && (
                    <SWRConfig
                      value={{ fetcher: fetcher(library, new Map(ABIs)) }}
                    >
                      {!!error && (
                        <h4 style={{ marginTop: "1rem", marginBottom: "0" }}>
                          {getErrorMessage(error)}
                        </h4>
                      )}
                      <PoolStakeCard />
                    </SWRConfig>
                  )}
                </Grid>
              </TabPanelGrid>
            </TabPanel>
          </div>
        </main>
      </div>
    </Wrapper>
  );
};
