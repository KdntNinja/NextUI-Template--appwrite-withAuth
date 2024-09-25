import { AppProps } from "next/app";
import { client } from "./appwrite";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}

export default MyApp;