import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WidgetsProvider } from "@sitecore-search/react";
import type { Environment } from "@sitecore-search/data";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WidgetsProvider
      env={process.env.NEXT_PUBLIC_SEARCH_ENV as Environment}
      customerKey={process.env.NEXT_PUBLIC_SEARCH_CUSTOMER_KEY}
      apiKey={process.env.NEXT_PUBLIC_SEARCH_API_KEY}
    >
      <Component {...pageProps} />;
    </WidgetsProvider>
  );
}
