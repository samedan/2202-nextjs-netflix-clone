// 'totken" and "issuer" come from api/login.js

// INSERT Stats
export async function insertStats(
  token,
  { favourited, userId, watched, videoId }
) {
  const operationsDoc = `
    mutation insertStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
      insert_stats_one(object: {
        favourited: $favourited, 
        userId: $userId, 
        watched: $watched, 
        videoId: $videoId
      }) {
        favourited
        userId    
      }
    }
  `;
  return await queryHasuraGQL(
    operationsDoc,
    "insertStats",
    { favourited, userId, watched, videoId },
    token
  );
}

// UPDATE Stats
export async function updateStats(
  token,
  { favourited, userId, watched, videoId }
) {
  const operationsDoc = `
        mutation updateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
          update_stats(
            _set: {watched: $watched, favourited: $favourited}, 
            where: {
              userId: {_eq: $userId}, 
              videoId: {_eq: $videoId}
            }) {
            returning {
              favourited,
              userId,
              watched,
              videoId
            }
          }
        }
    `;
  return await queryHasuraGQL(
    operationsDoc,
    "updateStats",
    { favourited, userId, watched, videoId },
    token
  );
}

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
  const response = await queryHasuraGQL(
    operationsDoc,
    "findVideoIdByUserId",
    { videoId, userId },
    token
  );
  return response?.data?.stats;
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
  const response = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
    { issuer: issuer, email: email, publicAddress: publicAddress },
    token
  );

  // console.log(response);

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
  const response = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    { issuer: issuer },
    token
  );

  // console.log(response);

  return response?.data?.users?.length === 0;
}

// Watched Video
export async function getWatchedVideos(userId, token) {
  const operationsDoc = `
    query watchedVideos( $userId:String!) {
      stats(where: {
          userId: {_eq: $userId}, 
          watched: {_eq: true}
      }
        ) {
        videoId
      }
    }
  `;
  const response = await queryHasuraGQL(
    operationsDoc,
    "watchedVideos",
    { userId },
    token
  );
  return response?.data?.stats;
}

// get MY-LIST videos
export async function getMyListVideos(userId, token) {
  const operationsDoc = `
    query favouritedVideos( $userId:String!) {
      stats(where: {favourited: {_eq: 1}, userId: {_eq: $userId}}) {
        videoId
      }
    }
  `;
  const response = await queryHasuraGQL(
    operationsDoc,
    "favouritedVideos",
    { userId },
    token
  );
  return response?.data?.stats;
}

// Query
async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
  // console.log({ token });
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
