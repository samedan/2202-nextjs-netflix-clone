// 'totken" and "issuer" come from api/login.js

// find STAT video Id
export async function findVideoIdByUser(token, userId, videoId) {
  const operationsDoc = `
  query findVideoIdByUserId ($userId: String!, $videoId: String!)  {
    stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
      id
      userId
      videoId
      favourited
      watched
    }
  }
  `;
  const response = await queryHesuraGQL(
    operationsDoc,
    "findVideoIdByUserId",
    { videoId, userId },
    token
  );
  return response?.data?.stats.length > 0;
}

// CREATE NEW USER
export async function createNewUser(token, metadata) {
  const operationsDoc = `
  mutation createNewUser (
    $issuer: String!,
    $email: String!,
    $publicAddress: String!)   
    {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
`;
  const { email, issuer, publicAddress } = metadata;
  const response = await queryHesuraGQL(
    operationsDoc,
    "createNewUser",
    { issuer: issuer, email: email, publicAddress: publicAddress },
    token
  );

  console.log(response);

  return response;
}

// IS NEW USER
export async function isNewUser(token, issuer) {
  const operationsDoc = `
  query isNewUser ($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      email
      id
      issuer
    }
  }
`;
  const response = await queryHesuraGQL(
    operationsDoc,
    "isNewUser",
    { issuer: issuer },
    token
  );

  console.log(response);

  return response?.data?.users?.length === 0;
}

// Query
async function queryHesuraGQL(operationsDoc, operationName, variables, token) {
  console.log({ token });
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}
