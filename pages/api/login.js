import { magicAdmin } from "../../lib/magic";
import jwt from "jsonwebtoken";
import { isNewUser, createNewUser } from "../../lib/db/hasura";

export default async function login(req, res) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;

      // Take out 'Bearer_'
      const didToken = auth ? auth.substr(7) : "";

      // invoke Magic server token and
      // get additional info (Metadata) with magicAdmin
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);

      // create jwt
      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000 - 720),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60), //7 Days
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        // secret hasura
        process.env.JWT_SECRET_FROM_HASURA
      );

      const isNewUserQuery = await isNewUser(token, metadata.issuer);
      if (isNewUserQuery) {
        // create a NEW USER
        const createNewUserMutation = await createNewUser(token, metadata);
        console.log({ createNewUserMutation });
        res.send({ done: true, msg: "is a new user" });
      } else {
        // OLD USER
        res.send({ done: true, msg: "not a new user" });
      }
    } catch (error) {
      console.error("Smth went wrong logging in", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
