// import videoData from "../data/videos.json";
// import { getVideos } from "./videos";

export const getCommonVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  //   GET https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=surfing&key=[YOUR_API_KEY] HTTP/1.1

  // Authorization: Bearer [YOUR_ACCESS_TOKEN]
  // Accept: application/json

  try {
    const BASE_URL = "https://youtube.googleapis.com/youtube/v3";

    const res = await fetch(
      `${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`
    );

    const data = await res.json();

    //  ERROR
    if (data?.error) {
      console.error("Youtube API error", data.error);
      return [];
    }

    return data?.items.map((item) => {
      const id = item.id?.videoId || item.id;
      return {
        title: item.snippet.title,
        imgUrl: item.snippet.thumbnails.high.url,
        id: id,
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
  const URL =
    "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=FR";
  return getCommonVideos(URL);
};
