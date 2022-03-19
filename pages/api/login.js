import { magicAdmin } from "../../lib/magic";
import jwt from "jsonwebtoken";
import { isNewUser } from "../../lib/db/hasura";

export default async function login(req, res) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      console.log(auth);
      // Take out 'Bearer_'
      const didToken = auth ? auth.substr(7) : "";
      // invoke Magic server token
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);
      console.log({ metadata });

      // create jwt
      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        // secret hasura
        process.env.JWT_SECRET_FROM_HASURA
      );
      console.log("issuer", metadata.issuer);

      const isNewUserQuery = await isNewUser(token, metadata.issuer);
      console.log("isNewUserQuery", isNewUserQuery);

      res.send({ done: true, isNewUserQuery });
    } catch (error) {
      console.error("Smth went wrong loggin in", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
