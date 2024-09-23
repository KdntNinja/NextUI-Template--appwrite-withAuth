import { AppProps } from "next/app";
import { client } from "./appwrite";

function MyApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}

export default MyApp;
