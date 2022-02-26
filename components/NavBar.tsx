import React, { useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Image from 'next/image'
import Web3Network from './Web3Network'
import Web3Status from './Web3Status'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { injected } from '../connectors'
import { Disclosure } from '@headlessui/react'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      borderBottom: 'solid 1px #e5e7eb',
      height: '80px',
      minWidth: '482px',
      position: 'relative'
    },
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },

    title: {
      flexGrow: 1,
    },
    info: {
      display: 'flex',
    },
    logoContainer: {
      width: '20vw',
      float: 'left',
      "& div": {
        overflow: 'unset',
        marginLeft: 'calc(10vw - 32px - 16px) !important',
        width: '64px'
      }
    },
    web3Status: {
      marginLeft: '10px',
      [theme.breakpoints.down('xs')]: {
        marginRight: '70px',
      }
    }
  })
)
interface NavBarProps {
  children?: React.ReactNode
  activatingConnector: any
  setActivatingConnector: any
  triedEager: any
}
enum ConnectorNames {
  Injected = 'Connect MetaMask',
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
}
const NavBar = (props: NavBarProps) => {
  const classes = useStyles()
  const { activatingConnector, setActivatingConnector, triedEager } = props
  const context = useWeb3React<Web3Provider>()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context
  const [navClassList, setNavClassList] = useState('w-screen gradiant-border-bottom z-10 backdrop-filter backdrop-blur')
  return (
    <header className={`flex flex-row flex-nowrap justify-between w-screen bg-white ${classes.header}`}>
      <Disclosure as="nav" className={navClassList}>
        {({ open }) => (
          <div className="px-4 py-1.5">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${classes.logoContainer}`}>
                  <Image src="/static/imgs/BlackSwanIconBlack.png" alt="Swan Logo" width="64" height="64" />
                </div>
              </div>

              <div className="flex flex-row items-center justify-center w-full lg:w-auto p-4 fixed left-0 bottom-0 lg:relative lg:p-0 lg:bg-transparent">
                <div className="flex items-center justify-between sm:justify-end w-full">
                  {library && library.provider.isMetaMask && (
                    <div className="inline-block">
                      <Web3Network />
                    </div>
                  )}
                  <div className={`${classes.web3Status} w-auto flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto`}>
                    {account && chainId && (
                      <>
                        <div className="py-2 px-3 text-primary text-bold"></div>
                      </>
                    )}
                    <Web3Status />
                  </div>

                  {Object.keys(connectorsByName).map((name) => {
                    const currentConnector = connectorsByName[name]
                    const activating = currentConnector === activatingConnector
                    const connected = currentConnector === connector
                    const disabled = !triedEager || !!activatingConnector || connected || !!error
                    if (disabled === true) {
                    } else {
                      return (
                        <div
                          className="flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
                          onClick={() => {
                            setActivatingConnector(currentConnector)
                            activate(connectorsByName[name])
                          }}
                        >
                          <div className="grid grid-flow-col auto-cols-max items-center rounded-lg bg-dark-1000 text-sm text-secondary py-2 px-3 pointer-events-auto">
                            <img
                              src={'/static/imgs/metamask.png'}
                              className="rounded-md mr-2"
                              style={{ width: 22, height: 22 }}
                            />
                            <div className="text-primary">{name}</div>
                          </div>
                        </div>
                      )
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </Disclosure>
    </header>
  )
}

export default NavBar
