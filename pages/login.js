import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Login.module.css";
import { useEffect, useState } from "react";
import { magic } from "../lib/magic-client";
import Router, { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInvisible, setIsInvisible] = useState(false);

  const router = useRouter();

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

  const handleOnChangeEmail = (e) => {
    setUserMsg("");

    const email = e.target.value;
    setEmail(email);
  };

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    // console.log("Login");

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email && email.match(mailformat)) {
      // route to dashboard
      // console.log({ email });
      // if (email === "same.dan@gmail.com") {
      if (email) {
        // log in a user by their email
        setIsLoading(true);
        try {
          setIsInvisible(true);
          const didToken = await magic.auth.loginWithMagicLink({
            email: email,
          });
          // console.log("didToken coming from Magic");
          // console.log({ didToken });
          if (didToken) {
            // setIsLoading(false); fix loading hanging on magik
            const response = await fetch("/api/login", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${didToken}`,
                "Content-Type": "application/json",
              },
            });

            const loggedInResponse = await response.json();
            if (loggedInResponse.done) {
              // console.log({ loggedInResponse });
              setIsInvisible(false);
              router.push("/");
            } else {
              setIsLoading(false);
              setIsInvisible(false);
              setUserMsg("Smth went wrong loggin in");
            }
          }
        } catch {
          // Handle errors if required!
          setIsLoading(false);
          setIsInvisible(false);
          console.error("Smth went wrong with Magic Link", error);
        }
        // router.push("/");
      } else {
        setIsLoading(false);
        setIsInvisible(false);
        setUserMsg("Smth went wrong logging in");
      }
    } else {
      setIsInvisible(false);
      setUserMsg("Please enter a valid email address");
      // return (false)
    }
    // }
    // if (email) {
    //   // route to dashboard
    // } else {
    //   setUserMsg("Please enter a valid email address");
    // }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix Clone Signin</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <a className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image
                src={"/static/netflix.svg"}
                alt="DanFlix"
                width="128px"
                height="34px"
                // blurDataURL="data:..." automatically provided
                // placeholder="blur" // Optional blur-up while loading
              />
            </div>
          </a>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          {!isInvisible ? (
            <>
              <h1 className={styles.signinHeader}>Sign In</h1>

              <input
                type="text"
                placeholder="Email Address"
                className={styles.emailInput}
                onChange={handleOnChangeEmail}
              />
            </>
          ) : (
            <>
              <Image
                src={"/static/loading.gif"}
                alt="Loading"
                width="20px"
                height="20px"
              />
            </>
          )}

          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {isLoading ? "Loading... " : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
