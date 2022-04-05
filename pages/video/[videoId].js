import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "../../styles/video.module.css";
import clsx from "classnames";
import { getYoutubeVideoById } from "../../lib/videos";
import NavBar from "../../components/nav/navbar";
import Like from "./../../components/icons/like-icon";
import DisLike from "./../../components/icons/dislike-icon";
import { useState, useEffect } from "react";

Modal.setAppElement("#__next");

export async function getStaticProps(context) {
  const videoId = context.params.videoId;

  const videoArray = await getYoutubeVideoById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const listOfVideos = ["OYTq3XOyJ1E", "HFw2pGHkCz4", "LmeNVCRtF_s"];
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));
  return { paths, fallback: "blocking" };
}

const Video = ({ video }) => {
  const router = useRouter();
  const videoId = router.query.videoId;

  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDislike, setToggleDislike] = useState(false);

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: "GET",
      });
      const data = await response.json();
      console.log({ data });
      if (data.length > 0) {
        const favourited = data[0].favourited;
        if (favourited === 1) {
          setToggleLike(true);
        } else if (favourited === 0) {
          setToggleDislike(true);
        }
      }
    }
    fetchData();
  }, []);

  const runRatingService = async (favourited) => {
    return await fetch("/api/stats", {
      method: "POST",
      body: JSON.stringify({
        videoId: videoId,
        favourited,
        // watched as true by default on the server
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleToggleDislike = async () => {
    setToggleDislike(!toggleDislike);
    setToggleLike(toggleDislike);
    const val = !toggleDislike;
    const favourited = val ? 0 : 1;
    const response = await runRatingService(favourited);
    console.log("data", await response.json());
  };
  const handleToggleLike = async () => {
    const val = !toggleLike;
    setToggleLike(val);
    setToggleDislike(toggleLike);
    const favourited = val ? 1 : 0;
    const response = await runRatingService(favourited);
    console.log("data", await response.json());
  };

  return (
    <div className={styles.container}>
      <NavBar />
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => router.back}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="player"
          className={styles.videoPlayer}
          type="text/html"
          width="100%"
          height="360"
          src={`http://www.youtube.com/embed/${videoId}?enablejsapi=1&&autoplay=0&origin=http://example.com&controls=0&rel=0`}
          frameBorder="0"
        ></iframe>
        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>

          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={toggleDislike} />
            </div>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>
                  View Count:{" "}
                  <span className={styles.channelTitle}>{viewCount}</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
