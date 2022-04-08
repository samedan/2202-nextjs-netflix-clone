import styles from "./section-cards.module.css";
import Card from "./card";
import { Link } from "next/link";
import clsx from "classnames";
import Loading from "../loading/loading";

const SectionCards = (props) => {
  const { title, videos = [], size, shouldWrap = false, shouldScale } = props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {videos.map((video, idx) => {
          // console.log(video);
          // console.log(video.id);

          return (
            // <Link href={`/video/${video.id}`} passHref key={idx}>

            <a href={`/video/${video.id}`} key={idx}>
              <Card
                id={idx}
                size={size}
                imgUrl={video.imgUrl}
                shouldScale={shouldScale}
              />
            </a>

            // </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SectionCards;
