import jwt from "jsonwebtoken";
import { findVideoIdByUser } from "../../lib/db/hasura";

export default async function stats(req, res) {
  if (req.method === "POST") {
    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(403).send({});
      } else {
        //api/stats?videoId=uw6sI24LwYY
        const videoId = req.query.videoId;
        const decodedToken = jwt.verify(
          token,
          process.env.JWT_SECRET_FROM_HASURA
        );
        const userId = decodedToken.issuer;
        const doesStatsExits = await findVideoIdByUser(token, userId, videoId);
        if (doesStatsExits) {
          // update it
        } else {
          // create it
        }

        res.send({ msg: "stats works", decodedToken, findVideoId });
      }
    } catch (error) {
      console.error("Error occured /stats", error);
      res.status(500).send({ done: false, error: error?.message });
    }
  }
}
