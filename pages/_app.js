import "../styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Loading from "./../components/loading/loading";
import { magic } from "./../lib/magic-client";

function MyApp({ Component, pageProps }) {
  // if logged in route to /
  // else route to /login
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   async function fetchData() {
  //     // You can await here
  //     const isLoggedIn = await magic.user.isLoggedIn();
  //     // ...
  //     if (isLoggedIn) {
  //       router.push("/");
  //     } else {
  //       router.push("/login");
  //     }
  //   }
  //   fetchData();
  // }, [router]);

  // to fix the hanging after Loading Magic token
  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return isLoading ? <Loading /> : <Component {...pageProps} />;
  // return <Component {...pageProps} />;
}

export default MyApp;
