// import videoData from "../data/videos.json";
// import { getVideos } from "./videos";

export const getCommonVideos = async (url) => {
  // const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_BACKUP_KEY;

  //   GET https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=surfing&key=[YOUR_API_KEY] HTTP/1.1

  // Authorization: Bearer [YOUR_ACCESS_TOKEN]
  // Accept: application/json

  try {
    const BASE_URL = "https://youtube.googleapis.com/youtube/v3";

    const res = await fetch(
      `${BASE_URL}/${url}&maxResults=1&key=${YOUTUBE_API_KEY}`
    );

    const data = await res.json();
    // console.log("video cat", data);

    //  ERROR
    if (data?.error) {
      console.error("Youtube API error", data.error);
      return [];
    }

    return data?.items.map((item) => {
      console.log({ id: item.id });
      const id = item.id?.videoId || item.id;
      const snippet = item.snippet;
      return {
        title: snippet?.title,
        imgUrl: snippet.thumbnails.high.url,
        id: id,
        description: snippet.description,
        publishTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
  } catch (error) {
    console.error("Smth went wrong with the video library", error);
    return [];
  }
};

export const getVideos = (searchQuery) => {
  const URL = `search?part=snippet&q=${searchQuery}`;
  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  const URL = "videos?part=snippet%2CcontentDetails%2Cstatistics";
  // "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=FR";
  return getCommonVideos(URL);
};

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  // const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=FR&id=${videoId}`;
  return getCommonVideos(URL);
};
