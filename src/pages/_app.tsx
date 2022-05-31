import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AgentTierProvider } from "../contexts/AgentTierContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AgentTierProvider>
      <Component {...pageProps} />
    </AgentTierProvider>
  );
}

export default MyApp;
