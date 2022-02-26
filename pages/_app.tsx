import { AppProps } from 'next/app'
import { ThemeProvider } from '../theme'
import Head from 'next/head'
import React from 'react'
import '../styles.css'
import '../styles/globals.css'
import NavBar from '../components/NavBar'
import styles from '../styles/App.module.css'
import { useState, useEffect } from 'react'
const MyApp = ({ Component, pageProps }: AppProps): React.ReactNode => {
  const [style, setStyle] = useState<React.CSSProperties>({ visibility: 'hidden' })
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
    setStyle({})
  }, [])

  return (
    <>
      <div className={styles['app-container']} style={style}>
        <ThemeProvider>
          <div className={styles['content-container']}>
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </div>
    </>
  )
}

export default MyApp
