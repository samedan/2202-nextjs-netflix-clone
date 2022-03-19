import Head from "next/head";
import Card from "../components/card/card";
import NavBar from "../components/nav/navbar";
import styles from "../styles/Home.module.css";
import Banner from "./../components/banner/banner";
import SectionCards from "./../components/card/section-cards";
import { getPopularVideos, getVideos } from "../lib/videos";

// on Server Side
export async function getServerSideProps() {
  const disneyVideos = await getVideos("disney trailer");
  // const productivityVideos = await getVideos("productivity");
  // const travelVideos = await getVideos("travel");
  // const popularVideos = await getPopularVideos("disney trailer");
  return {
    props: {
      disneyVideos,
      //  productivityVideos, travelVideos, popularVideos
    },
  };
}

export default function Home({
  disneyVideos,
  // travelVideos,
  // productivityVideos,
  // popularVideos,
}) {
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
