import { NotificationsProvider } from "@mantine/notifications";
import { useMantineTheme } from "@mantine/core";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { BrowserHistory } from "history";
import type { ColorScheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import React, { useContext, useEffect } from "react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useState } from "react";
import { UNSAFE_NavigationContext, useLocation } from "react-router";
import LoadingBar from "react-top-loading-bar";
export { ErrorBoundary } from "~/components/ErrorBoundaryCode";
import discordStyleSheetUrl from "./styles/discord.css";
import fontStyles from "./styles/font.css";
import rootStyles from "./styles/globals.css";
import { useColorScheme } from "@mantine/hooks";
import useLocalStorage from "./hooks/useLocalStorage";
export { CatchBoundary } from "~/components/CatchBoundary";

export const links: LinksFunction = () => {
  return [
    { href: fontStyles, rel: "stylesheet" },
    { href: discordStyleSheetUrl, rel: "stylesheet" },
    { href: rootStyles, rel: "stylesheet" },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Netor",
  viewport: "width=device-width,initial-scale=1",
});

import { DEFAULT_THEME, LoadingOverlay } from "@mantine/core";
import { json } from "@remix-run/server-runtime";
import { DevBuild } from "./components/DevBuild";
import { Document } from "./components/Document";

export async function loader() {
  return json({
    ENV: {
      DEV_BUILD: process.env.DEV?.toString() === "yes",
    },
  });
}

const customLoader = (
  <svg
    width="54"
    height="54"
    viewBox="0 0 38 38"
    xmlns="http://www.w3.org/2000/svg"
    stroke={DEFAULT_THEME.colors.indigo[6]}
  >
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)" strokeWidth="2">
        <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  </svg>
);

export default function App() {
  const [progress, setProgress] = useState(0);
  const [loaderVisible, setLoaderVisible] = useState<boolean>(false);
  const location = useLocation();
  const theme = useMantineTheme();

  const navigation = useContext(UNSAFE_NavigationContext)
    .navigator as BrowserHistory;
  React.useEffect(() => {
    if (navigation) {
      navigation.listen((locationListener) => {
        setLoaderVisible(true);
        setProgress(75);
      });
    }
  }, [navigation]);

  React.useEffect(() => {
    setLoaderVisible(false);
    setProgress(100);
  }, [location]);

  return (
    <Document>
      <LoadingOverlay loader={customLoader} visible={loaderVisible} />
      <LoadingBar
        shadow
        color={theme.colors.indigo[5]}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <DevBuild />
      <Outlet />
    </Document>
  );
}
