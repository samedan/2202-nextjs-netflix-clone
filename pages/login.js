import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Login.module.css";
import { useState } from "react";
import Router, { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");

  const router = useRouter();

  const handleOnChangeEmail = (e) => {
    setUserMsg("");
    console.log("event", e);
    const email = e.target.value;
    setEmail(email);
  };

  const handleLoginWithEmail = (e) => {
    e.preventDefault();
    console.log("Login");

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email && email.match(mailformat)) {
      // route to dashboard
      console.log({ email });
      if (email === "same.dan@gmail.com") {
        console.log("good email");
        router.push("/");
      } else {
        setUserMsg("Smth went wrong logging in");
      }
    } else {
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
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            type="text"
            placeholder="Email Address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
          />
          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            Sign In
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
