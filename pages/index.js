import Head from "next/head";
import Card from "../components/card/card";
import NavBar from "../components/nav/navbar";
import styles from "../styles/Home.module.css";
import Banner from "./../components/banner/banner";
import SectionCards from "./../components/card/section-cards";
import { getVideos } from "../lib/videos";

// on Server Side
export async function getServerSideProps() {
  const disneyVideos = await getVideos();
  return { props: { disneyVideos } };
}

export default function Home({ disneyVideos }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix Clone</title>
        <meta name="description" content="Netflix clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <h1>Netflix</h1> */}
      <NavBar username="dan@curuletz.com" />
      <Banner
        title="Clifford the red dog"
        subTitle="a very cute dog"
        imgUrl="/static/clifford.webp"
      />
      <div className={styles.sectionWrapper}>
        <SectionCards title="Disney" videos={disneyVideos} size="large" />
        <SectionCards title="Medium" videos={disneyVideos} size="medium" />
      </div>
    </div>
  );
}
