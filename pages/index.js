import Head from "next/head";
import Card from "../components/card/card";
import NavBar from "../components/nav/navbar";
import styles from "../styles/Home.module.css";
import Banner from "./../components/banner/banner";
import SectionCards from "./../components/card/section-cards";
import {
  getPopularVideos,
  getVideos,
  getWatchItAgainVideos,
} from "../lib/videos";
// import { startFetchMyQuery } from "../lib/db/hasura";
// import { verifyToken } from "../lib/utils";
import useRedirectUser from "./../utils/redirectUser";

// on Server Side
export async function getServerSideProps(context) {
  /*eslint-disable */
  const { userId, token } = await useRedirectUser(context);
  /*eslint-enable */

  const disneyVideos = await getVideos("disney trailer");
  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);
  // const productivityVideos = await getVideos("productivity");
  // const travelVideos = await getVideos("travel");
  // const popularVideos = await getPopularVideos("disney trailer");
  return {
    props: {
      disneyVideos,
      watchItAgainVideos,
      //  productivityVideos, travelVideos, popularVideos
    },
  };
}

export default function Home({
  disneyVideos,
  watchItAgainVideos = [],
  // travelVideos,
  // productivityVideos,
  // popularVideos,
}) {
  // startFetchMyQuery();
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix Clone</title>
        <meta name="description" content="Netflix clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        {/* <h1>Netflix</h1> */}
        <NavBar username="dan@curuletz.com" />
        <Banner
          videoId="uw6sI24LwYY"
          title="Clifford the red dog"
          subTitle="a very cute dog"
          imgUrl="/static/clifford.webp"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          <SectionCards
            title="Watch It Again"
            videos={watchItAgainVideos}
            size="small"
          />
          {/* <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards
            title="Productivity"
            videos={productivityVideos}
            size="medium"
          />
          <SectionCards title="Popular" videos={popularVideos} size="small" /> */}
        </div>
      </div>
    </div>
  );
}
