import styles from "./section-cards.module.css";
import Card from "./card";
import { Link } from "next/link";
import Loading from "../loading/loading";

const SectionCards = (props) => {
  const { title, videos, size } = props;
  // console.log({ videos });
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.map((video, idx) => {
          // console.log({ video });
          if (video) {
            return (
              <>
                <Link href={`/video/${video.id}`} passHref>
                  <Card id={idx} size={size} key={idx} imgUrl={video.imgUrl} />
                </Link>
              </>
            );
          } else {
            return <Loading />;
          }
        })}
      </div>
    </section>
  );
};

export default SectionCards;
