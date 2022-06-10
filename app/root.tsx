import { useMantineTheme } from "@mantine/core";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { BrowserHistory } from "history";
import React, { useContext } from "react";
import { useState } from "react";
import { UNSAFE_NavigationContext, useLocation } from "react-router";
import LoadingBar from "react-top-loading-bar";
import discordStyleSheetUrl from "./styles/discord.css";
import fontStyles from "./styles/font.css";
import rootStyles from "./styles/globals.css";
import { DevBuild } from "./shared-components/DevBuild";
import { Document } from "./shared-components/Document";
import { useChangeLanguage } from "remix-i18next";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import { isServer } from "./lib/isServer";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
export { ErrorBoundary } from "~/shared-components/ErrorBoundaryCode";
export { CatchBoundary } from "~/shared-components/CatchBoundary";

type LoaderData = { locale: string };

export let loader: LoaderFunction = async ({ request }) => {
  let locale = await i18next.getLocale(request);
  return json<LoaderData>({ locale });
};

export let handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "translation",
};

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

export default function App() {
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const theme = useMantineTheme();

  const navigation = useContext(UNSAFE_NavigationContext)
    .navigator as BrowserHistory;
  React.useEffect(() => {
    if (navigation) {
      navigation.listen((locationListener) => {
        setProgress(75);
      });
    }
  }, [navigation]);

  React.useEffect(() => {
    setProgress(100);
  }, [location]);

  return (
    <Document>
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
