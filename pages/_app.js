import * as React from "react";
import { useEffect } from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../theme";
import createEmotionCache from "../createEmotionCache";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import Navbar from "../components/Navbar";
import "../public/nprogress.css";
import "../public/main.css";
import Footer from "../components/Footer";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url) => {
      console.log(`Loading: ${url}`);
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Did it Flop?</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#e74c3c" />
        <meta
          name="description"
          content="Find out if your favorite movie was a box-office flop!"
        />
        <meta name="og:type" content="website" />
        <meta name="og:title" content="Did it Flop?" />
        <meta
          name="og:description"
          content="Find out if your favorite movie was a box-office flop!"
        />
        <meta
          name="description"
          content="Find out if your favorite movie was a box-office flop!"
        />
        <meta name="og:image" content="/logo.jpg" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Navbar />
        <div id={"content"}>
          <Component {...pageProps} />
        </div>
        <Footer />
      </ThemeProvider>
    </CacheProvider>
  );
}

export function reportWebVitals(metric) {
  console.log(metric);
}
